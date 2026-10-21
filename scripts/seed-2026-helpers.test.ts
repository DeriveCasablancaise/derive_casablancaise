import { describe, expect, it } from 'vitest';
import { getArtistEditions } from '@/lib/artist-editions';
import {
  dayRange,
  editionsWith,
  legacyToEditions,
  normaliseName,
  postKey,
  wallClockToDate,
} from './seed-2026-helpers.mjs';

describe('normaliseName', () => {
  it('drops accents, case and extra spaces', () => {
    expect(normaliseName('  Chrystèle  Khodr ')).toBe('chrystele khodr');
    expect(normaliseName('Jordi Galí')).toBe('jordi gali');
  });

  it('leaves Arabic letters alone', () => {
    expect(normaliseName('عريب طوقان')).toBe('عريب طوقان');
  });
});

describe('wallClockToDate', () => {
  it('writes the wall-clock time as UTC', () => {
    expect(wallClockToDate('2026-12-02T16:30').toISOString()).toBe('2026-12-02T16:30:00.000Z');
  });

  it('rejects bad or impossible dates', () => {
    expect(() => wallClockToDate('2026-12-02 16:30')).toThrow();
    expect(() => wallClockToDate('2026-02-31T10:00')).toThrow();
    expect(() => wallClockToDate('2026-12-02T24:00')).toThrow();
  });
});

describe('dayRange', () => {
  it('covers the whole day in floating UTC', () => {
    const [from, to] = dayRange('2026-12-02T21:00');
    expect(from.toISOString()).toBe('2026-12-02T00:00:00.000Z');
    expect(to.toISOString()).toBe('2026-12-03T00:00:00.000Z');
  });
});

describe('legacyToEditions', () => {
  it('matches getArtistEditions from the app', () => {
    for (const artist of [
      { artistCategory: '2022' },
      { artistCategory: '2026' },
      { artistCategory: 'all' },
      { artistCategory: 'nope' },
      { editions: ['2024'], artistCategory: '2022' },
      {},
    ]) {
      expect(legacyToEditions(artist)).toEqual(getArtistEditions(artist));
    }
  });
});

describe('editionsWith', () => {
  it('adds 2026 to existing editions', () => {
    expect(editionsWith({ editions: ['2022'] }, '2026')).toEqual(['2022', '2026']);
  });

  it('computes editions from the legacy value first', () => {
    expect(editionsWith({ artistCategory: '2024' }, '2026')).toEqual(['2024', '2026']);
    expect(editionsWith({ artistCategory: 'all' }, '2026')).toEqual(['2022', '2024', '2026']);
    expect(editionsWith({}, '2026')).toEqual(['2026']);
  });

  it('writes editions for a legacy 2026 artist that has none', () => {
    expect(editionsWith({ artistCategory: '2026' }, '2026')).toEqual(['2026']);
  });

  it('returns null when 2026 is already there', () => {
    expect(editionsWith({ editions: ['2024', '2026'] }, '2026')).toBeNull();
  });
});

describe('postKey', () => {
  it('is year, title and day', () => {
    expect(postKey({ yearOfEdition: '2026', frenchTitle: 'Ciel', start: '2026-12-02T16:30' })).toBe(
      '2026|Ciel|2026-12-02',
    );
  });
});
