// Checks the 2026 seed files against the DOCX extraction.
// Usage: node seed/2026/verify.mjs <path to extraction.txt>
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const extractionPath = process.argv[2] || process.env.SEED_EXTRACTION;
if (!extractionPath) {
  console.error('Missing extraction path: node seed/2026/verify.mjs <extraction.txt>');
  process.exit(2);
}

const load = (name) => JSON.parse(readFileSync(join(here, name), 'utf8'));
const landing = load('landing.json');
const artists = load('artists.json');
const posts = load('posts.json');

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const decode = (s) =>
  s.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const source = norm(readFileSync(extractionPath, 'utf8'));
const sourceLower = source.toLowerCase();

// hand-written short values that are not a literal substring, with the reason
// (key: 'post-key.field'), empty for now
const HAND_WRITTEN = {};

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

const BLOCK = /^<(p|h2|h3|ul|ol|blockquote)>([\s\S]*?)<\/\1>/;

function checkHtml(where, html) {
  if (typeof html !== 'string' || !html) return fail(where, 'empty');
  if (!BLOCK.test(html)) fail(where, 'does not start with a block tag');
  if (/\s(style|class)=/.test(html)) fail(where, 'style or class attribute');
  let rest = html;
  while (rest) {
    const m = BLOCK.exec(rest);
    if (!m) return fail(where, `text outside a block: "${rest.slice(0, 40)}"`);
    const inner = m[2];
    const text = decode(inner.replace(/<[^>]+>/g, ''));
    if (!text.trim()) fail(where, 'empty paragraph');
    // a raw < > or a bare & means unescaped text
    if (/[<>]/.test(inner.replace(/<\/?(strong|em|br|li|a)( [^>]*)?>/g, ''))) fail(where, 'unescaped < or >');
    if (/&(?!(amp|lt|gt|nbsp);)/.test(inner)) fail(where, 'unescaped &');
    // each paragraph separately: fields skip header lines between paragraphs
    if (!source.includes(norm(text))) fail(where, `not in extraction: "${norm(text).slice(0, 60)}"`);
    rest = rest.slice(m[0].length);
  }
}

function checkPlain(where, text) {
  if (typeof text !== 'string' || text.trim().length < 3) return fail(where, 'empty');
  if (/[<>]/.test(text)) fail(where, 'markup in plain text');
  for (const para of text.split(/\n\n/)) {
    if (!source.includes(norm(para))) fail(where, `not in extraction: "${norm(para).slice(0, 60)}"`);
  }
}

function checkShort(where, value, key) {
  if (!value) return;
  if (sourceLower.includes(norm(value).toLowerCase())) return;
  if (HAND_WRITTEN[key]) return;
  fail(where, `short value not in extraction: "${value}"`);
}

// landing
for (const n of [1, 2, 3]) {
  checkHtml(`landing.text${n}Fr`, landing[`text${n}Fr`]);
  checkHtml(`landing.text${n}Ar`, landing[`text${n}Ar`]);
}

// artists
const artistKeys = new Set();
for (const a of artists) {
  if (artistKeys.has(a.key)) fail(a.key, 'duplicate artist key');
  artistKeys.add(a.key);
  checkPlain(`${a.key}.frenchText`, a.frenchText);
  checkPlain(`${a.key}.arabicText`, a.arabicText);
  checkShort(`${a.key}.frenchName`, a.frenchName, `${a.key}.frenchName`);
  checkShort(`${a.key}.arabicName`, a.arabicName, `${a.key}.arabicName`);
  if (!a.editions?.includes('2026')) fail(a.key, 'missing edition 2026');
}

// categories come from the CATEGORIES constant, read as text
const editionsTs = readFileSync(join(here, '..', '..', 'src', 'constants', 'editions.ts'), 'utf8');
const catBlock = /export const CATEGORIES = \{([\s\S]*?)\} as const/.exec(editionsTs)[1];
const categories = new Set([...catBlock.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]));
const SUB = new Set(['rencontres', 'expositions', 'productions']);

const DATE = /^2026-12-0[2-5]T\d{2}:\d{2}$/;
const MONTHS = { '12': 'décembre' };
const postKeys = new Set();
for (const p of posts) {
  const w = p.key;
  if (postKeys.has(w)) fail(w, 'duplicate post key');
  postKeys.add(w);
  if (!p.frenchTitle?.trim()) fail(w, 'empty French title');
  if (p.yearOfEdition !== '2026') fail(w, 'yearOfEdition is not 2026');
  if (!categories.has(p.postCategory)) fail(w, `unknown category ${p.postCategory}`);
  if (p.subCategory && !SUB.has(p.subCategory)) fail(w, `unknown subCategory ${p.subCategory}`);
  checkHtml(`${w}.frenchText`, p.frenchText);
  checkHtml(`${w}.arabicText`, p.arabicText);
  for (const f of ['frenchTitle', 'arabicTitle', 'location', 'locationAr']) {
    checkShort(`${w}.${f}`, p[f], `${w}.${f}`);
  }
  for (const f of ['frenchTitle', 'arabicTitle', 'frenchText', 'arabicText', 'location', 'locationAr']) {
    if (/pas encore confirmé/i.test(p[f] ?? '')) fail(w, `${f} still says Pas encore confirmé`);
  }
  for (const k of p.artists) if (!artistKeys.has(k)) fail(w, `unknown artist ${k}`);

  if (!DATE.test(p.start) || !DATE.test(p.end)) fail(w, 'bad start/end format');
  else {
    if (p.end < p.start) fail(w, 'end before start');
    // the day and the start time must both be written somewhere in the document
    const [d, hm] = p.start.split('T');
    const [, mo, day] = d.split('-');
    const [h, m] = hm.split(':');
    const dayText = `${Number(day)} ${MONTHS[mo]} 2026`;
    const timeText = m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
    if (!sourceLower.includes(dayText)) fail(w, `day "${dayText}" not in extraction`);
    if (!sourceLower.includes(timeText)) fail(w, `time "${timeText}" not in extraction`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`ok: landing 3 blocks, ${artists.length} artists, ${posts.length} posts`);
