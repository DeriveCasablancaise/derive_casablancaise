import { describe, expect, it } from 'vitest';
import {
  formatCardLines,
  getPostSessions,
  postsOnDay,
  sessionSpan,
  sortByFirstSession,
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

// three sessions on two days, like Ciel
const ciel = {
  _id: 'ciel3',
  startDateTime: at('2026-12-04T18:00:00'),
  sessions: [
    { start: at('2026-12-05T19:00:00') },
    { start: at('2026-12-04T21:00:00') },
    { start: at('2026-12-04T18:00:00') },
  ],
};

describe('one post, one card', () => {
  it('gives one list item for a post with 3 sessions on 2 days', () => {
    expect(sortByFirstSession([ciel])).toHaveLength(1);
  });

  it('drops a post that comes twice in the input', () => {
    expect(sortByFirstSession([ciel, single, ciel]).map((p) => p._id)).toEqual([
      'single',
      'ciel3',
    ]);
  });

  it('orders by first session, then by start date without sessions', () => {
    const late = { _id: 'late', startDateTime: at('2026-11-12T23:00:00') };
    expect(
      sortByFirstSession([late, ciel, single, sameDay]).map((p) => p._id),
    ).toEqual(['ciel', 'single', 'late', 'ciel3']);
  });

  it('shows the post once in each of its days, and nowhere else', () => {
    const posts = [ciel, single];
    expect(postsOnDay(posts, '2026-12-04').map((p) => p._id)).toEqual(['ciel3']);
    expect(postsOnDay(posts, '2026-12-05').map((p) => p._id)).toEqual(['ciel3']);
    expect(postsOnDay(posts, '2026-12-06')).toEqual([]);
  });
});

describe('formatCardLines', () => {
  const days = (...isos: string[]) => ({
    sessions: isos.map((iso) => ({ start: at(iso) })),
  });

  it('keeps the single-session text', () => {
    expect(formatCardLines({ startDateTime: at('2026-12-02T21:00:00') }, false)).toEqual([
      '2 décembre, 21h00',
    ]);
  });

  it('writes 2 days with one time each, in date order', () => {
    expect(formatCardLines(days('2026-12-04T15:30:00', '2026-12-03T19:00:00'), false)).toEqual([
      '3 décembre, 19h00',
      '4 décembre, 15h30',
    ]);
  });

  it('writes 1 day with 2 times', () => {
    expect(formatCardLines(days('2026-12-04T18:00:00', '2026-12-04T15:30:00'), false)).toEqual([
      '4 décembre, 15h30 et 18h00',
    ]);
  });

  it('writes 3 days mixed, month on every line', () => {
    expect(
      formatCardLines(
        days(
          '2026-12-01T20:30:00',
          '2026-11-30T19:00:00',
          '2026-12-01T15:30:00',
          '2026-12-02T21:00:00',
          '2026-12-01T18:00:00',
        ),
        false,
      ),
    ).toEqual([
      '30 novembre, 19h00',
      '1er décembre, 15h30, 18h00 et 20h30',
      '2 décembre, 21h00',
    ]);
  });

  it('shows only the day for a session without a time', () => {
    expect(formatCardLines(days('2026-12-05T00:00:00', '2026-12-06T19:00:00'), false)).toEqual([
      '5 décembre',
      '6 décembre, 19h00',
    ]);
    expect(formatCardLines({ startDateTime: at('2026-12-05T00:00:00') }, false)).toEqual([
      '5 décembre',
    ]);
  });

  it('writes Arabic with the same formatter and و', () => {
    const lines = formatCardLines(ciel, true);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toMatch(/^4 \S+، \d\d:\d\d و\d\d:\d\d$/);
    expect(lines[1]).toMatch(/^5 \S+، \d\d:\d\d$/);
    expect(
      formatCardLines(days('2026-12-04T15:30:00', '2026-12-04T18:00:00', '2026-12-04T20:30:00'), true),
    ).toEqual([expect.stringMatching(/^4 \S+، 15:30، 18:00 و20:30$/)]);
  });

  it('never writes a +N count', () => {
    const lines = formatCardLines(ciel, false);
    expect(lines.join(' ')).not.toMatch(/\+\d/);
  });

  it('is empty without any date', () => {
    expect(formatCardLines({}, false)).toEqual([]);
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

  it('accepts an empty end, for the post and for a session', () => {
    expect(postFormSchema.safeParse({ ...base, endDateTime: null }).success).toBe(true);
    expect(parse([{ start: at('2026-11-12T21:00:00') }]).success).toBe(true);
    expect(parse([{ start: at('2026-11-12T21:00:00'), end: null }]).success).toBe(true);
  });

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
