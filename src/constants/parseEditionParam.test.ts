import { describe, expect, it } from 'vitest';
import { EDITION_YEARS, parseEditionParam } from './editions';

describe('parseEditionParam', () => {
  it('returns every registry year', () => {
    for (const year of EDITION_YEARS) {
      expect(parseEditionParam(year)).toBe(year);
    }
  });

  it('returns null for a missing or empty value', () => {
    expect(parseEditionParam(null)).toBeNull();
    expect(parseEditionParam('')).toBeNull();
  });

  it('returns null for anything outside the registry', () => {
    expect(parseEditionParam('2025')).toBeNull();
    expect(parseEditionParam('2026 ')).toBeNull();
    expect(parseEditionParam('abc')).toBeNull();
    expect(parseEditionParam('constructor')).toBeNull();
  });
});
