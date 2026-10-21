import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  categoryHref,
  editionHref,
  getEdition,
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

  it('returns /derive-2026 paths for 2026 with no assets', () => {
    expect(categoryHref('2026', 'danse')).toBe('/derive-2026/danse');
    expect(postHref('2026', 'abc')).toBe('/derive-2026/post/abc');
    const e = getEdition('2026');
    expect(e.programmePdf).toBeUndefined();
    expect(e.categoryImages).toBeUndefined();
    expect(e.translationNamespace).toBeUndefined();
  });

  it('has an image for every category in 2022 and 2024', () => {
    for (const y of ['2022', '2024'] as const) {
      expect(Object.keys(getEdition(y).categoryImages!)).toEqual(
        Object.keys(CATEGORIES),
      );
    }
  });

  it('isEditionYear only accepts known years', () => {
    expect(isEditionYear('2022')).toBe(true);
    expect(isEditionYear('2026')).toBe(true);
    expect(isEditionYear('2023')).toBe(false);
    expect(isEditionYear('toString')).toBe(false);
    expect(isEditionYear(2024)).toBe(false);
  });
});
