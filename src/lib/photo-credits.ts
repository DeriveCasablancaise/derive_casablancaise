// Photo credits are plain text, keyed by image URL so they follow their image
// when images are reordered or removed.

export const MAX_CREDIT_LENGTH = 120;

export type ImageCredit = { url: string; credit: string };

// strips tags and stray angle brackets, collapses spaces; no truncation, the
// schema rejects anything longer than MAX_CREDIT_LENGTH
export function cleanCredit(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function creditFor(
  credits: readonly ImageCredit[] | null | undefined,
  url: string | null | undefined,
): string {
  if (!url || !credits) return '';
  return credits.find((c) => c.url === url)?.credit ?? '';
}

// sets one credit, an empty value removes it
export function setCredit(
  credits: readonly ImageCredit[] | null | undefined,
  url: string,
  credit: string,
): ImageCredit[] {
  const rest = (credits ?? []).filter((c) => c.url !== url);
  return credit.trim() ? [...rest, { url, credit }] : rest;
}

// after "Recadrer" the image gets a new URL, the credit goes with it
export function moveCredit(
  credits: readonly ImageCredit[] | null | undefined,
  fromUrl: string,
  toUrl: string,
): ImageCredit[] {
  if (fromUrl === toUrl) return [...(credits ?? [])];
  const credit = creditFor(credits, fromUrl);
  if (!credit) return [...(credits ?? [])];
  return setCredit(
    (credits ?? []).filter((c) => c.url !== fromUrl),
    toUrl,
    credit,
  );
}

// before[i] became after[i] (blob previews swapped for uploaded URLs)
export function remapCredits(
  credits: readonly ImageCredit[] | null | undefined,
  before: readonly (string | undefined)[],
  after: readonly (string | undefined)[],
): ImageCredit[] {
  const next = new Map<string, string>();
  before.forEach((url, i) => {
    const to = after[i];
    if (url && to && url !== to) next.set(url, to);
  });
  return (credits ?? []).map((c) => ({ ...c, url: next.get(c.url) ?? c.url }));
}

// only credits of images still on the document, cleaned, one per URL
export function keepCredits(
  credits: readonly ImageCredit[] | null | undefined,
  urls: readonly (string | null | undefined)[],
): ImageCredit[] {
  const allowed = new Set(urls.filter((u): u is string => Boolean(u)));
  const byUrl = new Map<string, string>();
  for (const c of credits ?? []) {
    const credit = cleanCredit(c?.credit);
    if (!c || !allowed.has(c.url)) continue;
    // the last entry for a URL wins, an empty one clears it
    if (credit) byUrl.set(c.url, credit);
    else byUrl.delete(c.url);
  }
  return Array.from(byUrl, ([url, credit]) => ({ url, credit }));
}

// "© " in front, unless the credit already starts with © or "Photo"
export function formatCredit(credit: string | null | undefined): string {
  const text = cleanCredit(credit);
  if (!text) return '';
  return /^(©|photo)/i.test(text) ? text : `© ${text}`;
}

export function altWithCredit(
  alt: string,
  credit: string | null | undefined,
  isArabic: boolean,
): string {
  const text = cleanCredit(credit);
  if (!text) return alt;
  return isArabic ? `${alt}، تصوير: ${text}` : `${alt}, photo : ${text}`;
}
