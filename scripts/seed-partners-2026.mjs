// Adds the 2026 partners from the prepared logos (partner-logos prep tool output).
// Dry run by default. A partner whose name already exists is skipped, nothing existing is ever changed or deleted.
//
//   node --env-file=.env.local scripts/seed-partners-2026.mjs <out folder>
//   node --env-file=.env.local scripts/seed-partners-2026.mjs <out folder> --apply --confirm-db darja
//   the folder holds manifest.csv and the webp files; --manifest <file> reads another manifest
//
// Names that still look like file names (number prefix, "Logo", copy suffix...) are held back, fix them in
// the prep tool's names.json and prepare again. The Order collection is not touched: partners missing
// from an order list are shown last.
// Uploads go through UTApi (UPLOADTHING_TOKEN). seed/2026/partners-ledger.json maps the hash of each
// uploaded file to its url, so a second run never uploads the same file again.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import mongoose from 'mongoose';
import { UTApi } from 'uploadthing/server';
import { publicUrl } from './seed-artist-images-2026-helpers.mjs';
import {
  buildPartnerRecord,
  isWebp,
  lackingEdition,
  parseManifest,
  partnerEditions,
  planPartners,
} from './seed-partners-2026-helpers.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const confirmDb = valueOf('--confirm-db');
const folderArg = args.find((a, i) => !a.startsWith('--') && !['--confirm-db', '--manifest'].includes(args[i - 1]));

if (!folderArg) {
  console.error('usage: seed-partners-2026.mjs <out folder> [--manifest file] [--apply --confirm-db <databaseName>]');
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
const ledgerPath = new URL('../seed/2026/partners-ledger.json', import.meta.url);

let rows;
try {
  rows = parseManifest(readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error(`manifest: ${err.message}`);
  process.exit(1);
}

const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : {};
const saveLedger = () => {
  // written beside, then renamed, so a crash never leaves half a ledger
  const tmp = new URL('../seed/2026/partners-ledger.json.tmp', import.meta.url);
  writeFileSync(tmp, JSON.stringify(ledger, null, 2) + '\n');
  renameSync(tmp, ledgerPath);
};

const counts = { created: 0, skipped: 0, review: 0, uploaded: 0, errors: 0 };
const bump = (kind, label, detail = '') => {
  counts[kind]++;
  console.log(`${kind.toUpperCase().padEnd(8)} ${label}${detail ? ` (${detail})` : ''}`);
};

// reads and checks one logo of the manifest
function loadFile(name) {
  const path = join(folder, name);
  if (!existsSync(path)) throw new Error(`${name} is not in ${folder}`);
  const size = statSync(path).size;
  if (size >= MAX_BYTES) throw new Error(`${name} is ${size} bytes, over the 4 MB limit`);
  const data = readFileSync(path);
  if (!isWebp(data)) throw new Error(`${name} is not a WebP file`);
  return { name, data, hash: createHash('sha256').update(data).digest('hex') };
}

await mongoose.connect(url, { dbName });

try {
  const connectedDb = mongoose.connection.name;
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on database "${connectedDb}"`);

  if (apply && confirmDb !== connectedDb) {
    console.error(`Refusing: --confirm-db "${confirmDb}" does not match the connected database "${connectedDb}"`);
    process.exitCode = 1;
  } else {
    const Partners = mongoose.connection.collection(mongoose.pluralize()('Partner'));
    const docs = await Partners.find().toArray();
    const utapi = apply ? new UTApi({ token: process.env.UPLOADTHING_TOKEN }) : null;
    const plan = planPartners(rows, docs);
    console.log(`${rows.length} logos in the manifest, ${docs.length} partners in the database\n`);

    for (const { row, action, docs: found, hint } of plan) {
      const label = row.partnerName;
      try {
        if (action === 'skip') {
          bump('skipped', label, `exists, skip${found.length > 1 ? `, ${found.length} share this name` : ''}`);
          continue;
        }
        if (action === 'review') {
          bump('review', label, `name to settle (${row.flags.join(', ')})${hint ? `; looks like existing "${hint}"` : ''}`);
          continue;
        }

        const file = loadFile(row.outputName);
        let logoUrl = ledger[file.hash]?.url;
        if (!logoUrl && !apply) {
          console.log(`         ${file.name} would be uploaded (${(file.data.length / 1e3).toFixed(1)} KB)`);
          logoUrl = `(new upload: ${file.name})`;
        } else if (!logoUrl) {
          const res = await utapi.uploadFiles(new File([file.data], file.name, { type: 'image/webp' }));
          if (res.error || !res.data?.key) throw new Error(`upload of ${file.name} failed: ${res.error?.message ?? 'no key'}`);
          logoUrl = publicUrl(res.data.key);
          ledger[file.hash] = { name: file.name, key: res.data.key, url: logoUrl, uploadedAt: new Date().toISOString() };
          saveLedger();
          counts.uploaded++;
          console.log(`UPLOADED ${file.name} -> ${logoUrl}`);
        } else {
          console.log(`         ${file.name} -> ${logoUrl} (already uploaded)`);
        }

        if (apply) await Partners.insertOne(buildPartnerRecord(row, logoUrl));
        bump('created', label, 'new, will upload and create');
      } catch (err) {
        bump('errors', label, err.message);
      }
    }

    const lacking = lackingEdition(plan);
    console.log('\n-- existing partners that match but lack 2026 (not changed)');
    if (lacking.length === 0) console.log('none');
    for (const d of lacking) console.log(`         ${d.frenchName} (editions: ${partnerEditions(d).join(', ') || 'none'})`);

    console.log(
      `\n${apply ? 'Done' : 'Dry run, nothing written'}: created ${counts.created}, skipped ${counts.skipped}, held for name review ${counts.review}, uploaded ${counts.uploaded}, errors ${counts.errors}`,
    );
    if (counts.errors > 0) process.exitCode = 1;
  }
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
