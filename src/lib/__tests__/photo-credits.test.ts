import { describe, expect, it } from 'vitest';
import {
  altWithCredit,
  cleanCredit,
  creditFor,
  formatCredit,
  keepCredits,
  moveCredit,
  remapCredits,
  setCredit,
} from '../photo-credits';
import { artistFormSchema, homepageFormSchema } from '../validator';

const credits = [
  { url: 'a.jpg', credit: 'Alice' },
  { url: 'b.jpg', credit: 'Bob' },
];

describe('cleanCredit', () => {
  it('strips tags and collapses spaces', () => {
    expect(cleanCredit('  <b>Jean</b>   <script>x</script> Dupont ')).toBe(
      'Jean x Dupont',
    );
    expect(cleanCredit('a < b')).toBe('a b');
    expect(cleanCredit(undefined)).toBe('');
  });
});

describe('creditFor / setCredit', () => {
  it('finds the credit of a URL', () => {
    expect(creditFor(credits, 'b.jpg')).toBe('Bob');
    expect(creditFor(credits, 'c.jpg')).toBe('');
    expect(creditFor(undefined, 'a.jpg')).toBe('');
  });

  it('replaces, adds and removes on empty', () => {
    expect(creditFor(setCredit(credits, 'a.jpg', 'Ann'), 'a.jpg')).toBe('Ann');
    expect(setCredit(credits, 'c.jpg', 'Cy')).toHaveLength(3);
    expect(setCredit(credits, 'a.jpg', '  ')).toEqual([credits[1]]);
  });
});

describe('moveCredit', () => {
  it('carries the credit to the new URL', () => {
    const moved = moveCredit(credits, 'a.jpg', 'a2.jpg');
    expect(creditFor(moved, 'a2.jpg')).toBe('Alice');
    expect(creditFor(moved, 'a.jpg')).toBe('');
  });

  it('leaves the list alone without a credit', () => {
    expect(moveCredit(credits, 'x.jpg', 'y.jpg')).toEqual(credits);
  });
});

describe('remapCredits', () => {
  it('swaps blob previews for uploaded URLs by position', () => {
    const list = [{ url: 'blob:1', credit: 'One' }, credits[0]];
    const out = remapCredits(list, ['a.jpg', 'blob:1'], ['a.jpg', 'up1.jpg']);
    expect(creditFor(out, 'up1.jpg')).toBe('One');
    expect(creditFor(out, 'a.jpg')).toBe('Alice');
  });
});

describe('keepCredits', () => {
  it('keeps only credits of current images, cleaned, one per URL', () => {
    const out = keepCredits(
      [
        ...credits,
        { url: 'gone.jpg', credit: 'Old' },
        { url: 'a.jpg', credit: ' <i>Alice</i>  B ' },
        { url: 'thumb.jpg', credit: 'T' },
        { url: 'b.jpg', credit: '' },
      ],
      ['a.jpg', 'b.jpg', 'thumb.jpg', undefined],
    );
    expect(out).toEqual([
      { url: 'a.jpg', credit: 'Alice B' },
      { url: 'thumb.jpg', credit: 'T' },
    ]);
  });
});

describe('formatCredit', () => {
  it('adds © only once', () => {
    expect(formatCredit('Jean')).toBe('© Jean');
    expect(formatCredit('© Jean')).toBe('© Jean');
    expect(formatCredit('Photo : Jean')).toBe('Photo : Jean');
    expect(formatCredit('photographie Jean')).toBe('photographie Jean');
    expect(formatCredit('  ')).toBe('');
  });
});

describe('altWithCredit', () => {
  it('appends the credit in each language', () => {
    expect(altWithCredit('Affiche', 'Jean', false)).toBe(
      'Affiche, photo : Jean',
    );
    expect(altWithCredit('ملصق', 'Jean', true)).toBe('ملصق، تصوير: Jean');
    expect(altWithCredit('Affiche', '', false)).toBe('Affiche');
  });
});

describe('schemas', () => {
  const artist = {
    frenchName: 'Alice',
    arabicName: 'أليس',
    frenchText: 'Texte',
    arabicText: 'نص نص',
    images: ['a.jpg'],
    editions: ['2026'],
    isInHomepage: false,
  };

  it('cleans credits and defaults to an empty list', () => {
    expect(artistFormSchema.parse(artist).imageCredits).toEqual([]);
    const parsed = artistFormSchema.parse({
      ...artist,
      imageCredits: [{ url: 'a.jpg', credit: ' <b>Jean</b> ' }],
    });
    expect(parsed.imageCredits).toEqual([{ url: 'a.jpg', credit: 'Jean' }]);
  });

  it('rejects credits over 120 characters', () => {
    const long = 'x'.repeat(121);
    expect(
      artistFormSchema.safeParse({
        ...artist,
        imageCredits: [{ url: 'a.jpg', credit: long }],
      }).success,
    ).toBe(false);
    const home = homepageFormSchema.shape.backgroundImageCredit;
    expect(home.safeParse(long).success).toBe(false);
    expect(home.parse(undefined)).toBe('');
  });
});
