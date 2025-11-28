import * as z from 'zod';

export const postFormSchema = z.object({
  frenchTitle: z
    .string()
    .min(3, 'Le titre doit consister de 3 caractères ou plus.'),
  arabicTitle: z.string().optional(),
  frenchText: z
    .string()
    .min(3, 'Le texte doit consister de 3 caractères ou plus.'),
  arabicText: z.string().optional(),
  images: z.array(z.string()).default([]),
  thumbnailImage: z.string().optional(),
  videoSource: z.string().optional(),
  postCategory: z.enum(
    [
      'danse',
      'musique',
      'theatre',
      'lectures',
      'cinema',
      'conference',
      'ateliers',
      'autres',
    ],
    {
      message: 'Veuillez Choisir Une Catégorie',
    }
  ),
  subCategory: z.enum(['rencontres', 'expositions', 'productions']).optional(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  location: z.string().min(3, "Veuillez rentrer le lieu de l'événement. "),
  url: z.string().optional(),
  artists: z.array(z.string()).default([]),
});

export const artistFormSchema = z.object({
  frenchName: z
    .string()
    .min(3, 'Le nom doit consister de 3 caractères ou plus.'),
  arabicName: z
    .string()
    .min(3, 'Le nom doit consister de 3 caractères ou plus.'),
  frenchText: z
    .string()
    .min(3, 'Le texte doit consister de 3 caractères ou plus.'),
  arabicText: z
    .string()
    .min(3, 'Le texte doit consister de 3 caractères ou plus.'),
  images: z.array(z.string()).default([]),
  videoSource: z.string().optional(),
  artistCategory: z.enum(['2022', '2024'], {
    message: 'Veuillez Choisir Une Catégorie',
  }),
  isInHomepage: z.boolean(),
  url: z.string().optional(),
});

export const homepageFormSchema = z.object({
  textFr: z.string().min(1, 'French subtitle is required'),
  textAr: z.string().optional(),

  video1Thumbnail: z.string().min(1, 'Video 1 thumbnail is required'),
  video1IframeLink: z.string().min(1, 'Video 1 iframe link is required'),
  video1TitleFr: z.string().min(1, 'Video 1 French title is required'),
  video1TitleAr: z.string().optional(),

  video2Thumbnail: z.string().min(1, 'Video 2 thumbnail is required'),
  video2IframeLink: z.string().min(1, 'Video 2 iframe link is required'),
  video2TitleFr: z.string().min(1, 'Video 2 French title is required'),
  video2TitleAr: z.string().optional(),

  backgroundImage: z.string().min(1, 'Background image is required'),
});

export const derive2024FormSchema = z.object({
  text1Fr: z.string().min(1, 'French subtitle is required'),
  text1Ar: z.string().optional(),

  text2Fr: z.string().min(1, 'French subtitle is required'),
  text2Ar: z.string().optional(),

  text3Fr: z.string().min(1, 'French subtitle is required'),
  text3Ar: z.string().optional(),

  video1Thumbnail: z.string().min(1, 'Video 1 thumbnail is required'),
  video1IframeLink: z.string().min(1, 'Video 1 iframe link is required'),
  video1TitleFr: z.string().min(1, 'Video 1 French title is required'),
  video1TitleAr: z.string().optional(),

  video2Thumbnail: z.string().min(1, 'Video 2 thumbnail is required'),
  video2IframeLink: z.string().min(1, 'Video 2 iframe link is required'),
  video2TitleFr: z.string().min(1, 'Video 2 French title is required'),
  video2TitleAr: z.string().optional(),

  backgroundImage: z.string().min(1, 'Background image is required'),
});

export const partnerFormSchema = z.object({
  frenchName: z
    .string()
    .min(1, 'French name is required')
    .min(2, 'French name must be at least 2 characters'),
  arabicName: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, {
      message: 'Arabic name must be at least 2 characters if provided',
    }),
  hrefLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  yearOfPartnership: z.enum(['2022', '2024']),
  logoImage: z.string().min(1, 'Logo image is required'),
});
