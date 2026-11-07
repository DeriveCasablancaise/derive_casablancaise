// Pasted text keeps its structure, not its look. A regex is enough here: Tiptap
// parses the result next, and the saved HTML still goes through sanitizeHtml.
const DROPPED_PROPERTY =
  /^(color|background|background-color|font|font-family|font-size|mso-.*)$/i;

const cleanStyle = (style: string) =>
  style
    // Word quotes font names with an entity, whose ; is not a separator
    .replace(/&quot;/g, "'")
    .split(';')
    .map((declaration) => declaration.trim())
    .filter((declaration) => {
      const property = declaration.split(':')[0]?.trim();
      return property && !DROPPED_PROPERTY.test(property);
    })
    .join('; ');

export function cleanPastedHtml(html: string) {
  return html
    .replace(
      /\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi,
      (_match, _quoted, double?: string, single?: string) => {
        const style = cleanStyle(double ?? single ?? '');
        return style ? ` style="${style.replace(/"/g, "'")}"` : '';
      },
    )
    .replace(/\s(color|face|size|bgcolor)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}
