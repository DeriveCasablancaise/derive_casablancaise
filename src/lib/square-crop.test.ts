import { describe, expect, it } from 'vitest';
import {
  clampCrop,
  exportAttempts,
  FORMAT_ERROR,
  initialCrop,
  MAX_SOURCE_BYTES,
  needsSquareCrop,
  outputSide,
  panCrop,
  SIZE_ERROR,
  validateImageFile,
  zoomCrop,
} from './square-crop';

describe('needsSquareCrop', () => {
  it('skips ratios from 0.95 to 1.05', () => {
    expect(needsSquareCrop(1000, 1000)).toBe(false);
    expect(needsSquareCrop(950, 1000)).toBe(false);
    expect(needsSquareCrop(1050, 1000)).toBe(false);
  });

  it('asks for a crop outside that range', () => {
    expect(needsSquareCrop(949, 1000)).toBe(true);
    expect(needsSquareCrop(1051, 1000)).toBe(true);
  });
});

describe('initialCrop', () => {
  it('puts a portrait focus at 30% from the top', () => {
    expect(initialCrop(1000, 2000)).toEqual({ x: 0, y: 100, size: 1000 });
  });

  it('stays inside a barely portrait image', () => {
    expect(initialCrop(1000, 1100)).toEqual({ x: 0, y: 0, size: 1000 });
  });

  it('centres a landscape image', () => {
    expect(initialCrop(2000, 1000)).toEqual({ x: 500, y: 0, size: 1000 });
  });

  it('covers a square image whole', () => {
    expect(initialCrop(800, 800)).toEqual({ x: 0, y: 0, size: 800 });
  });
});

describe('clampCrop', () => {
  it('keeps the crop inside the image', () => {
    expect(clampCrop({ x: -5, y: -5, size: 100 }, 200, 200)).toEqual({
      x: 0,
      y: 0,
      size: 100,
    });
    expect(clampCrop({ x: 500, y: 500, size: 100 }, 200, 300)).toEqual({
      x: 100,
      y: 200,
      size: 100,
    });
  });
});

describe('panCrop', () => {
  const crop = { x: 500, y: 0, size: 1000 };

  it('converts frame pixels to source pixels, against the drag', () => {
    expect(panCrop(crop, 100, 0, 500, 2000, 1000).x).toBe(300);
    expect(panCrop(crop, -100, 0, 500, 2000, 1000).x).toBe(700);
  });

  it('stops at the edges', () => {
    expect(panCrop(crop, 5000, 50, 500, 2000, 1000)).toEqual({
      x: 0,
      y: 0,
      size: 1000,
    });
  });
});

describe('zoomCrop', () => {
  it('shrinks the crop around its centre', () => {
    expect(zoomCrop({ x: 500, y: 0, size: 1000 }, 200, 2000, 1000)).toEqual({
      x: 750,
      y: 250,
      size: 500,
    });
  });

  it('holds zoom between 100% and 300%', () => {
    const crop = { x: 0, y: 0, size: 900 };
    expect(zoomCrop(crop, 50, 900, 900).size).toBe(900);
    expect(zoomCrop(crop, 900, 900, 900).size).toBe(300);
  });

  it('stays inside the image when zooming back out', () => {
    expect(zoomCrop({ x: 700, y: 0, size: 300 }, 100, 1000, 900)).toEqual({
      x: 100,
      y: 0,
      size: 900,
    });
  });
});

describe('outputSide', () => {
  it('caps at 1200 px', () => {
    expect(outputSide(3000)).toBe(1200);
  });

  it('never upscales', () => {
    expect(outputSide(800)).toBe(800);
  });
});

describe('exportAttempts', () => {
  it('starts at the full side and quality 0.85, then only gets smaller', () => {
    const attempts = exportAttempts(1200);
    expect(attempts[0]).toEqual({ side: 1200, quality: 0.85 });
    expect(attempts.at(-1)).toEqual({ side: 720, quality: 0.65 });
  });
});

describe('validateImageFile', () => {
  it('accepts the four formats within the limit', () => {
    for (const type of ['jpeg', 'png', 'webp', 'heic']) {
      expect(validateImageFile({ type: `image/${type}`, size: 10 })).toBeNull();
    }
  });

  it('accepts a file exactly at the limit', () => {
    expect(
      validateImageFile({ type: 'image/png', size: MAX_SOURCE_BYTES }),
    ).toBeNull();
  });

  it('rejects other formats', () => {
    expect(validateImageFile({ type: 'image/svg+xml', size: 10 })).toBe(
      FORMAT_ERROR,
    );
    expect(validateImageFile({ type: 'image/gif', size: 10 })).toBe(
      FORMAT_ERROR,
    );
  });

  it('rejects files over the limit', () => {
    expect(
      validateImageFile({ type: 'image/png', size: MAX_SOURCE_BYTES + 1 }),
    ).toBe(SIZE_ERROR);
  });
});
