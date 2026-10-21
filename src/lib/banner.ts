// neutral in-memory default: hidden, nothing written
export const BANNER_DEFAULTS = {
  isActive: false,
  textFr: '',
  textAr: '',
  linkUrl: '',
  linkLabelFr: '',
  linkLabelAr: '',
};

export interface BannerData {
  isActive?: boolean;
  textFr?: string;
  textAr?: string;
  linkUrl?: string;
  linkLabelFr?: string;
  linkLabelAr?: string;
}

export interface BannerView {
  text: string;
  isArabic: boolean;
  link?: { href: string; label: string; external: boolean };
}

const LOCALE_PREFIX = /^\/(fr|ar)(\/|$)/;

// only http(s) or a site path, "//host" and "/\host" would leave the site
export function isSafeBannerUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  if (value.startsWith('/')) return !/^\/[/\\]/.test(value);
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    return Boolean(new URL(value).hostname);
  } catch {
    return false;
  }
}

// decides if the banner shows and what it says, null means nothing is rendered
export function getBannerView(
  data: BannerData | null | undefined,
  locale: string,
): BannerView | null {
  if (!data || data.isActive !== true) return null;

  const textFr = data.textFr?.trim() || '';
  const textAr = data.textAr?.trim() || '';
  const useArabic = locale === 'ar' && textAr !== '';
  const text = useArabic ? textAr : textFr;
  if (!text) return null;

  const url = data.linkUrl?.trim() || '';
  const label = useArabic
    ? data.linkLabelAr?.trim() || data.linkLabelFr?.trim() || ''
    : data.linkLabelFr?.trim() || '';

  // a link with no label is dropped, the text still shows
  if (!url || !label) return { text, isArabic: useArabic };

  const external = !url.startsWith('/');
  const href = external || LOCALE_PREFIX.test(url) ? url : `/${locale}${url}`;
  return { text, isArabic: useArabic, link: { href, label, external } };
}
