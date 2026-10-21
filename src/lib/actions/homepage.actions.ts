'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '../database';
import Homepage, { IHomepage } from '../database/models/homepage.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { parseInput } from '../parse-input';
import { sanitizeFields } from '../sanitize';
import { homepageFormSchema } from '../validator';

export interface UpdateHomepageParams {
  homepage: Partial<IHomepage> & { _id?: string };
}

const DEFAULTS = {
  textFr: '<p>Titre Français</p>',
  textAr: '<p>العنوان العربي</p>',
  frenchSubtitle2: 'Titre Français 2',
  arabicSubtitle2: 'العنوان العربي 2',
  frenchSubtitle3: 'Titre Français 3',
  arabicSubtitle3: 'العنوان العربي 3',
  video1Thumbnail: '/images/thumbTeaser.jpg',
  video1IframeLink: '',
  video1TitleFr: 'Aftermovie Dérive Casablancaise 2024',
  video1TitleAr: 'إعلان دعائي لـلمنعطف البيضاوي 2024',
  video2Thumbnail: '/images/thumbTeaser.jpg',
  video2IframeLink: '',
  video2TitleFr: 'Aftermovie Dérive Casablancaise 2024',
  video2TitleAr: 'إعلان دعائي لـلمنعطف البيضاوي 2024',
  backgroundImage: '/desc-bg.png',
};

// Get homepage data
export async function getHomepageData() {
  try {
    await connectToDatabase();

    const doc = await Homepage.findOne();

    // no write on public reads, defaults stay in memory
    if (!doc) return { ...DEFAULTS };

    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error getting homepage data:', error);
    handleError(error);
  }
}

// Update homepage
export async function updateHomepage({ homepage }: UpdateHomepageParams) {
  await requireAdmin();

  // _id is ignored, the singleton is found with findOne
  const { _id, ...input } = homepage;
  const data = parseInput(
    homepageFormSchema,
    sanitizeFields(input, ['textFr', 'textAr']),
  );

  try {
    await connectToDatabase();

    let doc = await Homepage.findOne();

    // If no document exists, create one
    if (!doc) {
      doc = await Homepage.create(data);
    } else {
      doc = await Homepage.findByIdAndUpdate(doc._id, data, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error updating homepage:', error);
    handleError(error);
  }
}
