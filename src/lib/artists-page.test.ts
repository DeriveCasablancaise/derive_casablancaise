import { describe, expect, it } from 'vitest';
import {
  artistBackHref,
  artistsHeading,
  parseEditionSelection,
  serializeEditionSelection,
  toggleEdition,
} from './artists-page';

describe('parseEditionSelection', () => {
  it('defaults to the current edition when the parameter is missing', () => {
    expect(parseEditionSelection([], '2026')).toEqual(['2026']);
    expect(parseEditionSelection([''], '2026')).toEqual(['2026']);
  });

  it('reads "all" as an empty selection', () => {
    expect(parseEditionSelection(['all'])).toEqual([]);
    expect(parseEditionSelection(['2024,all'])).toEqual([]);
  });

  it('reads one year, comma lists and repeated parameters', () => {
    expect(parseEditionSelection(['2024'])).toEqual(['2024']);
    expect(parseEditionSelection(['2026,2024'])).toEqual(['2024', '2026']);
    expect(parseEditionSelection(['2026', '2022'])).toEqual(['2022', '2026']);
    expect(parseEditionSelection(['2024,2024'])).toEqual(['2024']);
  });

  it('drops unknown years and falls back when nothing is left', () => {
    expect(parseEditionSelection(['2024,2025'])).toEqual(['2024']);
    expect(parseEditionSelection(['abc'], '2026')).toEqual(['2026']);
    expect(parseEditionSelection(['constructor'], '2026')).toEqual(['2026']);
  });
});

describe('serializeEditionSelection / toggleEdition', () => {
  it('writes "all" or a comma list', () => {
    expect(serializeEditionSelection([])).toBe('all');
    expect(serializeEditionSelection(['2024', '2026'])).toBe('2024,2026');
  });

  it('adds and removes a year, keeping registry order', () => {
    expect(toggleEdition(['2026'], '2024')).toEqual(['2024', '2026']);
    expect(toggleEdition(['2024', '2026'], '2026')).toEqual(['2024']);
    expect(toggleEdition(['2024'], '2024')).toEqual([]);
  });
});

describe('artistsHeading', () => {
  const during = new Date('2026-11-13T12:00:00Z');
  const after = new Date('2026-12-07T12:00:00Z');

  it('names the edition while it is not over', () => {
    expect(artistsHeading(['2026'], during)).toEqual({
      kind: 'edition',
      year: '2026',
    });
  });

  it('uses the past wording for an edition that is over', () => {
    expect(artistsHeading(['2024'], during)).toEqual({ kind: 'past' });
    expect(artistsHeading(['2026'], after)).toEqual({ kind: 'past' });
  });

  it('keeps the general heading for all or several years', () => {
    expect(artistsHeading([], during)).toEqual({ kind: 'all' });
    expect(artistsHeading(['2024', '2026'], during)).toEqual({ kind: 'all' });
  });
});

describe('artistBackHref', () => {
  it('prefers the current edition when the artist has it', () => {
    expect(artistBackHref('fr', ['2024', '2026'], '2026')).toBe(
      '/fr/community?edition=2026',
    );
  });

  it('otherwise uses the artist latest edition', () => {
    expect(artistBackHref('ar', ['2022', '2024'], '2026')).toBe(
      '/ar/community?edition=2024',
    );
  });

  it('falls back to the current edition for an artist without editions', () => {
    expect(artistBackHref('fr', [], '2026')).toBe('/fr/community?edition=2026');
  });
});
