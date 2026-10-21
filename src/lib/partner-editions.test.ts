import { describe, expect, it } from 'vitest';
import {
  buildPartnerEditionsFilter,
  getPartnerEditions,
} from './partner-editions';

describe('getPartnerEditions', () => {
  it('maps each legacy year', () => {
    expect(getPartnerEditions({ yearOfPartnership: '2022' })).toEqual(['2022']);
    expect(getPartnerEditions({ yearOfPartnership: '2024' })).toEqual(['2024']);
  });

  it('expands both to 2022 and 2024, not 2026', () => {
    expect(getPartnerEditions({ yearOfPartnership: 'both' })).toEqual([
      '2022',
      '2024',
    ]);
  });

  it('prefers editions once migrated', () => {
    expect(
      getPartnerEditions({
        editions: ['2024', '2026'],
        yearOfPartnership: '2022',
      }),
    ).toEqual(['2024', '2026']);
  });

  it('falls back when editions is empty', () => {
    expect(
      getPartnerEditions({ editions: [], yearOfPartnership: '2024' }),
    ).toEqual(['2024']);
  });

  it('returns nothing when both are missing or unknown', () => {
    expect(getPartnerEditions({})).toEqual([]);
    expect(
      getPartnerEditions({ editions: null, yearOfPartnership: null }),
    ).toEqual([]);
    expect(getPartnerEditions({ yearOfPartnership: '1999' })).toEqual([]);
  });
});

describe('buildPartnerEditionsFilter', () => {
  it('matches everything without years', () => {
    expect(buildPartnerEditionsFilter()).toEqual({});
  });

  it('matches migrated and legacy documents, both included', () => {
    expect(buildPartnerEditionsFilter(['2024'])).toEqual({
      $or: [
        { editions: { $in: ['2024'] } },
        {
          'editions.0': { $exists: false },
          yearOfPartnership: { $in: ['2024', 'both'] },
        },
      ],
    });
  });

  it('never matches legacy documents for 2026', () => {
    expect(buildPartnerEditionsFilter(['2026'])).toEqual({
      editions: { $in: ['2026'] },
    });
  });

  it('drops unknown years', () => {
    expect(buildPartnerEditionsFilter(['2022', 'nope'])).toEqual(
      buildPartnerEditionsFilter(['2022']),
    );
  });

  it('matches nothing when no year is known', () => {
    expect(buildPartnerEditionsFilter(['nope'])).toEqual({
      _id: { $in: [] },
    });
  });
});
