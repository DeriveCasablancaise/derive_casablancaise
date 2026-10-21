import { describe, expect, it } from 'vitest';
import { DERIVE_2026_DEFAULTS } from '../derive2026-defaults';
import { getLandingView } from '../landing';
import { derive2026FormSchema } from '../validator';

describe('derive 2026 neutral default', () => {
  it('has no text, video or image', () => {
    for (const value of Object.values(DERIVE_2026_DEFAULTS)) {
      expect(value).toBe('');
    }
  });

  it('is valid for the form schema', () => {
    expect(derive2026FormSchema.safeParse(DERIVE_2026_DEFAULTS).success).toBe(
      true,
    );
  });

  it('rejects a video with a link and no thumbnail', () => {
    const result = derive2026FormSchema.safeParse({
      ...DERIVE_2026_DEFAULTS,
      video1IframeLink: 'https://youtu.be/abc',
    });
    expect(result.success).toBe(false);
  });
});

describe('landing visibility', () => {
  it('shows nothing for the neutral default', () => {
    for (const isArabic of [false, true]) {
      const view = getLandingView(DERIVE_2026_DEFAULTS, isArabic);
      expect(view.texts).toEqual([]);
      expect(view.videos).toEqual([]);
      expect(view.showBackground).toBe(false);
    }
  });

  it('skips a text block that only holds an empty paragraph', () => {
    const view = getLandingView(
      { ...DERIVE_2026_DEFAULTS, text1Fr: '<p></p>', text2Fr: '<p>Salut</p>' },
      false,
    );
    expect(view.texts.map((b) => b.n)).toEqual([2]);
  });

  it('falls back to French when the Arabic text is empty', () => {
    const data = { ...DERIVE_2026_DEFAULTS, text1Fr: '<p>Salut</p>' };
    expect(getLandingView(data, true).texts).toHaveLength(1);
  });

  it('needs both a thumbnail and a link to show a video', () => {
    const view = getLandingView(
      {
        ...DERIVE_2026_DEFAULTS,
        video1Thumbnail: '/a.jpg',
        video2Thumbnail: '/b.jpg',
        video2IframeLink: 'https://youtu.be/abc',
        video2TitleFr: 'Titre',
      },
      false,
    );
    expect(view.videos.map((v) => v.n)).toEqual([2]);
    expect(view.videos[0].title).toBe('Titre');
  });

  it('shows the background block for an image alone', () => {
    const view = getLandingView(
      { ...DERIVE_2026_DEFAULTS, backgroundImage: '/bg.png' },
      false,
    );
    expect(view.showBackground).toBe(true);
    expect(view.texts).toEqual([]);
  });
});
