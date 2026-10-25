import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  categoryHref,
  editionHref,
  getEdition,
  isEditionCategory,
  isEditionYear,
  postHref,
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

  it('reuses 2024 images for 2026 and leaves exposition to the placeholder', () => {
    const images = getEdition('2026').categoryImages!;
    const y2024 = getEdition('2024').categoryImages!;
    expect(images.danse).toBe(y2024.danse);
    expect(images.theatre).toBe(y2024.theatre);
    expect(images.lectures).toBe(y2024.lectures);
    expect(images.cinema).toBe(y2024.cinema);
    expect(images.concert).toBe(y2024.musique);
    expect(images.exposition).toBeUndefined();
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

  it('lists the programme categories for 2026, all known', () => {
    const list = getEdition('2026').categories;
    expect(list).toEqual([
      'danse',
      'lectures',
      'cinema',
      'exposition',
      'theatre',
      'concert',
    ]);
    for (const k of list) expect(CATEGORIES[k]).toBeDefined();
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
