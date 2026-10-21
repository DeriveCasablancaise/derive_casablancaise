'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '../database';
import Ar2d, { IAr2d } from '../database/models/ar2d.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { parseInput } from '../parse-input';
import { sanitizeFields } from '../sanitize';
import { ar2dFormSchema } from '../validator';

export interface UpdateAr2dParams {
  ar2d: Partial<IAr2d> & { _id?: string };
}

const DEFAULTS = {
  text1Fr: '<p>Titre Français</p>',
  text1Ar: '<p>العنوان العربي</p>',

  text2Fr: '<p>Titre Français</p>',
  text2Ar: '<p>العنوان العربي</p>',

  text3Fr: '<p>Titre Français</p>',
  text3Ar: '<p>العنوان العربي</p>',
  video1Thumbnail: '/images/thumbTeaser.jpg',
  video1IframeLink: 'https://www.youtube.com/watch?v=chv70l147CE',
  video1TitleFr: 'Aftermovie Dérive Casablancaise 2024',
  video1TitleAr: 'إعلان دعائي لـلمنعطف البيضاوي 2024',
  video2Thumbnail: '/images/thumbTeaser.jpg',
  video2IframeLink: 'https://www.youtube.com/watch?v=chv70l147CE',
  video2TitleFr: 'Aftermovie Dérive Casablancaise 2024',
  video2TitleAr: 'إعلان دعائي لـلمنعطف البيضاوي 2024',
  video3Thumbnail: '/images/thumbTeaser.jpg',
  video3IframeLink: 'https://www.youtube.com/watch?v=chv70l147CE',
  video3TitleFr: 'Titre Vidéo 3',
  video3TitleAr: 'عنوان الفيديو 3',
  backgroundImage: '/desc-bg.png',
};

// Get derive 2024 data
export async function getAr2dData() {
  try {
    await connectToDatabase();

    const doc = await Ar2d.findOne();

    // no write on public reads, defaults stay in memory
    if (!doc) return { ...DEFAULTS };

    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error getting derive ar2d data:', error);
    handleError(error);
  }
}

// Update ar2d
export async function updateAr2d({ ar2d }: UpdateAr2dParams) {
  await requireAdmin();

  // _id is ignored, the singleton is found with findOne
  const { _id, ...input } = ar2d;
  const data = parseInput(
    ar2dFormSchema,
    sanitizeFields(input, [
      'text1Fr',
      'text1Ar',
      'text2Fr',
      'text2Ar',
      'text3Fr',
      'text3Ar',
    ]),
  );

  try {
    await connectToDatabase();

    let doc = await Ar2d.findOne();

    // If no document exists, create one
    if (!doc) {
      doc = await Ar2d.create(data);
    } else {
      doc = await Ar2d.findByIdAndUpdate(doc._id, data, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error updating ar2d:', error);
    handleError(error);
  }
}
