'use server';

import { connectToDatabase } from '../database';
import Ar2d, { IAr2d } from '../database/models/ar2d.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

export interface UpdateAr2dParams {
  ar2d: Partial<IAr2d> & { _id?: string };
}

// Get or create derive 2024 data
export async function getAr2dData() {
  try {
    await connectToDatabase();

    let ar2d = await Ar2d.findOne();

    // If no homepage data exists, create default one
    if (!ar2d) {
      ar2d = await Ar2d.create({
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
      });
    }

    return JSON.parse(JSON.stringify(ar2d));
  } catch (error) {
    console.error('Error getting derive ar2d data:', error);
    handleError(error);
  }
}

// Update Homepage
export async function updateAr2d({ ar2d }: UpdateAr2dParams) {
  try {
    await connectToDatabase();

    let ar2dDoc = await Ar2d.findOne();

    // If no document exists, create one
    if (!ar2dDoc) {
      ar2dDoc = await Ar2d.create(ar2d);
    } else {
      // Update existing document
      ar2dDoc = await Ar2d.findByIdAndUpdate(ar2dDoc._id, ar2d, { new: true });
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(ar2dDoc));
  } catch (error) {
    console.error('Error updating ar2d:', error);
    handleError(error);
  }
}
