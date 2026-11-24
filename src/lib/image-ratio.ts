import type { CSSProperties } from 'react';

// used before the image has loaded, so the layout jumps only a little
export const DEFAULT_RATIO = 4 / 3;

// target row heights of the justified grids
export const ROW_HEIGHT = 260;
export const ROW_HEIGHT_SM = 180;

// width / height, or the fallback when either is missing, zero or not a number
export const ratioFrom = (
  width: number | null | undefined,
  height: number | null | undefined,
  fallback = DEFAULT_RATIO,
): number => {
  if (typeof width !== 'number' || typeof height !== 'number') return fallback;
  if (!Number.isFinite(width) || !Number.isFinite(height)) return fallback;
  if (width <= 0 || height <= 0) return fallback;
  return width / height;
};

// A tile grows in proportion to its ratio, so every tile of a row ends up
// with the same height and a width that follows its photo.
export const tileFlex = (ratio: number, rowHeight: number) => {
  const r = ratioFrom(ratio, 1);
  return { grow: r, basis: r * rowHeight };
};

// inline style for a justified tile; the classes in JustifiedGrid read the vars
export const tileStyle = (ratio: number): CSSProperties => {
  const desktop = tileFlex(ratio, ROW_HEIGHT);
  const mobile = tileFlex(ratio, ROW_HEIGHT_SM);
  return {
    aspectRatio: `${desktop.grow}`,
    '--tile-grow': `${desktop.grow}`,
    '--tile-basis': `${desktop.basis}px`,
    '--tile-basis-sm': `${mobile.basis}px`,
  } as CSSProperties;
};

// Width of a box at this ratio that is full width but never taller than
// maxHeight: when it would be, the box narrows instead.
export const fitWidth = (
  ratio: number,
  containerWidth: number,
  maxHeight: number,
): number => {
  const r = ratioFrom(ratio, 1);
  if (!(containerWidth > 0) || !(maxHeight > 0)) return 0;
  return Math.min(containerWidth, maxHeight * r);
};

// the same rule in CSS, for the gallery: min(100%, maxVh * ratio)
export const fitWidthCss = (ratio: number, maxVh = 80): string =>
  `min(100%, ${+(maxVh * ratioFrom(ratio, 1)).toFixed(3)}vh)`;

// WCAG contrast of white text over black at this opacity, laid on a pure white
// image, the worst case under a scrim
export const whiteOnScrimOverWhite = (opacity: number): number => {
  const channel = 1 - Math.min(1, Math.max(0, opacity));
  const linear =
    channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  return 1.05 / (linear + 0.05);
};
