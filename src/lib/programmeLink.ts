// Returns true when the click should open the flipbook reader
// instead of following the default link behaviour.
export function shouldOpenReader(
  e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean },
  hasReader: boolean,
): boolean {
  if (!hasReader) return false;
  // middle click
  if (e.button !== 0) return false;
  // modifier keys → let the browser handle (new tab, etc.)
  if (e.metaKey || e.ctrlKey || e.shiftKey) return false;
  return true;
}

// a new deploy gives the PDF a new URL, so no browser keeps an old copy
export function versionedHref(path: string, version: string | undefined): string {
  if (!version) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}v=${encodeURIComponent(version)}`;
}
