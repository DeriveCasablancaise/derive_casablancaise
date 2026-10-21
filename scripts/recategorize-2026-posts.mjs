// Sets postCategory of the 2026 posts to the value in seed/2026/posts.json.
// Matches by yearOfEdition + frenchTitle + day (the seed key) and changes nothing else.
// Dry run by default, safe to run twice, 2022 and 2024 posts are never matched.
//
//   node --env-file=.env.local scripts/recategorize-2026-posts.mjs
//   node --env-file=.env.local scripts/recategorize-2026-posts.mjs --apply --confirm-db darja
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';
import { dayRange, planRecategorize, postKey } from './seed-2026-helpers.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
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

const posts = JSON.parse(readFileSync(new URL('../seed/2026/posts.json', import.meta.url), 'utf8'));

const counts = { updated: 0, skipped: 0, missing: 0, errors: 0 };
const bump = (kind, label, detail = '') => {
  counts[kind]++;
  console.log(`${kind.toUpperCase().padEnd(8)} ${label}${detail ? ` (${detail})` : ''}`);
};

await mongoose.connect(url, { dbName });

try {
  const connectedDb = mongoose.connection.name;
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on database "${connectedDb}"`);

  if (apply && confirmDb !== connectedDb) {
    console.error(`Refusing: --confirm-db "${confirmDb}" does not match the connected database "${connectedDb}"`);
    process.exitCode = 1;
  } else {
    const Posts = mongoose.connection.collection(mongoose.pluralize()('Post'));

    for (const p of posts) {
      const label = `${p.start.slice(0, 10)} ${p.frenchTitle}`;
      try {
        const [from, to] = dayRange(p.start);
        const found = await Posts.find({
          yearOfEdition: '2026',
          frenchTitle: p.frenchTitle,
          startDateTime: { $gte: from, $lt: to },
        }).toArray();

        const plan = planRecategorize(p, found);
        if (plan.action === 'error') throw new Error(plan.reason);
        if (plan.action === 'missing') {
          bump('missing', label, `not in database, ${postKey(p)}`);
          continue;
        }
        if (plan.action === 'skip') {
          bump('skipped', label, `already ${p.postCategory}`);
          continue;
        }
        if (apply) {
          // the filter repeats the old value, so an edit made meanwhile is not overwritten
          const res = await Posts.updateOne(
            { _id: plan.id, yearOfEdition: '2026', postCategory: plan.from },
            { $set: { postCategory: plan.to } },
          );
          if (res.matchedCount !== 1) {
            bump('skipped', label, 'changed meanwhile, rerun');
            continue;
          }
        }
        bump('updated', label, `${plan.from} -> ${plan.to}`);
      } catch (err) {
        bump('errors', label, err.message);
      }
    }

    console.log(
      `\n${apply ? 'Done' : 'Dry run, nothing written'}: updated ${counts.updated}, skipped ${counts.skipped}, missing ${counts.missing}, errors ${counts.errors}`,
    );
    if (counts.errors > 0) process.exitCode = 1;
  }
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
