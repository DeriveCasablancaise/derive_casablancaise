'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { CreateArtistParams, UpdateArtistParams } from '@/types';
import { connectToDatabase } from '../database';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';
import Artist from '../database/models/artist.model';
import { parseInput } from '../parse-input';
import { artistFormSchema } from '../validator';
import { buildArtistEditionsFilter } from '../artist-editions';
import type { EditionYear } from '@/constants/editions';

// Populate post
const populatePost = async (query: any) => {
  return query;
};

// Create Post
export async function createArtist(artist: CreateArtistParams) {
  await requireAdmin();

  // texts are plain text (Textarea) and rendered escaped, so no sanitizeHtml
  const data = parseInput(artistFormSchema, artist);

  try {
    await connectToDatabase();

    const newArtist = await Artist.create(data);

    return JSON.parse(JSON.stringify(newArtist));
  } catch (error) {
    handleError(error);
  }
}

// Update Post
export async function updateArtist({ artist }: UpdateArtistParams) {
  await requireAdmin();

  const { _id, ...input } = artist;
  if (!Types.ObjectId.isValid(_id)) throw new Error('Invalid data');
  const data = parseInput(artistFormSchema, input);

  try {
    await connectToDatabase();

    const artistToUpdate = await Artist.findById(_id);

    if (!artistToUpdate) {
      throw new Error('Artist Not Found!');
    }

    const updatedArtist = await Artist.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });

    revalidatePath('/darja-admin/posts');
    return JSON.parse(JSON.stringify(updatedArtist));
  } catch (error) {
    console.error('Error updating the artist', error);
    handleError(error);
  }
}

// Delete post
export async function deleteArtist(artistId: string) {
  await requireAdmin();

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
// No years means every artist. One query, so an artist in two years shows once.
export async function getAllArtists(years?: EditionYear[]) {
  try {
    await connectToDatabase();

    const artistsQuery = Artist.find(buildArtistEditionsFilter(years)).sort({
      createdAt: 'desc',
    });

    const artists = await populatePost(artistsQuery);

    return JSON.parse(JSON.stringify(artists));
  } catch (error) {
    console.error('Error Getting All Artists', error);
    handleError(error);
  }
}

// Artists sharing at least one edition with the given ones
export async function getRelatedArtists({
  editions,
  artistId,
}: {
  editions: EditionYear[];
  artistId: string;
}) {
  // no editions would otherwise mean "every artist"
  if (editions.length === 0) return [];

  try {
    await connectToDatabase();

    const conditions = {
      $and: [
        buildArtistEditionsFilter(editions),
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
  await requireAdmin();

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
