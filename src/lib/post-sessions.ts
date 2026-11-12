import { format } from 'date-fns';
import { fr, arMA } from 'date-fns/locale';

// no server or DOM imports here: the admin form and the listing cards use it too

type DateValue = Date | string;

export interface PostSession {
  start: DateValue;
  end?: DateValue | null;
  venueFr?: string | null;
  venueAr?: string | null;
}

export interface SessionSource {
  sessions?: PostSession[] | null;
  startDateTime?: DateValue | null;
  endDateTime?: DateValue | null;
}

// dates are stored "floating": the UTC fields hold the Casablanca wall-clock time
export const toFloatingUTC = (date?: Date | null) => {
  if (!date) return undefined;
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
};

export const fromFloatingUTC = (value?: DateValue | null) => {
  if (!value) return undefined;
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

const time = (value: DateValue) => new Date(value).getTime();

// the floating date's UTC day, so the key is the same on any server
export const dayKey = (value: DateValue) =>
  new Date(value).toISOString().slice(0, 10);

const byStart = (a: PostSession, b: PostSession) => time(a.start) - time(b.start);

// a post without sessions keeps its single start/end as one session
export const getPostSessions = (post: SessionSource): PostSession[] => {
  if (post.sessions && post.sessions.length > 0) {
    return [...post.sessions].sort(byStart);
  }
  if (!post.startDateTime) return [];
  return [{ start: post.startDateTime, end: post.endDateTime ?? undefined }];
};

export const hasSessions = (post: SessionSource) =>
  Boolean(post.sessions && post.sessions.length > 0);

// overall span, written back to startDateTime/endDateTime so old sorts keep working
export const sessionSpan = (sessions: PostSession[]) => {
  const sorted = [...sessions].sort(byStart);
  const ends = sorted.map((s) => time(s.end ?? s.start));
  return {
    start: new Date(sorted[0].start),
    end: new Date(Math.max(...ends)),
  };
};

const firstStart = (post: SessionSource) => {
  const [first] = getPostSessions(post);
  return first ? time(first.start) : Number.POSITIVE_INFINITY;
};

// one entry per post, ordered by its first session (or its start date)
export const sortByFirstSession = <T extends SessionSource & { _id?: unknown }>(
  posts: T[],
) => {
  const seen = new Set<string>();
  const unique = posts.filter((post) => {
    if (post._id === undefined) return true;
    const id = String(post._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return unique.sort((a, b) => firstStart(a) - firstStart(b));
};

// the posts playing on a day, each once however many sessions it has that day
export const postsOnDay = <T extends SessionSource & { _id?: unknown }>(
  posts: T[],
  day: string,
) =>
  sortByFirstSession(
    posts.filter((post) =>
      getPostSessions(post).some((s) => dayKey(s.start) === day),
    ),
  );

const joinList = (items: string[], isArabic: boolean) => {
  if (items.length <= 1) return items.join('');
  const head = items.slice(0, -1).join(isArabic ? '، ' : ', ');
  const last = items[items.length - 1];
  return isArabic ? `${head} و${last}` : `${head} et ${last}`;
};

// "4 décembre", "4 et 5 décembre", "2, 3 et 5 décembre"; the time only for a single session
export const formatCardDays = (post: SessionSource, isArabic: boolean) => {
  const sessions = getPostSessions(post);
  if (sessions.length === 0) return '';
  const locale = isArabic ? arMA : fr;
  const dates = sessions.map((s) => fromFloatingUTC(s.start)!);

  const days: Date[] = [];
  for (const date of dates) {
    const prev = days[days.length - 1];
    if (!prev || prev.toDateString() !== date.toDateString()) {
      days.push(date);
    }
  }

  const dayNumber = (date: Date) =>
    !isArabic && date.getDate() === 1 ? '1er' : String(date.getDate());
  // the month goes after the last day of each month
  const items = days.map((date, index) => {
    const next = days[index + 1];
    const monthEnds = !next || next.getMonth() !== date.getMonth();
    return monthEnds
      ? `${dayNumber(date)} ${format(date, 'MMMM', { locale })}`
      : dayNumber(date);
  });

  const text = joinList(items, isArabic);
  if (sessions.length !== 1) return text;
  const hour = format(dates[0], isArabic ? 'HH:mm' : "HH'h'mm", { locale });
  return isArabic ? `${text}، ${hour}` : `${text}, ${hour}`;
};
