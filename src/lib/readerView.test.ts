import { describe, it, expect } from 'vitest';
import {
  clampZoom,
  stepZoom,
  snapIndex,
  lastIndex,
  stepIndex,
  needsFallback,
  toggleZoom,
  clampPan,
  parsePageInput,
} from './readerView';

describe('zoom', () => {
  it('clamps to 100%-300% on a 25% grid', () => {
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(5)).toBe(3);
    expect(clampZoom(1.3)).toBe(1.25);
    expect(clampZoom(NaN)).toBe(1);
  });

  it('steps by 25% and stops at the ends', () => {
    expect(stepZoom(1, 1)).toBe(1.25);
    expect(stepZoom(1, -1)).toBe(1);
    expect(stepZoom(3, 1)).toBe(3);
  });

  it('toggles between 100% and 200%', () => {
    expect(toggleZoom(1)).toBe(2);
    expect(toggleZoom(2)).toBe(1);
    expect(toggleZoom(1.5)).toBe(1);
  });
});

describe('clampPan', () => {
  const content = { w: 400, h: 300 };
  const view = { w: 800, h: 600 };

  it('does not pan when the scaled book fits the view', () => {
    expect(clampPan({ x: 50, y: -50 }, 1, content, view)).toEqual({ x: 0, y: 0 });
  });

  it('limits the pan to half the overflow', () => {
    // 400 * 3 = 1200 vs 800 -> 200 ; 300 * 3 = 900 vs 600 -> 150
    expect(clampPan({ x: 999, y: -999 }, 3, content, view)).toEqual({
      x: 200,
      y: -150,
    });
  });

  it('keeps a pan that is already inside the bounds', () => {
    expect(clampPan({ x: 10, y: 20 }, 3, content, view)).toEqual({ x: 10, y: 20 });
  });
});

describe('parsePageInput', () => {
  it('returns a 0-based index', () => {
    expect(parsePageInput('3', 10)).toBe(2);
  });

  it('clamps out-of-range numbers', () => {
    expect(parsePageInput('0', 10)).toBe(0);
    expect(parsePageInput('99', 10)).toBe(9);
  });

  it('returns null for anything that is not a number', () => {
    expect(parsePageInput('', 10)).toBeNull();
    expect(parsePageInput('abc', 10)).toBeNull();
  });
});

describe('page navigation', () => {
  // spread layout: 0 | 1-2 | 3-4 | 5-6 | 7-8 | 9
  it('goes back one spread and forth again', () => {
    expect(stepIndex(3, -1, 10, true)).toBe(1);
    expect(stepIndex(1, -1, 10, true)).toBe(0);
    expect(stepIndex(0, 1, 10, true)).toBe(1);
    expect(stepIndex(1, 1, 10, true)).toBe(3);
    expect(stepIndex(0, -1, 10, true)).toBe(0);
  });

  it('goes back from the last spread', () => {
    expect(lastIndex(10, true)).toBe(9);
    expect(stepIndex(9, -1, 10, true)).toBe(7);
    expect(lastIndex(11, true)).toBe(9);
    expect(stepIndex(9, -1, 11, true)).toBe(7);
    expect(stepIndex(9, 1, 11, true)).toBe(9);
  });

  it('snaps a typed page to the spread that shows it', () => {
    expect(snapIndex(2, 10, true)).toBe(1);
    expect(snapIndex(0, 10, true)).toBe(0);
    expect(snapIndex(99, 10, true)).toBe(9);
  });

  // single-page layout, like the 2-page 2026 programme
  it('steps by one in the single-page layout', () => {
    expect(stepIndex(1, -1, 2, false)).toBe(0);
    expect(stepIndex(0, 1, 2, false)).toBe(1);
    expect(stepIndex(1, 1, 2, false)).toBe(1);
    expect(stepIndex(0, -1, 2, false)).toBe(0);
    expect(stepIndex(9, -1, 10, false)).toBe(8);
    expect(lastIndex(2, false)).toBe(1);
    expect(snapIndex(5, 10, false)).toBe(5);
  });

  it('counter shows the index plus one', () => {
    expect(stepIndex(1, -1, 2, false) + 1).toBe(1);
  });
});

describe('needsFallback', () => {
  it('is false when the book shows the requested page', () => {
    expect(needsFallback(1, 1)).toBe(false);
    expect(needsFallback(0, 0)).toBe(false);
  });

  it('is true when a backward flip was rejected', () => {
    // asked for page 1 from page 2, the book stayed on page 2
    expect(needsFallback(1, 0)).toBe(true);
    // spread layout: asked for 1-2 from 3-4
    expect(needsFallback(3, 1)).toBe(true);
  });

  it('is true when the book cannot report a page', () => {
    expect(needsFallback(undefined, 0)).toBe(true);
    expect(needsFallback(null, 2)).toBe(true);
  });
});
