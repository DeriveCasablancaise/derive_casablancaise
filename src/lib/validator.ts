import * as z from 'zod';
import {
  CATEGORY_KEYS,
  isEditionCategory,
  isEditionYear,
  type EditionYear,
} from '@/constants/editions';
import { isSafeBannerUrl } from '@/lib/banner';

export const postFormSchema = z
  .object({
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
    postCategory: z.enum(CATEGORY_KEYS, {
      message: 'Veuillez Choisir Une Catégorie',
    }),
    subCategory: z.enum(['rencontres', 'expositions', 'productions']).optional(),
    yearOfEdition: z.custom<EditionYear>(isEditionYear, {
      message: "Veuillez choisir l'année d'édition",
    }),
    startDateTime: z.date().optional(),
    endDateTime: z.date().optional(),
    location: z.string().min(3, "Veuillez rentrer le lieu de l'événement. "),
    locationAr: z.string().optional(),
    url: z.string().optional(),
    artists: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    // a post stays in a category of its own edition
    if (!isEditionCategory(data.yearOfEdition, data.postCategory)) {
      ctx.addIssue({
        code: 'custom',
        path: ['postCategory'],
        message: "Cette catégorie n'existe pas pour cette édition",
      });
    }
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
  editions: z
    .array(z.custom<EditionYear>(isEditionYear))
    .min(1, 'Veuillez choisir au moins une édition'),
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

  carouselImages: z.array(z.string()).optional(),

  backgroundImage: z.string().min(1, 'Background image is required'),
});

// plain text only: markup is rejected, React escapes it on render anyway
const plainText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maximum ${max} caractères`)
    .refine((v) => !/[<>]/.test(v), 'Texte simple uniquement, sans HTML');

// same fields as 2024 but nothing is required, an empty page is valid
export const derive2026FormSchema = z
  .object({
    text1Fr: z.string().optional(),
    text1Ar: z.string().optional(),
    text2Fr: z.string().optional(),
    text2Ar: z.string().optional(),
    text3Fr: z.string().optional(),
    text3Ar: z.string().optional(),

    video1Thumbnail: z.string().optional(),
    video1IframeLink: z.string().optional(),
    video1TitleFr: z.string().optional(),
    video1TitleAr: z.string().optional(),

    video2Thumbnail: z.string().optional(),
    video2IframeLink: z.string().optional(),
    video2TitleFr: z.string().optional(),
    video2TitleAr: z.string().optional(),

    backgroundImage: z.string().optional(),

    videosHeadingFr: plainText(80).optional(),
    videosHeadingAr: plainText(80).optional(),
  })
  .superRefine((data, ctx) => {
    // a video needs its link and its thumbnail together
    for (const n of [1, 2] as const) {
      const link = data[`video${n}IframeLink`];
      const thumb = data[`video${n}Thumbnail`];
      if (!link !== !thumb) {
        ctx.addIssue({
          code: 'custom',
          path: [link ? `video${n}Thumbnail` : `video${n}IframeLink`],
          message: `Video ${n} needs both a link and a thumbnail`,
        });
      }
    }
  });

// https://, http:// or a site path, "//host" would leave the site so it is out
const bannerUrl = z
  .string()
  .trim()
  .max(500, 'Maximum 500 caractères')
  .refine(
    (v) => v === '' || isSafeBannerUrl(v),
    'Lien invalide : https://, http:// ou un chemin commençant par /',
  );

export const bannerFormSchema = z
  .object({
    isActive: z.boolean(),
    textFr: plainText(200),
    textAr: plainText(200).optional(),
    linkUrl: bannerUrl.optional(),
    linkLabelFr: plainText(60).optional(),
    linkLabelAr: plainText(60).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.linkUrl && !data.linkLabelFr) {
      ctx.addIssue({
        code: 'custom',
        path: ['linkLabelFr'],
        message: 'Le texte du lien est requis quand un lien est renseigné',
      });
    }
    if (data.isActive && !data.textFr) {
      ctx.addIssue({
        code: 'custom',
        path: ['textFr'],
        message: 'Le texte français est requis pour afficher la bannière',
      });
    }
  });

export const ar2dFormSchema = z.object({
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

  video3Thumbnail: z.string().min(1, 'Video 3 thumbnail is required'),
  video3IframeLink: z.string().min(1, 'Video 3 iframe link is required'),
  video3TitleFr: z.string().min(1, 'Video 3 French title is required'),
  video3TitleAr: z.string().optional(),

  carouselImages: z.array(z.string()).optional(),

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
  editions: z
    .array(z.custom<EditionYear>(isEditionYear))
    .min(1, 'Veuillez choisir au moins une édition'),
  logoImage: z.string().min(1, 'Logo image is required'),
});
