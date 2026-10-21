import { format, isSameDay } from 'date-fns';
import { fr, arMA } from 'date-fns/locale';
import { sanitizeHtml } from '@/lib/sanitize';

// dates are saved as "floating" UTC: the UTC fields hold the wall-clock time
// I rebuild a local Date from them so format() reads the same numbers on any server
export const toWallClock = (value: Date | string) => {
  const date = new Date(value);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
};

// a missing end follows the start, never the server clock
export const defaultEndDate = <T extends Date | string>(
  start?: T,
  end?: T,
): T | undefined => end ?? start;

export const formatPostDates = (
  start: Date | string,
  end: Date | string | undefined,
  isArabic: boolean,
) => {
  const locale = isArabic ? arMA : fr;
  const startDate = toWallClock(start);
  const endDate = toWallClock(defaultEndDate(start, end)!);

  const day = (date: Date) => format(date, 'PPP', { locale });
  const time = (date: Date) => format(date, 'HH:mm', { locale });

  if (startDate.getTime() === endDate.getTime()) {
    return `${day(startDate)} ${time(startDate)}`;
  }
  if (isSameDay(startDate, endDate)) {
    return `${day(startDate)} ${time(startDate)} - ${time(endDate)}`;
  }
  return `${day(startDate)} ${time(startDate)} - ${day(endDate)} ${time(endDate)}`;
};

const isBlank = (value?: string | null, html = false) =>
  !value || (html ? sanitizeHtml(value) === '' : value.trim() === '');

// Arabic is used per field only when it has content, French otherwise
export const pickLocalized = (
  arabic: string | null | undefined,
  french: string,
  wantArabic: boolean,
  html = false,
) => {
  if (wantArabic && !isBlank(arabic, html)) {
    return { value: arabic as string, isArabic: true };
  }
  return { value: french, isArabic: false };
};

export const getPostFields = (post: any, locale: string) => {
  const wantArabic = locale === 'ar';
  return {
    title: pickLocalized(post.arabicTitle, post.frenchTitle, wantArabic),
    text: pickLocalized(post.arabicText, post.frenchText, wantArabic, true),
    location: pickLocalized(post.locationAr, post.location, wantArabic),
  };
};
