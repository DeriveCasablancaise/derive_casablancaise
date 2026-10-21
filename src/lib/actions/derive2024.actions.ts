'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '../database';
import Derive2024, { IDerive2024 } from '../database/models/derive2024.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { parseInput } from '../parse-input';
import { sanitizeFields } from '../sanitize';
import { derive2024FormSchema } from '../validator';

export interface UpdateDerive2024Params {
  derive2024: Partial<IDerive2024> & { _id?: string };
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
  backgroundImage: '/desc-bg.png',
};

// Get derive 2024 data
export async function getDerive2024Data() {
  try {
    await connectToDatabase();

    const doc = await Derive2024.findOne();

    // no write on public reads, defaults stay in memory
    if (!doc) return { ...DEFAULTS };

    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error getting derive 2024 data:', error);
    handleError(error);
  }
}

// Update derive2024
export async function updateDerive2024({ derive2024 }: UpdateDerive2024Params) {
  await requireAdmin();

  // _id is ignored, the singleton is found with findOne
  const { _id, ...input } = derive2024;
  const data = parseInput(
    derive2024FormSchema,
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

    let doc = await Derive2024.findOne();

    // If no document exists, create one
    if (!doc) {
      doc = await Derive2024.create(data);
    } else {
      doc = await Derive2024.findByIdAndUpdate(doc._id, data, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error updating derive2024:', error);
    handleError(error);
  }
}
