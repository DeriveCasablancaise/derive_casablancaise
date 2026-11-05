import { describe, expect, it } from 'vitest';
import { mergeEditionOrder, moveInOrder } from './partner-order';
import { editionOrderSchema } from './validator';

const partner = (_id: string, frenchName = _id) => ({ _id, frenchName });
const ids = (list: { _id: string }[]) => list.map((p) => p._id);

describe('mergeEditionOrder', () => {
  it('follows the stored order', () => {
    const partners = [partner('a'), partner('b'), partner('c')];
    expect(ids(mergeEditionOrder(['c', 'a', 'b'], partners))).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('appends missing partners by name', () => {
    const partners = [
      partner('1', 'Zèbre'),
      partner('2', 'atelier'),
      partner('3', 'Éclat'),
      partner('4', 'Stored'),
    ];
    expect(ids(mergeEditionOrder(['4'], partners))).toEqual([
      '4',
      '2',
      '3',
      '1',
    ]);
  });

  it('drops removed partners', () => {
    expect(ids(mergeEditionOrder(['gone', 'a'], [partner('a')]))).toEqual([
      'a',
    ]);
  });

  it('ignores duplicates', () => {
    const partners = [partner('a'), partner('b')];
    expect(ids(mergeEditionOrder(['b', 'a', 'b'], partners))).toEqual([
      'b',
      'a',
    ]);
  });

  it('sorts everything by name without a stored order', () => {
    expect(
      ids(mergeEditionOrder([], [partner('b'), partner('a')])),
    ).toEqual(['a', 'b']);
  });
});

describe('moveInOrder', () => {
  const list = ['a', 'b', 'c', 'd'];

  it('moves one step', () => {
    expect(moveInOrder(list, 2, 'up')).toEqual(['a', 'c', 'b', 'd']);
    expect(moveInOrder(list, 1, 'down')).toEqual(['a', 'c', 'b', 'd']);
  });

  it('moves to the ends', () => {
    expect(moveInOrder(list, 2, 'top')).toEqual(['c', 'a', 'b', 'd']);
    expect(moveInOrder(list, 1, 'bottom')).toEqual(['a', 'c', 'd', 'b']);
  });

  it('stays put at the edges', () => {
    expect(moveInOrder(list, 0, 'up')).toEqual(list);
    expect(moveInOrder(list, 3, 'down')).toEqual(list);
  });
});

describe('editionOrderSchema', () => {
  const id = (n: number) => n.toString(16).padStart(24, '0');
  const valid = { edition: '2026', partnerIds: [id(1), id(2)] };

  it('accepts a valid list, empty included', () => {
    expect(editionOrderSchema.safeParse(valid).success).toBe(true);
    expect(
      editionOrderSchema.safeParse({ ...valid, partnerIds: [] }).success,
    ).toBe(true);
  });

  it('rejects an edition outside the registry', () => {
    expect(
      editionOrderSchema.safeParse({ ...valid, edition: '1999' }).success,
    ).toBe(false);
  });

  it('rejects ids that are not ObjectIds', () => {
    expect(
      editionOrderSchema.safeParse({ ...valid, partnerIds: ['twelve chars'] })
        .success,
    ).toBe(false);
  });

  it('rejects duplicates', () => {
    expect(
      editionOrderSchema.safeParse({ ...valid, partnerIds: [id(1), id(1)] })
        .success,
    ).toBe(false);
  });

  it('rejects more than 200 ids', () => {
    const at = (n: number) => Array.from({ length: n }, (_, i) => id(i));
    expect(
      editionOrderSchema.safeParse({ ...valid, partnerIds: at(200) }).success,
    ).toBe(true);
    expect(
      editionOrderSchema.safeParse({ ...valid, partnerIds: at(201) }).success,
    ).toBe(false);
  });
});
