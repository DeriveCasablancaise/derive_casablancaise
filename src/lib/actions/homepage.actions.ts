'use server';

import { connectToDatabase } from '../database';
import Homepage, { IHomepage } from '../database/models/homepage.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';

export interface UpdateHomepageParams {
  homepage: Partial<IHomepage> & { _id?: string };
}

// Get or create homepage data
export async function getHomepageData() {
  try {
    await connectToDatabase();

    let homepage = await Homepage.findOne();

    // If no homepage data exists, create default one
    if (!homepage) {
      homepage = await Homepage.create({
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
      });
    }

    return JSON.parse(JSON.stringify(homepage));
  } catch (error) {
    console.error('Error getting homepage data:', error);
    handleError(error);
  }
}

// Update Homepage
export async function updateHomepage({ homepage }: UpdateHomepageParams) {
  try {
    await connectToDatabase();

    let homepageDoc = await Homepage.findOne();

    // If no document exists, create one
    if (!homepageDoc) {
      homepageDoc = await Homepage.create(homepage);
    } else {
      // Update existing document
      homepageDoc = await Homepage.findByIdAndUpdate(
        homepageDoc._id,
        homepage,
        { new: true }
      );
    }

    revalidatePath('/');
    return JSON.parse(JSON.stringify(homepageDoc));
  } catch (error) {
    console.error('Error updating homepage:', error);
    handleError(error);
  }
}
