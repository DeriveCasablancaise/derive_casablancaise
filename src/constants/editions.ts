export type EditionYear = '2022' | '2024' | '2026';

export const CATEGORIES = {
  danse: { fr: 'Danse', ar: 'رقص' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  musique: { fr: 'Musique', ar: 'حفلة موسيقية' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  conference: { fr: 'Conférences', ar: 'مؤتمر' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
  autres: { fr: 'En Marge...', ar: 'أخرى' },
  // 2026 labels, as written in the organisers' programme
  exposition: { fr: 'Exposition', ar: 'معرض' },
  concert: { fr: 'Concert', ar: 'حفل موسيقي' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// same keys as CATEGORIES, as the non-empty tuple z.enum and mongoose expect
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as [
  CategoryKey,
  ...CategoryKey[],
];

export const isCategoryKey = (x: string): x is CategoryKey =>
  Object.keys(CATEGORIES).includes(x);

export interface Edition {
  year: EditionYear;
  routeBase: 'derive-2024' | 'previous' | 'derive-2026';
  translationNamespace: string | undefined;
  programmePdf: string | undefined;
  // key order is the tile order
  categories: readonly CategoryKey[];
  categoryImages: Partial<Record<CategoryKey, string>> | undefined;
}

export const EDITIONS: Record<EditionYear, Edition> = {
  '2022': {
    year: '2022',
    routeBase: 'previous',
    translationNamespace: 'Derive2022',
    programmePdf: '/programme2022.pdf',
    categories: [
      'danse',
      'theatre',
      'musique',
      'lectures',
      'cinema',
      'conference',
      'ateliers',
      'autres',
    ],
    categoryImages: {
      danse: '/assets/categories/2022/danse.jpg',
      theatre: '/assets/categories/2022/theatre.jpg',
      musique: '/assets/categories/2022/musique.jpg',
      lectures: '/assets/categories/2022/lectures.png',
      cinema: '/assets/categories/2022/cinema.jpeg',
      conference: '/assets/categories/2022/rencontres.png',
      ateliers: '/assets/categories/2022/ateliers.jpg',
      autres: '/assets/categories/2022/en-marge.jpg',
    },
  },
  '2024': {
    year: '2024',
    routeBase: 'derive-2024',
    translationNamespace: 'Derive2024',
    programmePdf: '/programme.pdf',
    categories: [
      'danse',
      'theatre',
      'musique',
      'lectures',
      'cinema',
      'conference',
      'ateliers',
      'autres',
    ],
    categoryImages: {
      danse: '/assets/categories/danse.jpg',
      theatre: '/assets/categories/theatre.jpg',
      musique: '/assets/categories/musique.jpg',
      lectures: '/assets/categories/lectures.jpeg',
      cinema: '/assets/categories/cinema.jpg',
      conference: '/assets/categories/conférences.jpg',
      ateliers: '/assets/categories/ateliers.jpg',
      autres: '/assets/categories/en-marge.jpeg',
    },
  },
  // 2026 has no assets or texts yet
  '2026': {
    year: '2026',
    routeBase: 'derive-2026',
    translationNamespace: undefined,
    programmePdf: undefined,
    // the labels of the programme grid, in the order they first appear
    categories: ['danse', 'lectures', 'cinema', 'exposition', 'theatre', 'concert'],
    categoryImages: undefined,
  },
};

export const EDITION_YEARS = Object.keys(EDITIONS) as EditionYear[];

export const isEditionYear =(x: unknown): x is EditionYear =>
  typeof x === 'string' && Object.prototype.hasOwnProperty.call(EDITIONS, x);

export const getEdition = (year: EditionYear): Edition => EDITIONS[year];

// Paths have no locale prefix, callers add `/${locale}` as before.
export const editionHref = (year: EditionYear) =>
  `/${EDITIONS[year].routeBase}`;

export const isEditionCategory = (year: EditionYear, x: string): x is CategoryKey =>
  (EDITIONS[year].categories as readonly string[]).includes(x);

export const categoryHref = (year: EditionYear, categoryId: string) =>
  `${editionHref(year)}/${categoryId}`;

export const postHref = (year: EditionYear, postId: string) =>
  `${editionHref(year)}/post/${postId}`;
