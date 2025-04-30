import ArtistForm from '@/components/dashboard/artists/ArtistForm';
import Navbar from '@/components/shared/Navbar';
import { getArtistById } from '@/lib/actions/artists.actions';
import React from 'react';

type UpdateArtistProps = {
  params: {
    artistId: string;
  };
};

const page = async ({ params: { artistId } }: UpdateArtistProps) => {
  const artist = await getArtistById(artistId);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier cet artiste" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ArtistForm type="Update" artist={artist} artistId={artist._id} />
      </main>
    </div>
  );
};

export default page;
