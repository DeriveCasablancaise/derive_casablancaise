'use server';

import { CreateArtistParams, UpdateArtistParams } from '@/types';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';
import Artist from '../database/models/artist.model';

const validCategories = ['2022', '2024', '2026'] as const;

type ValidCategory = (typeof validCategories)[number];

// Populate post
const populatePost = async (query: any) => {
  return query;
};

// Create Post
export async function createArtist(artist: CreateArtistParams) {
  try {
    await connectToDatabase();

    const newArtist = await Artist.create({
      ...artist,
      artistCategory: artist.artistCategory,
      images: artist.images,
    });

    return JSON.parse(JSON.stringify(newArtist));
  } catch (error) {
    handleError(error);
  }
}

// Update Post
export async function updateArtist({ artist }: UpdateArtistParams) {
  try {
    await connectToDatabase();

    const artistToUpdate = await Artist.findById(artist._id);

    if (!artistToUpdate) {
      throw new Error('Artist Not Found!');
    }

    const updatedArtist = await Artist.findByIdAndUpdate(
      artist._id,
      {
        ...artist,
        artistCategory: artist.artistCategory,
        images: artist.images,
      },
      { new: true }
    );

    revalidatePath('/darja-admin/posts');
    return JSON.parse(JSON.stringify(updatedArtist));
  } catch (error) {
    console.error('Error updating the artist', error);
    handleError(error);
  }
}

// Delete post
export async function deleteArtist(artistId: string) {
  try {
    await connectToDatabase();

    const deletedArtist = await Artist.findByIdAndDelete(artistId);

    if (deletedArtist) revalidatePath('/darja-admin/artists');
  } catch (error) {
    console.error('Error deleting artist', error);
    handleError(error);
  }
}

// Get Artist By Id
export async function getArtistById(artistId: string) {
  try {
    await connectToDatabase();

    const artist = await Artist.findById(new Types.ObjectId(artistId));

    if (!artist) throw new Error('Error getting artist by its Id');

    return JSON.parse(JSON.stringify(artist));
  } catch (error) {
    console.error('Error fetching the post', error);
    handleError(error);
  }
}

// Get All Artists
export async function getAllArtists(category?: ValidCategory) {
  try {
    await connectToDatabase();

    const condition = category ? { artistCategory: category } : {};

    const artistsQuery = Artist.find(condition).sort({ createdAt: 'desc' });

    const artists = await populatePost(artistsQuery);

    return JSON.parse(JSON.stringify(artists));
  } catch (error) {
    console.error('Error Getting All Artists', error);
    handleError(error);
  }
}

// Get Related Posts
export async function getRelatedArtists({
  artistCategory,
  artistId,
}: {
  artistCategory: string;
  artistId: string;
}) {
  try {
    await connectToDatabase();

    const conditions = {
      $and: [
        { artistCategory },
        { _id: { $ne: new Types.ObjectId(artistId) } },
      ],
    };

    const artistsQuery = Artist.find(conditions)
      .sort({ createdAt: 'desc' })
      .limit(3); // Limit to 3 related artists

    const artists = await populatePost(artistsQuery);

    return JSON.parse(JSON.stringify(artists));
  } catch (error) {
    console.error('Error Getting Related Artists', error);
    handleError(error);
  }
}

export async function getArtistsCounts() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all artists and artist categories
    const artists = await Artist.find();

    // Return the total counts for both
    return {
      totalArtists: artists.length, // Total artist count
      totalArtistCategories: 2, // Total artist categories count
    };
  } catch (error) {
    console.error('Failed to fetch artist statistics:', error);
    handleError(error);
    throw new Error('Failed to fetch artist statistics');
  }
}

export async function getHomepageArtists() {
  try {
    await connectToDatabase();

    // Find posts where isInHomepage is true
    const artistsQuery = Artist.find({ isInHomepage: true }).sort({
      createdAt: 'desc',
    });

    const artists = await populatePost(artistsQuery); // Populating postCategory if needed

    return JSON.parse(JSON.stringify(artists));
  } catch (error) {
    console.error('Error fetching homepage posts:', error);
    handleError(error);
  }
}
