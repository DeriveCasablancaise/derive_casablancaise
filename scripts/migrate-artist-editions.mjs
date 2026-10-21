// Copies artistCategory into editions for artists that have no editions yet.
// Dry run by default, nothing is written without --apply. Never deletes artistCategory.
//
//   node --env-file=.env.local scripts/migrate-artist-editions.mjs
//   node --env-file=.env.local scripts/migrate-artist-editions.mjs --apply
//
// tsx is not installed, hence plain .mjs. mongoose is already a dependency.
import mongoose from 'mongoose';

const ALL_EDITIONS = ['2022', '2024', '2026'];
const apply = process.argv.includes('--apply');

const url = process.env.MONGODB_URL;
if (!url) {
  console.error('MONGODB_URL is not set');
  process.exit(1);
}

// same dbName as src/lib/database/index.ts
await mongoose.connect(url, { dbName: 'darja' });

try {
  const artists = mongoose.connection.collection('artists');

  // missing or empty editions means not migrated yet
  const notMigrated = { 'editions.0': { $exists: false } };

  const total = await artists.countDocuments();
  const todo = await artists.find(notMigrated).toArray();
  console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${total} artists, ${todo.length} to migrate`);

  let migrated = 0;
  let skipped = 0;

  for (const artist of todo) {
    const old = artist.artistCategory;
    const editions =
      old === 'all' ? ALL_EDITIONS : ALL_EDITIONS.includes(old) ? [old] : null;

    if (!editions) {
      skipped++;
      console.log(`SKIP  ${artist.frenchName}: unusable artistCategory ${JSON.stringify(old)}`);
      continue;
    }

    console.log(`${artist.frenchName}: ${JSON.stringify(old)} -> [${editions.join(', ')}]`);

    if (apply) {
      // the filter is repeated so a rerun or a concurrent edit is never overwritten
      const res = await artists.updateOne(
        { _id: artist._id, ...notMigrated },
        { $set: { editions } },
      );
      if (res.modifiedCount === 1) migrated++;
    } else {
      migrated++;
    }
  }

  console.log(
    `${apply ? 'Migrated' : 'Would migrate'}: ${migrated}, skipped: ${skipped}, already done: ${total - todo.length}`,
  );
  if (!apply) console.log('Nothing written. Rerun with --apply to write.');
} finally {
  await mongoose.disconnect();
}
