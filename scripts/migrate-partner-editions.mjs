// Copies yearOfPartnership into editions for partners that have no editions yet.
// 'both' becomes 2022 and 2024, never 2026.
// Dry run by default, nothing is written without --apply. Never deletes yearOfPartnership.
//
//   node --env-file=.env.local scripts/migrate-partner-editions.mjs
//   node --env-file=.env.local scripts/migrate-partner-editions.mjs --apply
//
// tsx is not installed, hence plain .mjs. mongoose is already a dependency.
import mongoose from 'mongoose';

const LEGACY = {
  2022: ['2022'],
  2024: ['2024'],
  both: ['2022', '2024'],
};
const apply = process.argv.includes('--apply');

const url = process.env.MONGODB_URL;
if (!url) {
  console.error('MONGODB_URL is not set');
  process.exit(1);
}

// same dbName as src/lib/database/index.ts
await mongoose.connect(url, { dbName: 'darja' });

try {
  const partners = mongoose.connection.collection('partners');

  // missing or empty editions means not migrated yet
  const notMigrated = { 'editions.0': { $exists: false } };

  const total = await partners.countDocuments();
  const todo = await partners.find(notMigrated).toArray();
  console.log(`${apply ? 'APPLY' : 'DRY RUN'}: ${total} partners, ${todo.length} to migrate`);

  let migrated = 0;
  let skipped = 0;

  for (const partner of todo) {
    const old = partner.yearOfPartnership;
    const editions = Object.hasOwn(LEGACY, old) ? LEGACY[old] : null;

    if (!editions) {
      skipped++;
      console.log(`SKIP  ${partner.frenchName}: unusable yearOfPartnership ${JSON.stringify(old)}`);
      continue;
    }

    console.log(`${partner.frenchName}: ${JSON.stringify(old)} -> [${editions.join(', ')}]`);

    if (apply) {
      // the filter is repeated so a rerun or a concurrent edit is never overwritten
      const res = await partners.updateOne(
        { _id: partner._id, ...notMigrated },
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
