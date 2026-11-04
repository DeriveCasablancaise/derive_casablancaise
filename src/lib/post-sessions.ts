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

export interface DayEntry<T> {
  post: T;
  sessions: PostSession[];
}

// a post shows once per day it plays, under every such day, sorted by that day's first start
export const groupPostsByDay = <T extends SessionSource>(posts: T[]) => {
  const days = new Map<string, DayEntry<T>[]>();

  for (const post of posts) {
    const perDay = new Map<string, PostSession[]>();
    for (const session of getPostSessions(post)) {
      const key = dayKey(session.start);
      perDay.set(key, [...(perDay.get(key) ?? []), session]);
    }
    perDay.forEach((sessions, key) => {
      days.set(key, [...(days.get(key) ?? []), { post, sessions }]);
    });
  }

  return Array.from(days.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, entries]) => ({
      day,
      entries: entries.sort((a, b) => byStart(a.sessions[0], b.sessions[0])),
    }));
};

// in a day list: that day's sessions; elsewhere: the first session not yet over
export const sessionsForCard = (
  post: SessionSource,
  options: { day?: string; now?: Date } = {},
) => {
  const all = getPostSessions(post);
  if (all.length === 0) return { shown: [], extra: 0 };

  let shown: PostSession[];
  if (options.day) {
    shown = all.filter((s) => dayKey(s.start) === options.day);
  } else {
    const now = time(options.now ?? toFloatingUTC(new Date())!);
    shown = [all.find((s) => time(s.end ?? s.start) >= now) ?? all[0]];
  }
  return { shown, extra: all.length - shown.length };
};

export const extraSessionsLabel = (extra: number, isArabic: boolean) => {
  if (extra <= 0) return '';
  if (isArabic) return extra === 1 ? '+1 عرض' : `+${extra} عروض`;
  return extra === 1 ? '+1 séance' : `+${extra} séances`;
};

// "12 nov. · 18:00, 21:00" for sessions of one day
export const formatCardSessions = (sessions: PostSession[], isArabic: boolean) => {
  if (sessions.length === 0) return '';
  const locale = isArabic ? arMA : fr;
  const day = format(fromFloatingUTC(sessions[0].start)!, 'd MMM', { locale });
  const times = sessions
    .map((s) => format(fromFloatingUTC(s.start)!, 'HH:mm', { locale }))
    .join(', ');
  return `${day} · ${times}`;
};
