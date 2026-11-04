export const DUPLICATE_ARTIST_MESSAGE =
  "Un artiste porte déjà ce nom. Modifiez la fiche existante plutôt que d'en créer une nouvelle.";

// tsconfig targets es5, which refuses the "u" flag on literals; Node runs it fine
const MARKS = new RegExp('\\p{M}', 'gu');
const NOT_LETTER_DIGIT_SPACE = new RegExp('[^\\p{L}\\p{N}\\s]', 'gu');

// lowercase, no accents or other marks, punctuation turned into spaces, spaces collapsed
export const normalizeArtistName = (name: string) =>
  name
    .normalize('NFD')
    .replace(MARKS, '')
    .toLowerCase()
    .replace(NOT_LETTER_DIGIT_SPACE, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// the other artist with the same normalised name, if any
export const findDuplicateArtist = <T extends { _id: unknown; frenchName: string }>(
  name: string,
  artists: T[],
  excludeId?: string,
) => {
  const target = normalizeArtistName(name);
  if (!target) return undefined;
  return artists.find(
    (artist) =>
      String(artist._id) !== excludeId &&
      normalizeArtistName(artist.frenchName) === target,
  );
};
