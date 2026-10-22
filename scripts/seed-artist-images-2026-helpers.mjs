// Pure helpers of seed-artist-images-2026.mjs, kept apart so a test can import them.
import { isEmptyValue, normaliseName } from './seed-2026-helpers.mjs';

// minimal CSV reader: quoted fields, "" for a quote, CRLF or LF
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    if (row.some((v) => v !== '')) rows.push(row);
  }
  return rows;
}

const REQUIRED = ['source', 'output_name', 'artist_key', 'status'];
const SAFE_NAME = /^[a-z0-9][a-z0-9-]*\.jpg$/;

// manifest text -> Map(artist key -> output names in manifest order). Only "ok" rows count.
// Throws on a missing column, an unsafe file name, or a name used twice.
export function parseManifest(text) {
  const [header, ...lines] = parseCsv(text);
  if (!header) throw new Error('manifest is empty');
  for (const col of REQUIRED) {
    if (!header.includes(col)) throw new Error(`manifest has no "${col}" column`);
  }
  const idx = Object.fromEntries(header.map((h, i) => [h, i]));
  const byArtist = new Map();
  const seen = new Set();
  for (const line of lines) {
    if (line[idx.status] !== 'ok') continue;
    const name = line[idx.output_name];
    const key = line[idx.artist_key];
    if (!key) throw new Error(`ok row without artist_key: ${line[idx.source]}`);
    if (!SAFE_NAME.test(name ?? '')) throw new Error(`unsafe output name: ${JSON.stringify(name)}`);
    if (!name.startsWith(`${key}-`)) throw new Error(`${name} is not prefixed by ${key}`);
    if (seen.has(name)) throw new Error(`output name used twice: ${name}`);
    seen.add(name);
    if (!byArtist.has(key)) byArtist.set(key, []);
    byArtist.get(key).push(name);
  }
  return byArtist;
}

// the database artist for a seed artist, found by normalised French name
export function findArtistDoc(seedArtist, docs) {
  const key = normaliseName(seedArtist.frenchName);
  const found = docs.filter((d) => normaliseName(d.frenchName) === key);
  if (found.length === 0) return { error: 'not in the database (seed the artists first)' };
  if (found.length > 1) return { error: `${found.length} artists share this name in the database` };
  return { doc: found[0] };
}

// images are set only on an artist that has none, and nothing is ever removed
export function planImages(doc, urls) {
  if (!isEmptyValue(doc.images)) return { action: 'skip', reason: `already has ${doc.images.length} image(s)` };
  if (urls.length === 0) return { action: 'skip', reason: 'no image in the manifest' };
  return { action: 'set', images: urls };
}

// same public host as next.config.mjs (images.remotePatterns)
export const publicUrl = (key) => `https://utfs.io/f/${key}`;
