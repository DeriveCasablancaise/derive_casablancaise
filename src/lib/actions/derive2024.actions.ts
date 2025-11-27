'use server';

import { connectToDatabase } from '../database';
import Derive2024, { IDerive2024 } from '../database/models/derive2024.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

export interface UpdateDerive2024Params {
  derive2024: Partial<IDerive2024> & { _id?: string };
}

// Get or create derive 2024 data
export async function getDerive2024Data() {
  try {
    await connectToDatabase();

    let derive2024 = await Derive2024.findOne();

    // If no homepage data exists, create default one
    if (!derive2024) {
      derive2024 = await Derive2024.create({
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

    return JSON.parse(JSON.stringify(derive2024));
  } catch (error) {
    console.error('Error getting derive 2024 data:', error);
    handleError(error);
  }
}

// Update Homepage
export async function updateDerive2024({ derive2024 }: UpdateDerive2024Params) {
  try {
    await connectToDatabase();

    let derive2024Doc = await Derive2024.findOne();

    // If no document exists, create one
    if (!derive2024Doc) {
      derive2024Doc = await Derive2024.create(derive2024);
    } else {
      // Update existing document
      derive2024Doc = await Derive2024.findByIdAndUpdate(
        derive2024Doc._id,
        derive2024,
        { new: true }
      );
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(derive2024Doc));
  } catch (error) {
    console.error('Error updating homepage:', error);
    handleError(error);
  }
}
