import { afterEach, describe, expect, it } from 'vitest';
import {
  defaultEndDate,
  formatPostDates,
  getPostFields,
  pickLocalized,
} from '../post-display';

const originalTZ = process.env.TZ;
afterEach(() => {
  if (originalTZ === undefined) delete process.env.TZ;
  else process.env.TZ = originalTZ;
});

// stored value: 5 Dec 2026, 20:30 wall-clock, saved as floating UTC
const start = new Date(Date.UTC(2026, 11, 5, 20, 30));
const sameDayEnd = new Date(Date.UTC(2026, 11, 5, 22, 0));
const nextDayEnd = new Date(Date.UTC(2026, 11, 6, 1, 15));

const zones = [
  'UTC',
  'Pacific/Kiritimati',
  'Pacific/Pago_Pago',
  'America/Los_Angeles',
];

describe('formatPostDates', () => {
  it.each(zones)('gives the same text in %s', (tz) => {
    process.env.TZ = tz;
    expect(formatPostDates(start, start, false)).toBe(
      '5 décembre 2026 20:30',
    );
    expect(formatPostDates(start, sameDayEnd, false)).toBe(
      '5 décembre 2026 20:30 - 22:00',
    );
    expect(formatPostDates(start, nextDayEnd, false)).toBe(
      '5 décembre 2026 20:30 - 6 décembre 2026 01:15',
    );
  });

  it('actually runs under different offsets', () => {
    const offsets = zones.map((tz) => {
      process.env.TZ = tz;
      return new Date(2026, 11, 5).getTimezoneOffset();
    });
    expect(new Set(offsets).size).toBeGreaterThan(1);
  });

  it('treats a missing end as the start', () => {
    expect(formatPostDates(start, undefined, false)).toBe(
      '5 décembre 2026 20:30',
    );
  });

  it('shows the times in Arabic too', () => {
    const text = formatPostDates(start, sameDayEnd, true);
    expect(text).toContain('20:30');
    expect(text).toContain('22:00');
  });
});

describe('defaultEndDate', () => {
  it('keeps an end that is given', () => {
    expect(defaultEndDate(start, sameDayEnd)).toBe(sameDayEnd);
  });

  it('falls back to the start, not to now', () => {
    expect(defaultEndDate(start, undefined)).toBe(start);
    expect(defaultEndDate(undefined, undefined)).toBeUndefined();
  });
});

describe('pickLocalized', () => {
  it('uses Arabic only when asked and not empty', () => {
    expect(pickLocalized('عنوان', 'Titre', true)).toEqual({
      value: 'عنوان',
      isArabic: true,
    });
    expect(pickLocalized('عنوان', 'Titre', false).value).toBe('Titre');
  });

  it('falls back to French on empty or blank Arabic', () => {
    expect(pickLocalized(undefined, 'Titre', true).value).toBe('Titre');
    expect(pickLocalized('', 'Titre', true).value).toBe('Titre');
    expect(pickLocalized('   ', 'Titre', true).isArabic).toBe(false);
  });

  it('counts html that sanitises to nothing as empty', () => {
    expect(pickLocalized('<p></p>', '<p>Texte</p>', true, true).value).toBe(
      '<p>Texte</p>',
    );
    expect(pickLocalized('<p>&nbsp;</p>', 'fr', true, true).isArabic).toBe(
      false,
    );
    expect(pickLocalized('<script>x()</script>', 'fr', true, true).isArabic).toBe(
      false,
    );
    expect(pickLocalized('<p>نص</p>', 'fr', true, true).isArabic).toBe(true);
  });
});

describe('getPostFields', () => {
  const post = {
    frenchTitle: 'Titre',
    arabicTitle: 'عنوان',
    frenchText: '<p>Texte</p>',
    arabicText: '<p></p>',
    location: 'Lieu',
    locationAr: '',
  };

  it('falls back per field in Arabic', () => {
    const f = getPostFields(post, 'ar');
    expect(f.title.value).toBe('عنوان');
    expect(f.text.value).toBe('<p>Texte</p>');
    expect(f.location.value).toBe('Lieu');
  });

  it('stays French in the French locale', () => {
    expect(getPostFields(post, 'fr').title.value).toBe('Titre');
  });
});
