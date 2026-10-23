import { describe, it, expect } from 'vitest';
import { shouldOpenReader } from './programmeLink';

const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false };

describe('shouldOpenReader', () => {
  it('returns true for a plain left click when book exists', () => {
    expect(shouldOpenReader(plain, true)).toBe(true);
  });

  it('returns false when no programmeBook', () => {
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

