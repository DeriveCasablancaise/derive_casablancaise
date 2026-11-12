import { describe, expect, it } from 'vitest';
import {
  formatCardDays,
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

describe('formatCardDays', () => {
  const days = (...isos: string[]) => ({
    sessions: isos.map((iso) => ({ start: at(iso) })),
  });

  it('writes one, two and three days', () => {
    expect(formatCardDays(days('2026-12-04T18:00:00', '2026-12-04T21:00:00'), false)).toBe(
      '4 décembre',
    );
    expect(formatCardDays(days('2026-12-05T19:00:00', '2026-12-04T18:00:00'), false)).toBe(
      '4 et 5 décembre',
    );
    expect(
      formatCardDays(
        days('2026-12-02T18:00:00', '2026-12-05T18:00:00', '2026-12-03T18:00:00'),
        false,
      ),
    ).toBe('2, 3 et 5 décembre');
  });

  it('puts each month after its last day', () => {
    expect(formatCardDays(days('2026-11-30T18:00:00', '2026-12-01T18:00:00'), false)).toBe(
      '30 novembre et 1er décembre',
    );
  });

  it('adds the time for a single session only', () => {
    expect(formatCardDays({ startDateTime: at('2026-12-03T19:00:00') }, false)).toBe(
      '3 décembre, 19h00',
    );
    expect(formatCardDays(ciel, false)).toBe('4 et 5 décembre');
  });

  it('joins Arabic days with و', () => {
    const text = formatCardDays(ciel, true);
    expect(text).toMatch(/^4 و5 \S+$/);
    expect(formatCardDays({ startDateTime: at('2026-12-03T19:00:00') }, true)).toMatch(
      /^3 \S+، 19:00$/,
    );
  });

  it('is empty without any date', () => {
    expect(formatCardDays({}, false)).toBe('');
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
