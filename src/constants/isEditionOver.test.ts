import { describe, expect, it } from 'vitest';
import { getEdition, isEditionOver } from './editions';

describe('isEditionOver', () => {
  const edition2026 = getEdition('2026');

  it('is not over before the last day', () => {
    expect(isEditionOver(edition2026, new Date('2026-12-04T12:00:00Z'))).toBe(
      false,
    );
  });

  // the instants below fall on the same Casablanca date at UTC+0 or UTC+1
  it('is not over on the last day, until midnight in Casablanca', () => {
    expect(isEditionOver(edition2026, new Date('2026-12-05T01:30:00Z'))).toBe(
      false,
    );
    expect(isEditionOver(edition2026, new Date('2026-12-05T22:30:00Z'))).toBe(
      false,
    );
  });

  it('is over from the day after', () => {
    expect(isEditionOver(edition2026, new Date('2026-12-06T01:30:00Z'))).toBe(
      true,
    );
    expect(isEditionOver(edition2026, new Date('2026-12-10T12:00:00Z'))).toBe(
      true,
    );
  });

  it('counts an edition without endDate as over', () => {
    expect(isEditionOver(getEdition('2024'), new Date('2020-01-01'))).toBe(
      true,
    );
  });
});
