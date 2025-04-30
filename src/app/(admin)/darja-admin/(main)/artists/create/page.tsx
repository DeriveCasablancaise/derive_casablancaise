import ArtistForm from '@/components/dashboard/artists/ArtistForm';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const page = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Créer un nouvel artiste" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ArtistForm type="Create" />
      </main>
    </div>
  );
};

export default page;
