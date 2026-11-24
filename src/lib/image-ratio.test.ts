import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RATIO,
  fitWidth,
  fitWidthCss,
  ratioFrom,
  tileFlex,
  tileStyle,
  whiteOnScrimOverWhite,
} from './image-ratio';

describe('ratioFrom', () => {
  it('divides width by height', () => {
    expect(ratioFrom(1600, 900)).toBeCloseTo(16 / 9);
    expect(ratioFrom(600, 900)).toBeCloseTo(2 / 3);
  });

  it('falls back on zero, negative, NaN, Infinity and missing values', () => {
    expect(ratioFrom(0, 900)).toBe(DEFAULT_RATIO);
    expect(ratioFrom(900, 0)).toBe(DEFAULT_RATIO);
    expect(ratioFrom(-1, 10)).toBe(DEFAULT_RATIO);
    expect(ratioFrom(NaN, 10)).toBe(DEFAULT_RATIO);
    expect(ratioFrom(10, Infinity)).toBe(DEFAULT_RATIO);
    expect(ratioFrom(undefined, 10)).toBe(DEFAULT_RATIO);
    expect(ratioFrom(null, null, 1)).toBe(1);
  });
});

describe('tileFlex', () => {
  it('grows by the ratio and starts at ratio x row height', () => {
    expect(tileFlex(1.5, 260)).toEqual({ grow: 1.5, basis: 390 });
    expect(tileFlex(0.75, 180)).toEqual({ grow: 0.75, basis: 135 });
  });

  it('treats a broken ratio as the 4/3 default', () => {
    expect(tileFlex(NaN, 180)).toEqual({ grow: 4 / 3, basis: 240 });
    expect(tileFlex(0, 180)).toEqual({ grow: 4 / 3, basis: 240 });
  });

  it('gives tiles of one row the same height once they grow', () => {
    // two tiles in a 1000px row, no gap
    const a = tileFlex(1.5, 260);
    const b = tileFlex(0.75, 260);
    const extra = 1000 - a.basis - b.basis;
    const wa = a.basis + (extra * a.grow) / (a.grow + b.grow);
    const wb = b.basis + (extra * b.grow) / (a.grow + b.grow);
    expect(wa / 1.5).toBeCloseTo(wb / 0.75);
  });

  it('writes the style vars for both row heights', () => {
    expect(tileStyle(2)).toMatchObject({
      aspectRatio: '2',
      '--tile-grow': '2',
      '--tile-basis': '520px',
      '--tile-basis-sm': '360px',
    });
  });
});

describe('fitWidth', () => {
  it('keeps full width while the height fits', () => {
    expect(fitWidth(16 / 9, 800, 800)).toBe(800);
  });

  it('narrows a portrait box to the max height', () => {
    // 2:3 in an 800px column, max 640px tall: 640 * 2/3
    expect(fitWidth(2 / 3, 800, 640)).toBeCloseTo(426.667, 2);
  });

  it('returns 0 for an empty container or max height', () => {
    expect(fitWidth(1, 0, 600)).toBe(0);
    expect(fitWidth(1, 600, NaN)).toBe(0);
  });

  it('builds the CSS version', () => {
    expect(fitWidthCss(0.75)).toBe('min(100%, 60vh)');
    expect(fitWidthCss(NaN)).toBe('min(100%, 106.667vh)');
  });
});

describe('scrim contrast', () => {
  it('reaches 4.5:1 for white text at 75% black, even over pure white', () => {
    expect(whiteOnScrimOverWhite(0.75)).toBeGreaterThan(10);
  });

  it('needs about 54% black at least', () => {
    expect(whiteOnScrimOverWhite(0.54)).toBeGreaterThanOrEqual(4.5);
    expect(whiteOnScrimOverWhite(0.5)).toBeLessThan(4.5);
  });

  it('shows a flat 35% overlay alone is not enough', () => {
    expect(whiteOnScrimOverWhite(0.35)).toBeLessThan(4.5);
  });
});
