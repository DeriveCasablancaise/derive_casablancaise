'use server';

import { connectToDatabase } from '../database';
import Derive2022, { IDerive2022 } from '../database/models/derive2022.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

export interface UpdateDerive2022Params {
  derive2022: Partial<IDerive2022> & { _id?: string };
}

// Get or create derive 2024 data
export async function getDerive2022Data() {
  try {
    await connectToDatabase();

    let derive2022 = await Derive2022.findOne();

    // If no homepage data exists, create default one
    if (!derive2022) {
      derive2022 = await Derive2022.create({
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

    return JSON.parse(JSON.stringify(derive2022));
  } catch (error) {
    console.error('Error getting derive 2022 data:', error);
    handleError(error);
  }
}

// Update Homepage
export async function updateDerive2022({ derive2022 }: UpdateDerive2022Params) {
  try {
    await connectToDatabase();

    let derive2022Doc = await Derive2022.findOne();

    // If no document exists, create one
    if (!derive2022Doc) {
      derive2022Doc = await Derive2022.create(derive2022);
    } else {
      // Update existing document
      derive2022Doc = await Derive2022.findByIdAndUpdate(
        derive2022Doc._id,
        derive2022,
        { new: true }
      );
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(derive2022Doc));
  } catch (error) {
    console.error('Error updating homepage:', error);
    handleError(error);
  }
}
