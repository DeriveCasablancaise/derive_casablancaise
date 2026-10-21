// Seeds the 2026 landing, artists and posts from seed/2026/*.json.
// Dry run by default. Nothing is deleted, no non-empty field of an existing document is overwritten.
//
//   node --env-file=.env.local scripts/seed-2026.mjs
//   node --env-file=.env.local scripts/seed-2026.mjs --apply --confirm-db darja
//   add --force-landing to replace the texts of a landing that already has some
//
// tsx is not installed, hence plain .mjs. mongoose is already a dependency.
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import {
  dayRange,
  editionsWith,
  isEmptyValue,
  normaliseName,
  postKey,
  wallClockToDate,
} from './seed-2026-helpers.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const forceLanding = args.includes('--force-landing');
const confirmIdx = args.indexOf('--confirm-db');
const confirmDb = confirmIdx >= 0 ? args[confirmIdx + 1] : undefined;

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

const seed = (name) =>
  JSON.parse(readFileSync(new URL(`../seed/2026/${name}`, import.meta.url), 'utf8'));
const landing = seed('landing.json');
const artists = seed('artists.json');
const posts = seed('posts.json');

// values copied from post.model.ts
const CATEGORIES = ['danse', 'musique', 'theatre', 'lectures', 'cinema', 'conference', 'ateliers', 'autres'];
const SUB_CATEGORIES = ['rencontres', 'expositions', 'productions'];
const LANDING_TEXTS = ['text1Fr', 'text1Ar', 'text2Fr', 'text2Ar', 'text3Fr', 'text3Ar'];

const counts = { created: 0, updated: 0, skipped: 0, errors: 0 };
const bump = (kind, label, detail = '') => {
  counts[kind]++;
  console.log(`${kind.toUpperCase().padEnd(8)} ${label}${detail ? ` (${detail})` : ''}`);
};

await mongoose.connect(url, { dbName });

try {
  const connectedDb = mongoose.connection.name;
  let host = '';
  try {
    host = new URL(url).host.split('@').pop();
  } catch {}
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on database "${connectedDb}"${host ? ` (host ${host})` : ''}`);

  if (apply && confirmDb !== connectedDb) {
    console.error(`Refusing: --confirm-db "${confirmDb}" does not match the connected database "${connectedDb}"`);
    process.exitCode = 1;
  } else {
    // collection names come from the models' names, like mongoose does
    const pluralize = mongoose.pluralize();
    const db = mongoose.connection;
    const Artists = db.collection(pluralize('Artist'));
    const Posts = db.collection(pluralize('Post'));
    const Landings = db.collection(pluralize('Derive2026'));
    console.log(`collections: ${Artists.collectionName}, ${Posts.collectionName}, ${Landings.collectionName}`);

    // artists
    console.log('\n-- artists');
    const existing = new Map();
    for (const doc of await Artists.find().toArray()) {
      const key = normaliseName(doc.frenchName);
      // first one wins, a duplicate in the database is reported but left alone
      if (existing.has(key)) console.log(`NOTE     duplicate artist name in database: ${doc.frenchName}`);
      else existing.set(key, doc);
    }
    // seed artist key -> _id (existing, inserted, or a placeholder in a dry run)
    const artistIds = new Map();

    for (const a of artists) {
      const label = a.frenchName;
      try {
        const doc = existing.get(normaliseName(a.frenchName));
        if (!doc) {
          const record = {
            frenchName: a.frenchName,
            arabicName: a.arabicName,
            frenchText: a.frenchText,
            arabicText: a.arabicText,
            images: a.images ?? [],
            editions: a.editions,
            isInHomepage: false,
            createdAt: new Date(),
            __v: 0,
          };
          if (apply) artistIds.set(a.key, (await Artists.insertOne(record)).insertedId);
          else artistIds.set(a.key, `(new ${a.key})`);
          bump('created', label);
          continue;
        }

        artistIds.set(a.key, doc._id);
        const set = {};
        const empties = {};
        const nextEditions = editionsWith(doc, '2026');
        if (nextEditions) set.editions = nextEditions;
        for (const f of ['frenchText', 'arabicText', 'images']) {
          if (isEmptyValue(doc[f]) && !isEmptyValue(a[f])) {
            set[f] = a[f];
            empties[f] = { $in: [null, '', []] };
          }
        }
        if (Object.keys(set).length === 0) {
          bump('skipped', label, 'already has 2026');
          continue;
        }
        if (apply) {
          // the filter repeats the "still empty" checks, so a concurrent edit is never overwritten
          const filter = { _id: doc._id, ...empties };
          if (nextEditions) {
            filter.editions = doc.editions === undefined ? { $exists: false } : doc.editions;
          }
          const res = await Artists.updateOne(filter, { $set: set });
          if (res.matchedCount !== 1) {
            bump('skipped', label, 'changed meanwhile, rerun');
            continue;
          }
        }
        bump('updated', label, `set ${Object.keys(set).join(', ')}`);
      } catch (err) {
        bump('errors', label, err.message);
      }
    }

    // posts
    console.log('\n-- posts');
    for (const p of posts) {
      const label = `${p.start.slice(0, 10)} ${p.frenchTitle}`;
      try {
        if (p.yearOfEdition !== '2026') throw new Error('yearOfEdition is not 2026');
        if (!CATEGORIES.includes(p.postCategory)) throw new Error(`unknown category ${p.postCategory}`);
        if (p.subCategory && !SUB_CATEGORIES.includes(p.subCategory)) throw new Error(`unknown subCategory ${p.subCategory}`);
        if (!p.frenchTitle?.trim()) throw new Error('empty French title');

        const ids = p.artists.map((k) => {
          const id = artistIds.get(k);
          if (!id) throw new Error(`artist ${k} was not resolved`);
          return id;
        });

        const [from, to] = dayRange(p.start);
        const found = await Posts.findOne({
          yearOfEdition: p.yearOfEdition,
          frenchTitle: p.frenchTitle,
          startDateTime: { $gte: from, $lt: to },
        });
        if (found) {
          bump('skipped', label, `exists ${postKey(p)}`);
          continue;
        }

        const record = {
          frenchTitle: p.frenchTitle,
          arabicTitle: p.arabicTitle,
          frenchText: p.frenchText,
          arabicText: p.arabicText,
          images: p.images ?? [],
          startDateTime: wallClockToDate(p.start),
          endDateTime: wallClockToDate(p.end),
          postCategory: p.postCategory,
          yearOfEdition: p.yearOfEdition,
          location: p.location,
          locationAr: p.locationAr,
          // post.artists is [String]
          artists: ids.map(String),
          createdAt: new Date(),
          __v: 0,
        };
        if (p.subCategory) record.subCategory = p.subCategory;
        if (p.thumbnail) record.thumbnailImage = p.thumbnail;
        if (p.url) record.url = p.url;

        if (apply) await Posts.insertOne(record);
        bump('created', label, `${p.postCategory}${p.subCategory ? '/' + p.subCategory : ''}, ${p.artists.length} artists`);
      } catch (err) {
        bump('errors', label, err.message);
      }
    }

    // landing singleton
    console.log('\n-- landing');
    try {
      const doc = await Landings.findOne();
      const texts = Object.fromEntries(LANDING_TEXTS.map((f) => [f, landing[f] ?? '']));
      if (!doc) {
        const now = new Date();
        const record = {
          ...texts,
          video1Thumbnail: '',
          video1IframeLink: '',
          video1TitleFr: '',
          video1TitleAr: '',
          video2Thumbnail: '',
          video2IframeLink: '',
          video2TitleFr: '',
          video2TitleAr: '',
          backgroundImage: landing.backgroundImage ?? '',
          createdAt: now,
          updatedAt: now,
          __v: 0,
        };
        if (apply) await Landings.insertOne(record);
        bump('created', 'Derive2026 landing');
      } else if (LANDING_TEXTS.some((f) => !isEmptyValue(doc[f])) && !forceLanding) {
        bump('skipped', 'Derive2026 landing', 'has texts, use --force-landing to replace them');
      } else {
        if (apply) await Landings.updateOne({ _id: doc._id }, { $set: { ...texts, updatedAt: new Date() } });
        bump('updated', 'Derive2026 landing', forceLanding ? 'forced' : 'texts were empty');
      }
    } catch (err) {
      bump('errors', 'Derive2026 landing', err.message);
    }

    console.log(
      `\n${apply ? 'Done' : 'Dry run, nothing written'}: created ${counts.created}, updated ${counts.updated}, skipped ${counts.skipped}, errors ${counts.errors}`,
    );
    if (counts.errors > 0) process.exitCode = 1;
  }
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
