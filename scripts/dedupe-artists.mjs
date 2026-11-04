// Merges artists that share a name (accents, case, punctuation and spaces ignored).
// Dry run by default. The keeper gets the union of editions and only the fields it has empty;
// posts pointing at a duplicate are repointed to the keeper; duplicates are backed up, then deleted.
//
//   node --env-file=.env.local scripts/dedupe-artists.mjs
//   node --env-file=.env.local scripts/dedupe-artists.mjs --apply --confirm-db darja
//   add --only "Danya Hammoud,Nacera Belaaza" to limit to some groups
//   add --prefer-text-from <id> (repeatable) to make that record's texts win in its group
//
// Groups whose Arabic names differ, and near-duplicates, are listed to check by hand and never touched.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { legacyToEditions, normaliseName } from './seed-2026-helpers.mjs';
import {
  arabicNamesDiffer,
  chooseKeeper,
  createdTime,
  filledFields,
  groupByName,
  nearDuplicates,
  planMerge,
  repointIds,
  resolvePreferTextFrom,
} from './dedupe-artists-helpers.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const confirmDb = argValue('--confirm-db');
const onlyArg = argValue('--only');
const preferIds = args.flatMap((a, i) => (a === '--prefer-text-from' ? [args[i + 1]] : []));
if (preferIds.some((id) => !id || id.startsWith('--'))) {
  console.error('--prefer-text-from needs an artist id');
  process.exit(1);
}
const only = onlyArg ? new Set(onlyArg.split(',').map(normaliseName).filter(Boolean)) : null;

const url = process.env.SEED_MONGODB_URL || process.env.MONGODB_URL;
if (!url) {
  console.error('SEED_MONGODB_URL (or MONGODB_URL) is not set');
  process.exit(1);
}
const dbName = process.env.SEED_DB_NAME || 'darja';

if (apply && !confirmDb) {
  console.error(`--apply needs --confirm-db <databaseName> (target is "${dbName}")`);
  process.exit(1);
}

const { EJSON } = mongoose.mongo.BSON;
const date = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '?');
const describe = (doc) =>
  `${doc._id} | ${doc.frenchName} | ${doc.arabicName || '-'} | editions ${legacyToEditions(doc).join(',') || 'none'}` +
  ` | image ${doc.images?.length ? 'yes' : 'no'} | filled ${filledFields(doc).join(',')} | created ${date(doc.createdAt)}`;
const preview = (text) => {
  const s = String(text ?? '');
  const flat = s.replace(/s+/g, ' ').trim();
  return `${s.length} chars "${flat.slice(0, 80)}${flat.length > 80 ? '...' : ''}"`;
};

let errors = 0;

await mongoose.connect(url, { dbName });

try {
  const connectedDb = mongoose.connection.name;
  let host = '';
  try {
    host = new URL(url).host.split('@').pop();
  } catch {}
  console.log(`${apply ? 'APPLY' : 'DRY RUN'} on database "${connectedDb}"${host ? ` (host ${host})` : ''}`);

  if (apply && confirmDb !== connectedDb) {
    throw new Error(`--confirm-db "${confirmDb}" does not match the connected database "${connectedDb}"`);
  }

  const pluralize = mongoose.pluralize();
  const Artists = mongoose.connection.collection(pluralize('Artist'));
  const Posts = mongoose.connection.collection(pluralize('Post'));

  const docs = await Artists.find().toArray();
  console.log(`${docs.length} artists`);

  const groups = [];
  const byHand = [];
  for (const group of groupByName(docs)) {
    if (only && !only.has(group.key)) continue;
    if (arabicNamesDiffer(group.docs)) {
      byHand.push({ docs: group.docs, reason: 'same French name, different Arabic names' });
      continue;
    }
    groups.push(group);
  }
  // throws before anything is planned or written
  const preferred = resolvePreferTextFrom(preferIds, groups);

  const plans = [];
  for (const group of groups) {
    const { keeper, rule } = chooseKeeper(group.docs);
    const duplicates = group.docs.filter((d) => d !== keeper);
    const dupIds = duplicates.map((d) => d._id);
    const allIds = group.docs.map((d) => d._id);
    // post.artists is [String], ObjectIds included in case one was stored by hand
    const posts = await Posts.find(
      { artists: { $in: [...allIds.map(String), ...allIds] } },
      { projection: { frenchTitle: 1, artists: 1 } },
    ).toArray();
    const postCounts = new Map(
      allIds.map((id) => [String(id), posts.filter((p) => (p.artists ?? []).some((a) => String(a) === String(id))).length]),
    );
    const postChanges = posts
      .map((p) => ({ post: p, next: repointIds(p.artists, dupIds, keeper._id) }))
      .filter((c) => c.next);
    const merge = planMerge(keeper, duplicates, { preferTextFrom: preferred.get(group.key) });
    plans.push({ key: group.key, keeper, rule, duplicates, merge, postCounts, postChanges });
  }

  if (only) {
    const found = new Set([...plans.map((p) => p.key), ...byHand.map((g) => normaliseName(g.docs[0].frenchName))]);
    const missing = [...only].filter((k) => !found.has(k));
    if (missing.length > 0) console.log(`--only: no duplicate group for ${missing.join(', ')}`);
  }

  console.log(`\n-- ${plans.length} group(s) to merge`);
  for (const p of plans) {
    console.log(`\n"${p.key}"`);
    for (const d of [p.keeper, ...p.duplicates].sort((a, b) => createdTime(a) - createdTime(b))) {
      console.log(`  ${d === p.keeper ? 'KEEP  ' : 'DELETE'} ${describe(d)}`);
      console.log(`         frenchText ${preview(d.frenchText)}`);
      console.log(`         arabicText ${preview(d.arabicText)}`);
      console.log(`         referenced by ${p.postCounts.get(String(d._id))} post(s)`);
    }
    console.log(`  keeper rule: ${p.rule}`);
    const fields = Object.keys(p.merge.set);
    if (fields.length === 0) console.log('  keeper unchanged');
    for (const f of fields) {
      const from = p.merge.sources[f] ? ` from ${p.merge.sources[f]}` : '';
      const v = p.merge.set[f];
      const value = f === 'editions' ? v.join(',') : f === 'images' ? `${v.length} image(s)` : typeof v === 'string' ? preview(v) : String(v);
      console.log(`  set ${f} ${value}${from}`);
    }
    console.log(`  ${p.postChanges.length} post(s) to repoint`);
    for (const c of p.postChanges) console.log(`  repoint post ${c.post._id} "${c.post.frenchTitle}"`);
  }

  const pairs = nearDuplicates(docs);
  console.log(`\n-- check by hand (${byHand.length + pairs.length}), not touched`);
  for (const g of byHand) {
    console.log(`  ${g.reason}:`);
    for (const d of g.docs) console.log(`    ${describe(d)}`);
  }
  for (const pair of pairs) {
    console.log(`  ${pair.reason}: "${pair.a.frenchName}" (${pair.a._id}) / "${pair.b.frenchName}" (${pair.b._id})`);
  }

  if (!apply) {
    console.log(`\nDry run, nothing written: ${plans.length} group(s) would be merged`);
  } else if (plans.length === 0) {
    console.log('\nNothing to merge');
  } else {
    // one backup of every document about to be deleted, written before any change
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dir = fileURLToPath(new URL('../seed/2026/backups/', import.meta.url));
    mkdirSync(dir, { recursive: true });
    const backupPath = `${dir}artists-dedupe-${stamp}.json`;
    const backup = plans.map((p) => ({
      keeperId: p.keeper._id,
      keeperBefore: p.keeper,
      deleted: p.duplicates,
      posts: p.postChanges.map((c) => ({ _id: c.post._id, artistsBefore: c.post.artists })),
    }));
    writeFileSync(backupPath, EJSON.stringify(backup, null, 2, { relaxed: false }));
    console.log(`\nbackup written: seed/2026/backups/artists-dedupe-${stamp}.json`);

    for (const p of plans) {
      try {
        if (Object.keys(p.merge.set).length > 0) {
          const res = await Artists.updateOne({ _id: p.keeper._id }, { $set: p.merge.set });
          if (res.matchedCount !== 1) throw new Error('keeper not found');
        }
        // the filter repeats the old list, so a post edited meanwhile is left alone
        let stale = 0;
        for (const c of p.postChanges) {
          const res = await Posts.updateOne({ _id: c.post._id, artists: c.post.artists }, { $set: { artists: c.next } });
          if (res.matchedCount !== 1) stale++;
        }
        if (stale > 0) throw new Error(`${stale} post(s) changed meanwhile, duplicates kept, rerun`);
        const del = await Artists.deleteMany({ _id: { $in: p.duplicates.map((d) => d._id) } });
        console.log(`MERGED   "${p.key}": ${del.deletedCount} deleted, ${p.postChanges.length} post(s) repointed`);
      } catch (err) {
        errors++;
        console.log(`ERROR    "${p.key}": ${err.message}`);
      }
    }
    console.log(`\nDone: ${plans.length - errors} merged, ${errors} error(s)`);
  }
} catch (err) {
  console.error(`Failed: ${err.message}`);
  errors++;
} finally {
  await mongoose.disconnect();
}
if (errors > 0) process.exitCode = 1;
