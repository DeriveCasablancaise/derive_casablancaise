import { describe, expect, it } from 'vitest';
import { BANNER_DEFAULTS, getBannerView } from '../banner';
import { bannerFormSchema } from '../validator';

const valid = { ...BANNER_DEFAULTS, textFr: 'Rendez-vous en 2026' };

describe('banner schema', () => {
  it('accepts the hidden empty default', () => {
    expect(bannerFormSchema.safeParse(BANNER_DEFAULTS).success).toBe(true);
  });

  it('accepts an https link and a site path with a label', () => {
    for (const linkUrl of ['https://example.com/a?b=1', '/derive-2026']) {
      const result = bannerFormSchema.safeParse({
        ...valid,
        linkUrl,
        linkLabelFr: 'Voir',
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects javascript: and other schemes', () => {
    for (const linkUrl of [
      'javascript:alert(1)',
      'JaVaScRiPt:alert(1)',
      'data:text/html,hi',
      'mailto:a@b.c',
      '//evil.com',
      '/\\evil.com',
      'example.com',
    ]) {
      const result = bannerFormSchema.safeParse({
        ...valid,
        linkUrl,
        linkLabelFr: 'Voir',
      });
      expect(result.success, linkUrl).toBe(false);
    }
  });

  it('requires a label when a link is set', () => {
    const result = bannerFormSchema.safeParse({
      ...valid,
      linkUrl: 'https://example.com',
    });
    expect(result.success).toBe(false);
  });

  it('limits the texts to 200 characters', () => {
    expect(
      bannerFormSchema.safeParse({ ...valid, textFr: 'a'.repeat(200) }).success,
    ).toBe(true);
    expect(
      bannerFormSchema.safeParse({ ...valid, textFr: 'a'.repeat(201) }).success,
    ).toBe(false);
    expect(
      bannerFormSchema.safeParse({ ...valid, textAr: 'ع'.repeat(201) }).success,
    ).toBe(false);
  });

  it('rejects HTML in the text', () => {
    expect(
      bannerFormSchema.safeParse({ ...valid, textFr: '<b>2026</b>' }).success,
    ).toBe(false);
  });

  it('needs French text to be switched on', () => {
    expect(
      bannerFormSchema.safeParse({ ...BANNER_DEFAULTS, isActive: true })
        .success,
    ).toBe(false);
  });
});

describe('banner visibility', () => {
  const active = { ...valid, isActive: true, textAr: 'مرحبا' };

  it('shows nothing for the default', () => {
    expect(getBannerView(BANNER_DEFAULTS, 'fr')).toBeNull();
    expect(getBannerView(undefined, 'fr')).toBeNull();
  });

  it('shows nothing when inactive, even with text', () => {
    expect(getBannerView({ ...active, isActive: false }, 'fr')).toBeNull();
  });

  it('shows nothing when the text is empty or blank', () => {
    expect(getBannerView({ isActive: true, textFr: '   ' }, 'fr')).toBeNull();
  });

  it('uses Arabic, right to left, when it exists', () => {
    expect(getBannerView(active, 'ar')).toMatchObject({
      text: 'مرحبا',
      isArabic: true,
    });
  });

  it('falls back to French, left to right, without Arabic text', () => {
    expect(getBannerView({ ...active, textAr: '' }, 'ar')).toMatchObject({
      text: 'Rendez-vous en 2026',
      isArabic: false,
    });
  });

  it('prefixes the locale on paths, not on external links', () => {
    const path = getBannerView(
      { ...active, linkUrl: '/derive-2026', linkLabelFr: 'Voir' },
      'ar',
    );
    expect(path?.link).toEqual({
      href: '/ar/derive-2026',
      label: 'Voir',
      external: false,
    });

    const ext = getBannerView(
      { ...active, linkUrl: 'https://example.com', linkLabelFr: 'Voir' },
      'fr',
    );
    expect(ext?.link).toMatchObject({
      href: 'https://example.com',
      external: true,
    });
  });

  it('drops a link that has no label', () => {
    const view = getBannerView({ ...active, linkUrl: '/derive-2026' }, 'fr');
    expect(view?.link).toBeUndefined();
  });
});
