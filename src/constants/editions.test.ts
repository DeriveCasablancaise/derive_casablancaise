import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  categoryHref,
  editionHref,
  getEdition,
  isEditionCategory,
  isEditionYear,
  postHref,
  resolveCategory,
  storedCategoryKeys,
} from './editions';

describe('editions registry', () => {
  it('keeps the current 2022 URLs', () => {
    expect(editionHref('2022')).toBe('/previous');
    expect(categoryHref('2022', 'danse')).toBe('/previous/danse');
    expect(postHref('2022', 'abc')).toBe('/previous/post/abc');
  });

  it('keeps the current 2024 URLs', () => {
    expect(editionHref('2024')).toBe('/derive-2024');
    expect(categoryHref('2024', 'danse')).toBe('/derive-2024/danse');
    expect(postHref('2024', 'abc')).toBe('/derive-2024/post/abc');
  });

  it('returns /derive-2026 paths for 2026 and a programme PDF', () => {
    expect(categoryHref('2026', 'danse')).toBe('/derive-2026/danse');
    expect(postHref('2026', 'abc')).toBe('/derive-2026/post/abc');
    const e = getEdition('2026');
    expect(e.programmePdf).toBe('/programme-2026.pdf');
    expect(e.translationNamespace).toBe('Derive2026');
  });

  it('gives 2026 images only to categories that have their own', () => {
    const images = getEdition('2026').categoryImages!;
    expect(images.exposition).toBeUndefined();
    expect(images.performances).toBeUndefined();
    for (const k of Object.keys(images)) {
      expect(getEdition('2026').categories).toContain(k);
    }
  });

  it('has an image for every category in 2022 and 2024', () => {
    for (const y of ['2022', '2024'] as const) {
      expect(Object.keys(getEdition(y).categoryImages!)).toEqual(
        getEdition(y).categories,
      );
    }
  });

  it('keeps the 2022 and 2024 category lists', () => {
    const original = [
      'danse',
      'theatre',
      'musique',
      'lectures',
      'cinema',
      'conference',
      'ateliers',
      'autres',
    ];
    expect(getEdition('2022').categories).toEqual(original);
    expect(getEdition('2024').categories).toEqual(original);
  });

  it('lists 2026 in the 2024 order with the new names', () => {
    const list = getEdition('2026').categories;
    expect(list).toEqual([
      'danse',
      'theatre',
      'musique',
      'performances',
      'cinema',
      'ateliers',
      'exposition',
    ]);
    expect(list.map((k) => CATEGORIES[k].fr)).toEqual([
      'Danse',
      'Théâtre',
      'Musique',
      'Performances',
      'Cinéma',
      'Ateliers',
      'Expositions',
    ]);
    expect(CATEGORIES.exposition.ar).toBe('معارض');
    expect(CATEGORIES.performances.ar).toBe('عروض أدائية');
  });

  it('reads old 2026 keys under their new category, in 2026 only', () => {
    expect(resolveCategory('2026', 'concert')).toBe('musique');
    expect(resolveCategory('2026', 'lectures')).toBe('performances');
    expect(resolveCategory('2026', 'danse')).toBe('danse');
    expect(resolveCategory('2024', 'lectures')).toBe('lectures');
    expect(resolveCategory('2022', 'musique')).toBe('musique');
    expect(storedCategoryKeys('2026', 'musique')).toEqual(['musique', 'concert']);
    expect(storedCategoryKeys('2026', 'performances')).toEqual([
      'performances',
      'lectures',
    ]);
    expect(storedCategoryKeys('2024', 'lectures')).toEqual(['lectures']);
  });

  it('keeps the 2024 labels', () => {
    expect(CATEGORIES.musique.fr).toBe('Musique');
    expect(CATEGORIES.lectures.fr).toBe('Lectures');
  });

  it('isEditionCategory checks the list of the edition', () => {
    expect(isEditionCategory('2024', 'autres')).toBe(true);
    expect(isEditionCategory('2024', 'exposition')).toBe(false);
    expect(isEditionCategory('2026', 'exposition')).toBe(true);
    expect(isEditionCategory('2026', 'autres')).toBe(false);
    expect(isEditionCategory('2026', 'toString')).toBe(false);
  });

  it('isEditionYear only accepts known years', () => {
    expect(isEditionYear('2022')).toBe(true);
    expect(isEditionYear('2026')).toBe(true);
    expect(isEditionYear('2023')).toBe(false);
    expect(isEditionYear('toString')).toBe(false);
    expect(isEditionYear(2024)).toBe(false);
  });
});
