// Attaches the prepared images (prep-images.mjs output) to the seeded 2026 artists.
// Dry run by default. Images are set only on artists whose images array is empty, nothing is removed.
//
//   node --env-file=.env.local scripts/seed-artist-images-2026.mjs <out folder>
//   node --env-file=.env.local scripts/seed-artist-images-2026.mjs <out folder> --apply --confirm-db darja
//   the folder holds manifest.csv and the jpgs; --manifest <file> reads another manifest
//
// Uploads go through UTApi (UPLOADTHING_TOKEN). seed/2026/uploads-ledger.json maps the hash of each
// uploaded file to its url, so a second run never uploads the same file again.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import mongoose from 'mongoose';
import { UTApi } from 'uploadthing/server';
import { findArtistDoc, parseManifest, planImages, publicUrl } from './seed-artist-images-2026-helpers.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const confirmDb = valueOf('--confirm-db');
const folderArg = args.find((a, i) => !a.startsWith('--') && !['--confirm-db', '--manifest'].includes(args[i - 1]));

if (!folderArg) {
  console.error('usage: seed-artist-images-2026.mjs <out folder> [--manifest file] [--apply --confirm-db <databaseName>]');
  process.exit(1);
}
const folder = resolve(folderArg);
const manifestPath = resolve(valueOf('--manifest') ?? join(folder, 'manifest.csv'));

const url = process.env.SEED_MONGODB_URL || process.env.MONGODB_URL;
if (!url) {
  console.error('SEED_MONGODB_URL (or MONGODB_URL) is not set');
  process.exit(1);
}
// the app always uses "darja" (src/lib/database/index.ts)
const dbName = process.env.SEED_DB_NAME || 'darja';

if (apply && !confirmDb) {
  console.error(`--apply needs --confirm-db <databaseName> (target is "${dbName}")`);
  process.exit(1);
}
if (apply && !process.env.UPLOADTHING_TOKEN) {
  console.error('UPLOADTHING_TOKEN is not set');
  process.exit(1);
}

const MAX_BYTES = 4 * 1024 * 1024;
const ledgerPath = new URL('../seed/2026/uploads-ledger.json', import.meta.url);
const seedArtists = JSON.parse(readFileSync(new URL('../seed/2026/artists.json', import.meta.url), 'utf8'));

let byArtist;
try {
  byArtist = parseManifest(readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error(`manifest: ${err.message}`);
  process.exit(1);
}

const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : {};
const saveLedger = () => {
  // written beside, then renamed, so a crash never leaves half a ledger
  const tmp = new URL('../seed/2026/uploads-ledger.json.tmp', import.meta.url);
  writeFileSync(tmp, JSON.stringify(ledger, null, 2) + '\n');
  renameSync(tmp, ledgerPath);
};

const counts = { updated: 0, skipped: 0, uploaded: 0, errors: 0 };
const bump = (kind, label, detail = '') => {
  counts[kind]++;
  console.log(`${kind.toUpperCase().padEnd(8)} ${label}${detail ? ` (${detail})` : ''}`);
};

// reads and checks one file of the manifest
function loadFile(name) {
  const path = join(folder, name);
  if (!existsSync(path)) throw new Error(`${name} is not in ${folder}`);
  const size = statSync(path).size;
  if (size >= MAX_BYTES) throw new Error(`${name} is ${size} bytes, over the 4 MB limit`);
  const data = readFileSync(path);
  if (data[0] !== 0xff || data[1] !== 0xd8) throw new Error(`${name} is not a JPEG`);
  return { name, data, hash: createHash('sha256').update(data).digest('hex') };
}

const unknown = [...byArtist.keys()].filter((k) => !seedArtists.some((a) => a.key === k));
for (const k of unknown) bump('errors', k, 'artist key not in seed/2026/artists.json');

await mongoose.connect(url, { dbName });

try {
  const connectedDb = mongoose.connection.name;
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on database "${connectedDb}"`);

  if (apply && confirmDb !== connectedDb) {
    console.error(`Refusing: --confirm-db "${confirmDb}" does not match the connected database "${connectedDb}"`);
    process.exitCode = 1;
  } else {
    const Artists = mongoose.connection.collection(mongoose.pluralize()('Artist'));
    const docs = await Artists.find().toArray();
    const utapi = apply ? new UTApi({ token: process.env.UPLOADTHING_TOKEN }) : null;

    for (const seed of seedArtists) {
      const names = byArtist.get(seed.key);
      if (!names) continue;
      const label = seed.frenchName;
      try {
        const { doc, error } = findArtistDoc(seed, docs);
        if (error) throw new Error(error);

        // an artist that already has images is left alone, and nothing is uploaded for it
        const gate = planImages(doc, names);
        if (gate.action === 'skip') {
          bump('skipped', label, gate.reason);
          continue;
        }

        const files = names.map(loadFile);
        const urls = [];
        for (const f of files) {
          const known = ledger[f.hash];
          if (known) {
            urls.push(known.url);
            console.log(`         ${f.name} -> ${known.url} (already uploaded)`);
            continue;
          }
          if (!apply) {
            urls.push(`(new upload: ${f.name})`);
            console.log(`         ${f.name} would be uploaded (${(f.data.length / 1e6).toFixed(2)} MB)`);
            continue;
          }
          const res = await utapi.uploadFiles(new File([f.data], f.name, { type: 'image/jpeg' }));
          if (res.error || !res.data?.key) throw new Error(`upload of ${f.name} failed: ${res.error?.message ?? 'no key'}`);
          const fileUrl = publicUrl(res.data.key);
          ledger[f.hash] = { name: f.name, key: res.data.key, url: fileUrl, uploadedAt: new Date().toISOString() };
          saveLedger();
          urls.push(fileUrl);
          bump('uploaded', f.name, fileUrl);
        }

        console.log(`         images: ${JSON.stringify(urls)}`);
        if (apply) {
          // the filter repeats the "still empty" check, so a concurrent edit is never overwritten
          const res = await Artists.updateOne({ _id: doc._id, images: { $in: [null, []] } }, { $set: { images: urls } });
          if (res.matchedCount !== 1) {
            bump('skipped', label, 'images changed meanwhile, rerun');
            continue;
          }
        }
        bump('updated', label, `${urls.length} image(s)`);
      } catch (err) {
        bump('errors', label, err.message);
      }
    }

    console.log(
      `\n${apply ? 'Done' : 'Dry run, nothing written'}: updated ${counts.updated}, uploaded ${counts.uploaded}, skipped ${counts.skipped}, errors ${counts.errors}`,
    );
  }
  if (counts.errors > 0) process.exitCode = 1;
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
