// Pure helpers of seed-2026.mjs, kept apart so a test can import them.

export const ALL_EDITIONS = ['2022', '2024', '2026'];

// lowercase, no accents, single spaces: matches "Chrystèle Khodr" to "chrystele khodr"
export function normaliseName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// "2026-12-02T16:30" is a wall-clock time, stored as if it were UTC (like toFloatingUTC)
export function wallClockToDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value ?? '');
  if (!m) throw new Error(`bad wall-clock date: ${JSON.stringify(value)}`);
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const date = new Date(Date.UTC(y, mo - 1, d, h, mi, 0));
  // Date.UTC rolls 31 February over, so compare the fields back
  if (date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d || h > 23 || mi > 59) {
    throw new Error(`impossible date: ${value}`);
  }
  return date;
}

// same mapping as getArtistEditions in src/lib/artist-editions.ts
export function legacyToEditions(artist) {
  const editions = (artist.editions ?? []).filter((e) => ALL_EDITIONS.includes(e));
  if (editions.length > 0) return editions;
  const legacy = artist.artistCategory;
  if (legacy === 'all') return [...ALL_EDITIONS];
  if (ALL_EDITIONS.includes(legacy)) return [legacy];
  return [];
}

// editions to write so the artist gains `year`, or null when the document already has it
export function editionsWith(artist, year) {
  if ((artist.editions ?? []).includes(year)) return null;
  return [...new Set([...legacyToEditions(artist), year])].sort();
}

export const isEmptyValue = (v) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

// [start of the day, start of the next day) in the same floating-UTC convention
export function dayRange(start) {
  const from = wallClockToDate(start.slice(0, 10) + 'T00:00');
  return [from, new Date(from.getTime() + 24 * 60 * 60 * 1000)];
}

export const postKey = (post) => `${post.yearOfEdition}|${post.frenchTitle}|${post.start.slice(0, 10)}`;
