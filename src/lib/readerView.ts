export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.25;

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

// One axis of the zoom view. The pages (from -> to px) sit between fixed paddings
// and are centred while they fit. Returns the scroll that keeps the point at the
// centre of the view in place, clamped to what can actually be scrolled.
export function keepCentreScroll({
  scroll,
  view,
  from,
  to,
  padStart = 0,
  padEnd = 0,
}: {
  scroll: number;
  view: number;
  from: number;
  to: number;
  padStart?: number;
  padEnd?: number;
}): number {
  const start = (size: number) =>
    Math.max(0, (view - (size + padStart + padEnd)) / 2) + padStart;
  const point = (scroll + view / 2 - start(from)) / from;
  const max = Math.max(0, to + padStart + padEnd - view);
  return Math.min(max, Math.max(0, point * to + start(to) - view / 2));
}

// the pages on screen for a book index: the cover and a last odd page stay alone
export function visiblePages(
  index: number,
  total: number,
  spread: boolean,
): number[] {
  const i = snapIndex(index, total, spread);
  if (!spread || i === 0 || i + 1 >= total) return [i];
  return [i, i + 1];
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

export type PageSize = { w: number; h: number };

// The book takes the most common page size (rounded to whole PDF units, the
// first one wins a tie), so a lone cover of another size does not set it.
export function bookSize(sizes: PageSize[]): PageSize | null {
  const counts = new Map<string, { size: PageSize; n: number }>();
  let best: { size: PageSize; n: number } | null = null;
  for (const s of sizes) {
    if (!(s.w > 0) || !(s.h > 0)) continue;
    const key = `${Math.round(s.w)}x${Math.round(s.h)}`;
    const entry = counts.get(key) ?? { size: s, n: 0 };
    entry.n += 1;
    counts.set(key, entry);
    if (!best || entry.n > best.n) best = entry;
  }
  return best ? best.size : null;
}

export function isLandscape(size: PageSize): boolean {
  return size.w > size.h;
}

// landscape pages are already spreads, so they go one at a time
export function isSinglePage(
  pageW: number,
  pageH: number,
  isMobile: boolean,
): boolean {
  return isMobile || pageW > pageH;
}

// Page box (CSS px) that makes the book, one page or a spread of two, fill the
// space available, with no upper limit.
export function bookFit(
  book: PageSize,
  pagesAcross: 1 | 2,
  availW: number,
  availH: number,
): PageSize {
  const scale = Math.max(
    0,
    Math.min(availW / (book.w * pagesAcross), availH / book.h),
  );
  return { w: book.w * scale, h: book.h * scale };
}

// the shown spread first, then the next one, then the previous one
export function renderOrder(index: number, total: number, spread: boolean): number[] {
  const order = [
    ...visiblePages(index, total, spread),
    ...visiblePages(stepIndex(index, 1, total, spread), total, spread),
    ...visiblePages(stepIndex(index, -1, total, spread), total, spread),
  ];
  return Array.from(new Set(order)).filter((i) => i >= 0 && i < total);
}

// iOS Safari refuses canvases above 16,777,216 px; I stay a little under
export const MAX_CANVAS_PIXELS = 16_000_000;
export const RENDER_DEBOUNCE_MS = 150;

// scale that fits a page (PDF units) inside a box (CSS px)
export function fitScale(pageW: number, pageH: number, boxW: number, boxH: number): number {
  return Math.min(boxW / pageW, boxH / pageH);
}

// the scale asked for, lowered just enough to keep the canvas under the cap
export function renderScale(
  pageW: number,
  pageH: number,
  wanted: number,
  maxPixels = MAX_CANVAS_PIXELS,
): number {
  return Math.min(wanted, Math.sqrt(maxPixels / (pageW * pageH)));
}
