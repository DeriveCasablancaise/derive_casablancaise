import { EDITIONS, isEditionYear, type EditionYear } from '@/constants/editions';

export const EDITION_YEARS = Object.keys(EDITIONS) as EditionYear[];

// Anything that can carry the old or the new shape, so it also fits plain JSON.
export type ArtistEditionSource = {
  editions?: readonly string[] | null;
  // Deprecated, only read here and in the migration script.
  artistCategory?: string | null;
};

// Editions of an artist, whether or not the migration has run yet.
export function getArtistEditions(artist: ArtistEditionSource): EditionYear[] {
  const editions = (artist.editions ?? []).filter(isEditionYear);
  if (editions.length > 0) return editions;

  const legacy = artist.artistCategory;
  if (legacy === 'all') return [...EDITION_YEARS];
  if (isEditionYear(legacy)) return [legacy];
  return [];
}

// Mongo filter for "artist belongs to at least one of these years".
// Migrated documents match on editions, the others on the old single value.
export function buildArtistEditionsFilter(years: readonly string[] = []) {
  if (years.length === 0) return {};

  const valid = years.filter(isEditionYear);
  // only unknown years were asked for, so match nothing
  if (valid.length === 0) return { _id: { $in: [] } };

  return {
    $or: [
      { editions: { $in: valid } },
      {
        // missing or empty editions means not migrated yet
        'editions.0': { $exists: false },
        artistCategory: { $in: [...valid, 'all'] },
      },
    ],
  };
}
