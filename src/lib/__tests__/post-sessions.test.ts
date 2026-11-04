import { describe, expect, it } from 'vitest';
import {
  extraSessionsLabel,
  formatCardSessions,
  getPostSessions,
  groupPostsByDay,
  sessionSpan,
  sessionsForCard,
} from '@/lib/post-sessions';
import { postFormSchema } from '@/lib/validator';

// floating dates: the UTC fields are the Casablanca wall clock
const at = (iso: string) => new Date(`${iso}Z`);

const single = {
  _id: 'single',
  startDateTime: at('2026-11-12T19:00:00'),
  endDateTime: at('2026-11-12T21:00:00'),
};

const twoDays = {
  _id: 'twoDays',
  startDateTime: at('2026-11-12T18:00:00'),
  sessions: [
    { start: at('2026-11-13T20:00:00') },
    { start: at('2026-11-12T18:00:00'), end: at('2026-11-12T19:00:00') },
  ],
};

const sameDay = {
  _id: 'ciel',
  startDateTime: at('2026-11-12T17:00:00'),
  sessions: [
    { start: at('2026-11-12T21:00:00') },
    { start: at('2026-11-12T17:00:00') },
  ],
};

describe('getPostSessions', () => {
  it('falls back to the single dates of a post without sessions', () => {
    expect(getPostSessions(single)).toEqual([
      { start: single.startDateTime, end: single.endDateTime },
    ]);
  });

  it('treats an empty list as no sessions', () => {
    expect(getPostSessions({ ...single, sessions: [] })).toHaveLength(1);
  });

  it('returns nothing when there is no date at all', () => {
    expect(getPostSessions({})).toEqual([]);
  });

  it('sorts sessions by start', () => {
    const starts = getPostSessions(twoDays).map((s) => s.start);
    expect(starts).toEqual([at('2026-11-12T18:00:00'), at('2026-11-13T20:00:00')]);
  });
});

describe('groupPostsByDay', () => {
  it('keeps a post without sessions on its own day', () => {
    const days = groupPostsByDay([single]);
    expect(days.map((d) => d.day)).toEqual(['2026-11-12']);
    expect(days[0].entries[0].post).toBe(single);
  });

  it('puts a post with two sessions on two days under both days', () => {
    const days = groupPostsByDay([twoDays]);
    expect(days.map((d) => d.day)).toEqual(['2026-11-12', '2026-11-13']);
    expect(days.every((d) => d.entries.length === 1)).toBe(true);
  });

  it('shows a post once per day with all its times that day', () => {
    const days = groupPostsByDay([sameDay]);
    expect(days).toHaveLength(1);
    expect(days[0].entries).toHaveLength(1);
    expect(days[0].entries[0].sessions.map((s) => s.start)).toEqual([
      at('2026-11-12T17:00:00'),
      at('2026-11-12T21:00:00'),
    ]);
  });

  it('sorts a day by that day’s first start', () => {
    const [day] = groupPostsByDay([single, sameDay, twoDays]);
    expect(day.entries.map((e) => e.post._id)).toEqual([
      'ciel',
      'twoDays',
      'single',
    ]);
  });
});

describe('sessionsForCard and the "+N" count', () => {
  it('has no extra for a post without sessions', () => {
    expect(sessionsForCard(single, { now: at('2026-01-01T00:00:00') }).extra).toBe(0);
  });

  it('shows the first session not yet over, plus the others', () => {
    const card = sessionsForCard(twoDays, { now: at('2026-11-12T20:00:00') });
    expect(card.shown.map((s) => s.start)).toEqual([at('2026-11-13T20:00:00')]);
    expect(card.extra).toBe(1);
  });

  it('falls back to the first session once all are over', () => {
    const card = sessionsForCard(twoDays, { now: at('2027-01-01T00:00:00') });
    expect(card.shown[0].start).toEqual(at('2026-11-12T18:00:00'));
  });

  it('shows every time of the listed day', () => {
    const card = sessionsForCard(sameDay, { day: '2026-11-12' });
    expect(card.shown).toHaveLength(2);
    expect(card.extra).toBe(0);
    expect(formatCardSessions(card.shown, false)).toBe('12 nov. · 17:00, 21:00');
  });

  it('labels the extra sessions in both languages', () => {
    expect(extraSessionsLabel(0, false)).toBe('');
    expect(extraSessionsLabel(1, false)).toBe('+1 séance');
    expect(extraSessionsLabel(3, false)).toBe('+3 séances');
    expect(extraSessionsLabel(3, true)).toBe('+3 عروض');
  });
});

describe('sessionSpan', () => {
  it('runs from the first start to the latest end', () => {
    expect(sessionSpan(twoDays.sessions)).toEqual({
      start: at('2026-11-12T18:00:00'),
      end: at('2026-11-13T20:00:00'),
    });
  });
});

describe('postFormSchema sessions', () => {
  const base = {
    frenchTitle: 'Ciel',
    frenchText: 'Un spectacle',
    postCategory: 'danse',
    yearOfEdition: '2026',
    location: 'Casablanca',
  };
  const parse = (sessions: unknown) =>
    postFormSchema.safeParse({ ...base, sessions });

  it('accepts a post without sessions or with an empty list', () => {
    expect(parse(undefined).success).toBe(true);
    const empty = parse([]);
    expect(empty.success).toBe(true);
    expect(empty.data?.sessions).toBeUndefined();
  });

  it('rejects an end before the start', () => {
    const result = parse([
      { start: at('2026-11-12T21:00:00'), end: at('2026-11-12T20:00:00') },
    ]);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.path.join('.') === 'sessions.0.end')).toBe(true);
  });

  it('rejects more than 10 sessions', () => {
    const many = Array.from({ length: 11 }, () => ({
      start: at('2026-11-12T21:00:00'),
    }));
    const result = parse(many);
    expect(result.error?.issues.some((i) => i.path[0] === 'sessions')).toBe(true);
  });

  it('rejects a session without a start', () => {
    const result = parse([{ venueFr: 'Studio' }]);
    expect(result.error?.issues.some((i) => i.path.join('.') === 'sessions.0.start')).toBe(true);
  });
});
