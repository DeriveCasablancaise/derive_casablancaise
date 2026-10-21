import { isEditionYear, type EditionYear } from '@/constants/editions';

// Anything that can carry the old or the new shape, so it also fits plain JSON.
export type PartnerEditionSource = {
  editions?: readonly string[] | null;
  // Deprecated, only read here, in the model and in the migration script.
  yearOfPartnership?: string | null;
};

// The old enum only knew these years, 'both' meant these two (never 2026).
const LEGACY_YEARS: EditionYear[] = ['2022', '2024'];
const LEGACY_BOTH = 'both';

// Editions of a partner, whether or not the migration has run yet.
export function getPartnerEditions(
  partner: PartnerEditionSource,
): EditionYear[] {
  const editions = (partner.editions ?? []).filter(isEditionYear);
  if (editions.length > 0) return editions;

  const legacy = partner.yearOfPartnership;
  if (legacy === LEGACY_BOTH) return [...LEGACY_YEARS];
  if (isEditionYear(legacy)) return [legacy];
  return [];
}

// Mongo filter for "partner belongs to at least one of these years".
// Migrated documents match on editions, the others on the old single value.
export function buildPartnerEditionsFilter(years: readonly string[] = []) {
  if (years.length === 0) return {};

  const valid = years.filter(isEditionYear);
  // only unknown years were asked for, so match nothing
  if (valid.length === 0) return { _id: { $in: [] } };

  const legacyValues: string[] = valid.filter((y) =>
    LEGACY_YEARS.includes(y),
  );
  if (legacyValues.length > 0) legacyValues.push(LEGACY_BOTH);

  const migrated = { editions: { $in: valid } };
  // nothing in the old enum can match this year (2026)
  if (legacyValues.length === 0) return migrated;

  return {
    $or: [
      migrated,
      {
        // missing or empty editions means not migrated yet
        'editions.0': { $exists: false },
        yearOfPartnership: { $in: legacyValues },
      },
    ],
  };
}
