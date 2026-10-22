import { describe, expect, it } from 'vitest';
import { getPartnerEditions } from '@/lib/partner-editions';
import {
  editionsUpdate,
  mergeOrder,
  parseNames,
  partnerEditions,
  selectPartners,
} from './add-2026-to-partners-helpers.mjs';

describe('partnerEditions', () => {
  it('matches getPartnerEditions on every shape', () => {
    const shapes = [
      { editions: ['2024', '2026'] },
      { yearOfPartnership: '2022' },
      { yearOfPartnership: '2024' },
      { yearOfPartnership: 'both' },
      { editions: [], yearOfPartnership: 'both' },
      { editions: ['2099'], yearOfPartnership: '2024' },
      { yearOfPartnership: 'weird' },
      {},
    ];
    for (const s of shapes) expect(partnerEditions(s)).toEqual(getPartnerEditions(s));
  });
});

describe('selectPartners', () => {
  const partners = [
    { frenchName: 'Alpha', editions: ['2024'] },
    { frenchName: 'Bêta', yearOfPartnership: 'both' },
    { frenchName: 'Gamma', yearOfPartnership: '2022' },
    { frenchName: 'Delta', editions: ['2022', '2024', '2026'] },
  ];

  it('keeps the partners of 2024, legacy included', () => {
    expect(selectPartners(partners).map((p: { frenchName: string }) => p.frenchName)).toEqual(['Alpha', 'Bêta', 'Delta']);
  });

  it('applies --only and --exclude with normalised names', () => {
    const only = parseNames(' beta , alpha ');
    expect(selectPartners(partners, { only }).map((p: { frenchName: string }) => p.frenchName)).toEqual(['Alpha', 'Bêta']);
    const exclude = parseNames('BETA');
    expect(selectPartners(partners, { exclude }).map((p: { frenchName: string }) => p.frenchName)).toEqual(['Alpha', 'Delta']);
  });

  it('never selects a partner outside 2024 even with --only', () => {
    expect(selectPartners(partners, { only: parseNames('gamma') })).toEqual([]);
  });
});

describe('editionsUpdate', () => {
  it('adds with $addToSet when editions exist', () => {
    expect(editionsUpdate({ editions: ['2024'] })).toEqual({ kind: 'addToSet' });
  });

  it('sets the legacy value plus 2026 when editions are missing', () => {
    expect(editionsUpdate({ yearOfPartnership: 'both' })).toEqual({
      kind: 'set',
      editions: ['2022', '2024', '2026'],
    });
    expect(editionsUpdate({ editions: [], yearOfPartnership: '2024' })).toEqual({
      kind: 'set',
      editions: ['2024', '2026'],
    });
  });

  it('does nothing when 2026 is already there', () => {
    expect(editionsUpdate({ editions: ['2024', '2026'] })).toBeNull();
  });
});

describe('mergeOrder', () => {
  it('builds 2026 from the 2024 order restricted to the selection', () => {
    const r = mergeOrder(null, ['c', 'x', 'a', 'b'], ['a', 'b', 'c']);
    expect(r.orderedIds).toEqual(['c', 'a', 'b']);
  });

  it('puts selected partners missing from the 2024 order at the end', () => {
    expect(mergeOrder(null, ['b'], ['a', 'b', 'c']).orderedIds).toEqual(['b', 'a', 'c']);
    expect(mergeOrder(null, null, ['a', 'b']).orderedIds).toEqual(['a', 'b']);
  });

  it('appends only the missing ids to an existing 2026 order', () => {
    const r = mergeOrder(['b', 'z'], ['a', 'b'], ['a', 'b']);
    expect(r.orderedIds).toEqual(['b', 'z', 'a']);
    expect(r.added).toEqual(['a']);
  });

  it('is stable on a second run', () => {
    const first = mergeOrder(null, ['b', 'a'], ['a', 'b']);
    const second = mergeOrder(first.orderedIds, ['b', 'a'], ['a', 'b']);
    expect(second.orderedIds).toEqual(first.orderedIds);
    expect(second.added).toEqual([]);
  });
});
