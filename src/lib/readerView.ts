export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.25;

interface Size {
  w: number;
  h: number;
}

// keeps zoom inside the range and on the 25% grid
export function clampZoom(z: number): number {
  if (!Number.isFinite(z)) return MIN_ZOOM;
  const snapped = Math.round(z / ZOOM_STEP) * ZOOM_STEP;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, snapped));
}

export function stepZoom(z: number, dir: 1 | -1): number {
  return clampZoom(z + dir * ZOOM_STEP);
}

// double click / double tap: 100% <-> 200%
export function toggleZoom(z: number): number {
  return z > MIN_ZOOM ? MIN_ZOOM : 2;
}

// The book is scaled around its centre, so it can move by half of what
// the scaled book exceeds the view by, per axis. Smaller than the view: no pan.
export function clampPan(
  pan: { x: number; y: number },
  zoom: number,
  content: Size,
  view: Size,
): { x: number; y: number } {
  const limit = (c: number, v: number) => Math.max(0, (c * zoom - v) / 2);
  const lx = limit(content.w, view.w);
  const ly = limit(content.h, view.h);
  return {
    x: Math.min(lx, Math.max(-lx, pan.x)) + 0,
    y: Math.min(ly, Math.max(-ly, pan.y)) + 0,
  };
}

// "go to page" input: 1-based text in, 0-based index out, clamped. null if not a number
export function parsePageInput(raw: string, total: number): number | null {
  const n = parseInt(raw.trim(), 10);
  if (Number.isNaN(n) || total < 1) return null;
  return Math.min(total, Math.max(1, n)) - 1;
}

// Book indices (0-based; the counter shows index + 1). With a cover, a spread
// starts on an odd index: 0 | 1-2 | 3-4 ... Single-page layouts step by one.
export function snapIndex(index: number, total: number, spread: boolean): number {
  const last = lastIndex(total, spread);
  const i = Math.min(last, Math.max(0, Math.round(index)));
  return spread && i > 0 && i % 2 === 0 ? i - 1 : i;
}

export function lastIndex(total: number, spread: boolean): number {
  if (total < 1) return 0;
  if (!spread) return total - 1;
  return (total - 1) % 2 === 1 ? total - 1 : Math.max(0, total - 2);
}

export function stepIndex(
  current: number,
  dir: 1 | -1,
  total: number,
  spread: boolean,
): number {
  if (!spread) return snapIndex(current + dir, total, false);
  if (dir === -1) return current <= 1 ? 0 : snapIndex(current - 2, total, true);
  return current === 0 ? snapIndex(1, total, true) : snapIndex(current + 2, total, true);
}

// after a programmatic flip, the book must report the page I asked for
export function needsFallback(
  actual: number | null | undefined,
  target: number,
): boolean {
  return typeof actual !== 'number' || actual !== target;
}
