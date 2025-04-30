'use client';

import React from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import StatCard from '../shared/StatsCard';
import { Headphones, SwatchBook } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Link from 'next/link';
import ArtistsTable from './artists/ArtistsTable';

interface ArtistStats {
  totalArtists: number | string;
  totalArtistCategories: number | string;
}

const AristsPage = ({
  artistStats,
  isAdmin,
}: {
  artistStats: ArtistStats;
  isAdmin: boolean;
}) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Gérer les artistes" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Nombre d'artiste"
            icon={Headphones}
            value={artistStats.totalArtists}
            color="#8B5CF6"
          />
          <StatCard
            name="Nombre de Catégories"
            icon={SwatchBook}
            value={artistStats.totalArtistCategories}
            color="#6EE7B7"
          />
        </motion.div>

        <ArtistsTable currentUserIsAdmin={isAdmin} />

        {isAdmin && (
          <Button
            asChild
            className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
            variant="outline"
          >
            <Link href="/darja-admin/artists/create">
              Créer un nouvel artiste
            </Link>
          </Button>
        )}
      </main>
    </div>
  );
};

export default AristsPage;
