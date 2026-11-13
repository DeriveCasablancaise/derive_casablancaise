import {
  CURRENT_EDITION_YEAR,
  EDITION_YEARS,
  EDITIONS,
  isEditionOver,
  parseEditionParam,
  type EditionYear,
} from '@/constants/editions';

// The years ticked on the community page; empty means every artist ("all").
export type EditionSelection = EditionYear[];

// Reads every ?edition= value: "all", one year, or a comma list.
// Missing or unknown values give the current edition.
export function parseEditionSelection(
  values: readonly string[],
  current: EditionYear = CURRENT_EDITION_YEAR,
): EditionSelection {
  const parts = values.flatMap((v) => v.split(','));
  if (parts.includes('all')) return [];
  const years = new Set(
    parts
      .map(parseEditionParam)
      .filter((y): y is EditionYear => y !== null),
  );
  if (years.size === 0) return [current];
  // registry order, so the same tabs always give the same URL
  return EDITION_YEARS.filter((y) => years.has(y));
}

export function serializeEditionSelection(selection: EditionSelection): string {
  return selection.length === 0 ? 'all' : selection.join(',');
}

export function toggleEdition(
  selection: EditionSelection,
  year: EditionYear,
): EditionSelection {
  const next = new Set(selection);
  if (next.has(year)) next.delete(year);
  else next.add(year);
  return EDITION_YEARS.filter((y) => next.has(y));
}

export type ArtistsHeading =
  | { kind: 'edition'; year: EditionYear }
  | { kind: 'past' }
  | { kind: 'all' };

export function artistsHeading(
  selection: EditionSelection,
  now: Date,
): ArtistsHeading {
  if (selection.length !== 1) return { kind: 'all' };
  const year = selection[0];
  return isEditionOver(EDITIONS[year], now)
    ? { kind: 'past' }
    : { kind: 'edition', year };
}

// Where "Retour" goes when there is no page of ours to go back to.
export function artistBackHref(
  locale: string,
  artistEditions: readonly EditionYear[],
  current: EditionYear = CURRENT_EDITION_YEAR,
): string {
  const latest = EDITION_YEARS.filter((y) => artistEditions.includes(y)).pop();
  const year = artistEditions.includes(current) ? current : latest ?? current;
  return `/${locale}/community?edition=${year}`;
}
