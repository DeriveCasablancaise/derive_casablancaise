import { sanitizeHtml } from '@/lib/sanitize';

export interface LandingData {
  text1Fr?: string;
  text1Ar?: string;
  text2Fr?: string;
  text2Ar?: string;
  text3Fr?: string;
  text3Ar?: string;
  video1Thumbnail?: string;
  video1IframeLink?: string;
  video1TitleFr?: string;
  video1TitleAr?: string;
  video2Thumbnail?: string;
  video2IframeLink?: string;
  video2TitleFr?: string;
  video2TitleAr?: string;
  backgroundImage?: string;
  videosHeadingFr?: string;
  videosHeadingAr?: string;
}

// decides which landing blocks have something to show
export function getLandingView(data: LandingData, isArabic: boolean) {
  const d = data as Record<string, string | undefined>;

  // sanitizeHtml gives '' for a block with no text, so it is skipped.
  // rtl is true only when the block really shows Arabic, not the French fallback
  const texts = [1, 2, 3]
    .map((n) => {
      const ar = isArabic ? sanitizeHtml(d[`text${n}Ar`]) : '';
      return {
        n,
        html: ar || sanitizeHtml(d[`text${n}Fr`]),
        rtl: Boolean(ar),
      };
    })
    .filter((block) => block.html);

  const videos = [1, 2]
    .filter((n) => d[`video${n}Thumbnail`] && d[`video${n}IframeLink`])
    .map((n) => ({
      n,
      thumbnail: d[`video${n}Thumbnail`] as string,
      link: d[`video${n}IframeLink`] as string,
      title: (isArabic
        ? d[`video${n}TitleAr`] || d[`video${n}TitleFr`]
        : d[`video${n}TitleFr`]) as string | undefined,
    }));

  const backgroundImage = data.backgroundImage || '';

  // only for the 2026 landing: no heading text or no video means no heading
  const headingAr = isArabic ? d.videosHeadingAr?.trim() : '';
  const headingText = headingAr || d.videosHeadingFr?.trim() || '';
  const videosHeading =
    headingText && videos.length > 0
      ? { text: headingText, rtl: Boolean(headingAr) }
      : null;

  return {
    texts,
    videos,
    videosHeading,
    backgroundImage,
    showBackground: Boolean(backgroundImage) || texts.length > 0,
  };
}
