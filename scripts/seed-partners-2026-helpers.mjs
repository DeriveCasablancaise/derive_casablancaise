// Pure helpers of seed-partners-2026.mjs and of the logo prep tool, kept apart so a test can import them.
import { extname } from 'node:path';
import { parseCsv } from './seed-artist-images-2026-helpers.mjs';

export const EDITION_YEARS = ['2022', '2024', '2026'];
const LEGACY_YEARS = ['2022', '2024'];

// "Logo MJCC.png" -> "Logo MJCC". Accents and capitals stay as written.
// Underscores become spaces only when the name has no space at all.
export function partnerNameFromFile(rawName) {
  const fileName = rawName.trim();
  const ext = extname(fileName);
  const base = ext.length > 1 && ext.length <= 6 && !/\s/.test(ext) ? fileName.slice(0, -ext.length) : fileName;
  let name = base.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!name.includes(' ')) name = name.replace(/_+/g, ' ').trim();
  return name;
}

// names that probably are not the partner name as such, they wait for a human
const COLOUR_WORDS = /\b(black|white|noir|noire|blanc|blanche|bleu|blue|dark|light|color|colour|couleur)\b/i;

export function nameFlags(name) {
  const flags = [];
  if (/^\d+\s*[-.)_]/.test(name)) flags.push('leading-number');
  if (/\blogo\b/i.test(name)) flags.push('logo-word');
  if (/\(\d+\)\s*$/.test(name) || /\b(copy|copie)\b/i.test(name)) flags.push('copy-suffix');
  if (COLOUR_WORDS.test(name)) flags.push('colour-word');
  if (/_/.test(name)) flags.push('underscore');
  if (/\bpdf\b/i.test(name)) flags.push('pdf-word');
  return flags;
}

// flags that stop a partner from being created until the name is settled
export const REVIEW_FLAGS = ['leading-number', 'logo-word', 'copy-suffix', 'colour-word', 'underscore', 'pdf-word'];
export const needsNameReview = (flags) => flags.some((f) => REVIEW_FLAGS.includes(f));

// lowercase, no accents, no punctuation, single spaces
export function matchKey(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// matchKey without a leading number, the word "logo" and a copy suffix. Only used for hints, never to decide.
export function looseKey(name) {
  return matchKey(
    String(name ?? '')
      .replace(/^\s*\d+\s*[-.)_]\s*/, '')
      .replace(/\(\d+\)\s*$/, '')
      .replace(/\blogo\b/gi, ' '),
  );
}

// clean lowercase ASCII file name stem
export function outputSlug(name) {
  const slug = String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'partner';
}

export function csvLine(values) {
  return values
    .map((v) => {
      const s = String(v ?? '');
      return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(',');
}

const SAFE_NAME = /^[a-z0-9][a-z0-9-]*\.webp$/;

// manifest text -> the "ok" rows. Throws on a missing column, an unsafe file name, or a name used twice.
export function parseManifest(text) {
  const [header, ...lines] = parseCsv(text);
  if (!header) throw new Error('manifest is empty');
  for (const col of ['partner_name', 'source', 'output_name', 'status', 'flags']) {
    if (!header.includes(col)) throw new Error(`manifest has no "${col}" column`);
  }
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const rows = [];
  const files = new Set();
  const keys = new Map();
  for (const line of lines) {
    if (line[idx.status] !== 'ok') continue;
    const partnerName = (line[idx.partner_name] ?? '').trim();
    const outputName = line[idx.output_name];
    const source = line[idx.source];
    if (!partnerName) throw new Error(`ok row without partner_name: ${source}`);
    if (!SAFE_NAME.test(outputName ?? '')) throw new Error(`unsafe output name: ${JSON.stringify(outputName)}`);
    if (files.has(outputName)) throw new Error(`output name used twice: ${outputName}`);
    files.add(outputName);
    const key = matchKey(partnerName);
    if (!key) throw new Error(`partner name has no letters or digits: ${source}`);
    if (keys.has(key)) throw new Error(`two ok rows for the same partner: ${keys.get(key)} and ${source}`);
    keys.set(key, source);
    rows.push({ partnerName, source, outputName, flags: (line[idx.flags] ?? '').split('|').filter(Boolean) });
  }
  return rows;
}

// same reading as getPartnerEditions in src/lib/partner-editions.ts
export function partnerEditions(doc) {
  const editions = (doc.editions ?? []).filter((e) => EDITION_YEARS.includes(e));
  if (editions.length > 0) return editions;
  const legacy = doc.yearOfPartnership;
  if (legacy === 'both') return [...LEGACY_YEARS];
  if (EDITION_YEARS.includes(legacy)) return [legacy];
  return [];
}

// what to do with each manifest row, given the partners in the database.
// action: skip (exists), review (name to settle first), create. hint: a database partner that looks alike.
export function planPartners(rows, docs) {
  const byKey = new Map();
  const byLoose = new Map();
  for (const d of docs) {
    const k = matchKey(d.frenchName);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(d);
    const l = looseKey(d.frenchName);
    if (!byLoose.has(l)) byLoose.set(l, d);
  }
  return rows.map((row) => {
    const found = byKey.get(matchKey(row.partnerName));
    if (found) return { row, action: 'skip', docs: found };
    if (needsNameReview(row.flags)) {
      const hint = byLoose.get(looseKey(row.partnerName));
      return { row, action: 'review', hint: hint?.frenchName };
    }
    return { row, action: 'create' };
  });
}

// matched partners that do not have 2026 in their effective editions. Report only.
export function lackingEdition(plan, year = '2026') {
  return plan
    .filter((p) => p.action === 'skip')
    .flatMap((p) => p.docs)
    .filter((d) => !partnerEditions(d).includes(year));
}

// what the Partner model would store, defaults included, since a raw insert skips them
export function buildPartnerRecord(row, logoUrl, now = new Date()) {
  return {
    frenchName: row.partnerName,
    hrefLink: '#',
    editions: ['2026'],
    logoImage: logoUrl,
    order: 0,
    createdAt: now,
    __v: 0,
  };
}

// WebP files start with RIFF....WEBP
export const isWebp = (buf) =>
  buf.length > 12 && buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP';
