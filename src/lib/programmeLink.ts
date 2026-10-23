// Returns true when the click should open the flipbook reader
// instead of following the default link behaviour.
export function shouldOpenReader(
  e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean },
  hasProgrammeBook: boolean,
): boolean {
  if (!hasProgrammeBook) return false;
  // middle click
  if (e.button !== 0) return false;
  // modifier keys → let the browser handle (new tab, etc.)
  if (e.metaKey || e.ctrlKey || e.shiftKey) return false;
  return true;
}

