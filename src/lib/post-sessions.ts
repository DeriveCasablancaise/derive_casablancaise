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

// a session saved at 00:00 has no time of its own
const hasTime = (date: Date) => date.getHours() !== 0 || date.getMinutes() !== 0;

// One line per day, in order, each with its times:
// "3 décembre, 19h00", "4 décembre, 15h30 et 18h00", or just "5 décembre"
export const formatCardLines = (
  post: SessionSource,
  isArabic: boolean,
): string[] => {
  const locale = isArabic ? arMA : fr;
  const days: { date: Date; times: Date[] }[] = [];
  for (const session of getPostSessions(post)) {
    const date = fromFloatingUTC(session.start)!;
    const prev = days[days.length - 1];
    if (prev && prev.date.toDateString() === date.toDateString()) {
      prev.times.push(date);
    } else {
      days.push({ date, times: [date] });
    }
  }

  return days.map(({ date, times }) => {
    const dayNumber =
      !isArabic && date.getDate() === 1 ? '1er' : String(date.getDate());
    const day = `${dayNumber} ${format(date, 'MMMM', { locale })}`;
    // sessions are sorted already; I drop repeats of the same time
    const hours = Array.from(
      new Set(
        times
          .filter(hasTime)
          .map((t) => format(t, isArabic ? 'HH:mm' : "HH'h'mm", { locale })),
      ),
    );
    if (hours.length === 0) return day;
    return `${day}${isArabic ? '، ' : ', '}${joinList(hours, isArabic)}`;
  });
};
