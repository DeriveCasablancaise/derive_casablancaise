import { describe, it, expect } from 'vitest';
import { shouldOpenReader, versionedHref } from './programmeLink';

const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false };

describe('shouldOpenReader', () => {
  it('returns true for a plain left click when book exists', () => {
    expect(shouldOpenReader(plain, true)).toBe(true);
  });

  it('returns false when the edition has no reader', () => {
    expect(shouldOpenReader(plain, false)).toBe(false);
  });

  it('returns false for Ctrl-click', () => {
    expect(shouldOpenReader({ ...plain, ctrlKey: true }, true)).toBe(false);
  });

  it('returns false for Meta (Cmd) click', () => {
    expect(shouldOpenReader({ ...plain, metaKey: true }, true)).toBe(false);
  });

  it('returns false for Shift-click', () => {
    expect(shouldOpenReader({ ...plain, shiftKey: true }, true)).toBe(false);
  });

  it('returns false for middle click', () => {
    expect(shouldOpenReader({ ...plain, button: 1 }, true)).toBe(false);
  });
});


describe('versionedHref', () => {
  it('adds the deploy version as a query', () => {
    expect(versionedHref('/programme-2026.pdf', 'abc123')).toBe('/programme-2026.pdf?v=abc123');
    expect(versionedHref('/a.pdf?x=1', 'v 2')).toBe('/a.pdf?x=1&v=v%202');
  });

  it('leaves the path alone without a version', () => {
    expect(versionedHref('/programme-2026.pdf', undefined)).toBe('/programme-2026.pdf');
    expect(versionedHref('/programme-2026.pdf', '')).toBe('/programme-2026.pdf');
  });
});
