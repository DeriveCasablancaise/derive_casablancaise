import { describe, expect, it } from 'vitest';
import {
  buildArtistEditionsFilter,
  getArtistEditions,
} from './artist-editions';

describe('getArtistEditions', () => {
  it('maps each legacy year', () => {
    expect(getArtistEditions({ artistCategory: '2022' })).toEqual(['2022']);
    expect(getArtistEditions({ artistCategory: '2024' })).toEqual(['2024']);
    expect(getArtistEditions({ artistCategory: '2026' })).toEqual(['2026']);
  });

  it('expands all to every edition', () => {
    expect(getArtistEditions({ artistCategory: 'all' })).toEqual([
      '2022',
      '2024',
      '2026',
    ]);
  });

  it('prefers editions once migrated', () => {
    expect(
      getArtistEditions({ editions: ['2022', '2026'], artistCategory: '2024' }),
    ).toEqual(['2022', '2026']);
  });

  it('falls back when editions is empty', () => {
    expect(getArtistEditions({ editions: [], artistCategory: '2024' })).toEqual(
      ['2024'],
    );
  });

  it('returns nothing when both are missing or unknown', () => {
    expect(getArtistEditions({})).toEqual([]);
    expect(getArtistEditions({ editions: null, artistCategory: null })).toEqual(
      [],
    );
    expect(getArtistEditions({ artistCategory: '1999' })).toEqual([]);
  });
});

describe('buildArtistEditionsFilter', () => {
  it('matches everything without years', () => {
    expect(buildArtistEditionsFilter()).toEqual({});
    expect(buildArtistEditionsFilter([])).toEqual({});
  });

  it('matches migrated and legacy documents in one filter', () => {
    expect(buildArtistEditionsFilter(['2022', '2024'])).toEqual({
      $or: [
        { editions: { $in: ['2022', '2024'] } },
        {
          'editions.0': { $exists: false },
          artistCategory: { $in: ['2022', '2024', 'all'] },
        },
      ],
    });
  });

  it('drops unknown years', () => {
    expect(buildArtistEditionsFilter(['2024', 'nope'])).toEqual(
      buildArtistEditionsFilter(['2024']),
    );
  });

  it('matches nothing when no year is known', () => {
    expect(buildArtistEditionsFilter(['nope'])).toEqual({ _id: { $in: [] } });
  });
});
