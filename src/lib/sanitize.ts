import DOMPurify from 'isomorphic-dompurify';

const ALIGN_VALUES = ['left', 'right', 'center', 'justify'];
const MEDIA_TAG = /<(img|video|audio|iframe|picture|svg|hr)[\s>/]/i;

// keep only "text-align: <value>" inside style attributes
const cleanStyle = (style: string) => {
  const match = /(?:^|;)\s*text-align\s*:\s*([a-z]+)\s*(?:;|$)/i.exec(style);
  const value = match?.[1].toLowerCase();
  return value && ALIGN_VALUES.includes(value) ? `text-align: ${value}` : '';
};

DOMPurify.addHook('afterSanitizeAttributes', (current) => {
  const node = current as Element;
  const style = node.getAttribute('style');
  if (style !== null) {
    const cleaned = cleanStyle(style);
    if (cleaned) node.setAttribute('style', cleaned);
    else node.removeAttribute('style');
  }

  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export function sanitizeHtml(html?: string | null): string {
  if (!html) return '';

  const clean = DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });

  const text = DOMPurify.sanitize(clean, { ALLOWED_TAGS: [] })
    .replace(/&nbsp;/g, ' ')
    .trim();

  if (!text && !MEDIA_TAG.test(clean)) return '';
  return clean;
}

// sanitises only the listed keys, only when they hold a string
export function sanitizeFields<T extends Record<string, any>>(
  data: T,
  keys: (keyof T)[],
): T {
  const out = { ...data };
  for (const key of keys) {
    if (typeof out[key] === 'string') {
      out[key] = sanitizeHtml(out[key]) as T[keyof T];
    }
  }
  return out;
}
