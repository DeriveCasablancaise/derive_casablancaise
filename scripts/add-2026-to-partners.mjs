// Adds the 2026 edition to the partners of 2024, and gives 2026 a partner order.
// Dry run by default. Never removes anything, never touches 2022/2024 membership.
//
//   node --env-file=.env.local scripts/add-2026-to-partners.mjs
//   node --env-file=.env.local scripts/add-2026-to-partners.mjs --only "Name 1,Name 2"
//   node --env-file=.env.local scripts/add-2026-to-partners.mjs --exclude "Name 1"
//   node --env-file=.env.local scripts/add-2026-to-partners.mjs --apply --confirm-db darja
//
// tsx is not installed, hence plain .mjs. mongoose is already a dependency.
import mongoose from 'mongoose';
import { normaliseName } from './seed-2026-helpers.mjs';
import {
  editionsUpdate,
  mergeOrder,
  parseNames,
  selectPartners,
} from './add-2026-to-partners-helpers.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const valueOf = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const confirmDb = valueOf('--confirm-db');
const only = parseNames(valueOf('--only'));
const exclude = parseNames(valueOf('--exclude'));

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

await mongoose.connect(url, { dbName });

try {
  const connectedDb = mongoose.connection.name;
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on database "${connectedDb}"`);

  if (apply && confirmDb !== connectedDb) {
    console.error(`Refusing: --confirm-db "${confirmDb}" does not match the connected database "${connectedDb}"`);
    process.exitCode = 1;
  } else {
    // collection names come from the models' names, like mongoose does
    const pluralize = mongoose.pluralize();
    const Partners = mongoose.connection.collection(pluralize('Partner'));
    const Orders = mongoose.connection.collection(pluralize('Order'));

    const all = await Partners.find().toArray();
    const selected = selectPartners(all, { only, exclude });

    // a name given to --only / --exclude that matches no partner of 2024 is most likely a typo
    const selectedNames = new Set(selected.map((p) => normaliseName(p.frenchName)));
    const known = new Set(all.map((p) => normaliseName(p.frenchName)));
    for (const n of only) {
      if (!selectedNames.has(n)) console.log(`NOTE     --only "${n}" matches no partner of 2024`);
    }
    for (const n of exclude) {
      if (!known.has(n)) console.log(`NOTE     --exclude "${n}" matches no partner`);
    }

    console.log(`\n-- partners (${selected.length} of 2024 selected, ${all.length} in total)`);
    let changed = 0;
    for (const p of selected) {
      const label = p.frenchName;
      const update = editionsUpdate(p);
      if (!update) {
        console.log(`SKIPPED  ${label} (already has 2026)`);
        continue;
      }
      if (apply) {
        // the filters make a rerun or a concurrent edit harmless
        const res =
          update.kind === 'addToSet'
            ? await Partners.updateOne({ _id: p._id }, { $addToSet: { editions: '2026' } })
            : await Partners.updateOne(
                { _id: p._id, 'editions.0': { $exists: false } },
                { $set: { editions: update.editions } },
              );
        if (res.matchedCount !== 1) {
          console.log(`SKIPPED  ${label} (changed meanwhile, rerun)`);
          continue;
        }
      }
      changed++;
      console.log(
        `UPDATED  ${label} (${update.kind === 'set' ? `editions -> [${update.editions.join(', ')}]` : 'add 2026'})`,
      );
    }

    // order of 2026
    console.log('\n-- order');
    const order2026 = await Orders.findOne({ year: '2026' });
    const order2024 = await Orders.findOne({ year: '2024' });
    const nameOf = new Map(all.map((p) => [String(p._id), p.frenchName]));
    const { orderedIds, added } = mergeOrder(
      order2026 ? order2026.orderedIds : null,
      order2024?.orderedIds,
      selected.map((p) => p._id),
    );

    if (!order2026) {
      console.log(`No 2026 order: ${apply ? 'creating' : 'would create'} it from the 2024 order (${orderedIds.length} partners)`);
      if (!order2024) console.log('NOTE     there is no 2024 order either, using the database order');
    } else if (added.length === 0) {
      console.log('2026 order already has every selected partner, nothing to do');
    } else {
      console.log(`2026 order exists: ${apply ? 'appending' : 'would append'} ${added.length} at the end`);
    }
    if (added.length > 0) {
      for (const id of orderedIds) {
        console.log(`  ${added.includes(id) ? '+' : ' '} ${nameOf.get(id) ?? id}`);
      }
      if (apply) {
        if (!order2026) {
          await Orders.insertOne({
            year: '2026',
            orderedIds: orderedIds.map((id) => new mongoose.Types.ObjectId(id)),
            __v: 0,
          });
        } else {
          await Orders.updateOne(
            { _id: order2026._id },
            { $push: { orderedIds: { $each: added.map((id) => new mongoose.Types.ObjectId(id)) } } },
          );
        }
      }
    }

    console.log(
      `\n${apply ? 'Done' : 'Dry run, nothing written'}: ${changed} partner${changed === 1 ? '' : 's'} ${apply ? 'updated' : 'to update'}, ${added.length} order entr${added.length === 1 ? 'y' : 'ies'} ${apply ? 'written' : 'to write'}`,
    );
  }
} catch (err) {
  console.error(`Failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
