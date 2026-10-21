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
}

// decides which landing blocks have something to show
export function getLandingView(data: LandingData, isArabic: boolean) {
  const d = data as Record<string, string | undefined>;

  // sanitizeHtml gives '' for a block with no text, so it is skipped
  const texts = [1, 2, 3]
    .map((n) => ({
      n,
      html: sanitizeHtml(
        isArabic ? d[`text${n}Ar`] || d[`text${n}Fr`] : d[`text${n}Fr`],
      ),
    }))
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

  return {
    texts,
    videos,
    backgroundImage,
    showBackground: Boolean(backgroundImage) || texts.length > 0,
  };
}
