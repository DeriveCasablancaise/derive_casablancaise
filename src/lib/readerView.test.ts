import { describe, it, expect } from 'vitest';
import {
  clampZoom,
  stepZoom,
  snapIndex,
  lastIndex,
  stepIndex,
  needsFallback,
  toggleZoom,
  keepCentreScroll,
  visiblePages,
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

describe('keepCentreScroll', () => {
  it('keeps the centre point when zooming in from a fitting page', () => {
    // 400 centred in 800: the view centre is the page centre, 1200 / 2 - 400
    expect(keepCentreScroll({ scroll: 0, view: 800, from: 400, to: 1200 })).toBe(200);
  });

  it('keeps an off-centre point while both sizes overflow', () => {
    // centre at 1000 of 2000 becomes 1500 of 3000
    expect(keepCentreScroll({ scroll: 600, view: 800, from: 2000, to: 3000 })).toBe(1100);
    // the point at a quarter of the page stays at a quarter
    expect(keepCentreScroll({ scroll: 100, view: 800, from: 2000, to: 4000 })).toBe(600);
  });

  it('counts the paddings around the pages', () => {
    // pad 50: centre 500 is 450 into the 1000 page, so 900 into the 2000 one
    expect(
      keepCentreScroll({
        scroll: 100,
        view: 800,
        from: 1000,
        to: 2000,
        padStart: 50,
        padEnd: 50,
      }),
    ).toBe(550);
  });

  it('stays inside the scrollable range', () => {
    // scrolled to the end of 2000, zooming out to 1000
    expect(keepCentreScroll({ scroll: 1200, view: 800, from: 2000, to: 1000 })).toBe(200);
    expect(keepCentreScroll({ scroll: 0, view: 800, from: 2000, to: 3000 })).toBe(200);
    // the new size fits the view: nothing to scroll
    expect(keepCentreScroll({ scroll: 500, view: 800, from: 1500, to: 600 })).toBe(0);
  });
});

describe('visiblePages', () => {
  it('shows one page in the single-page layout', () => {
    expect(visiblePages(1, 2, false)).toEqual([1]);
    expect(visiblePages(4, 10, false)).toEqual([4]);
  });

  it('shows two pages in a spread, the cover alone', () => {
    expect(visiblePages(0, 10, true)).toEqual([0]);
    expect(visiblePages(1, 10, true)).toEqual([1, 2]);
    expect(visiblePages(2, 10, true)).toEqual([1, 2]);
  });

  it('keeps a last odd page alone and a last pair together', () => {
    expect(visiblePages(9, 10, true)).toEqual([9]);
    expect(visiblePages(9, 11, true)).toEqual([9, 10]);
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
