'use client';

import React from 'react';
import StatCard from '../shared/StatsCard';
import { BookUser, HandCoins, Headphones, NewspaperIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import PostsTable from './posts/PostsTable';
import ArtistsTable from './artists/ArtistsTable';

interface StatsProps {
  artistCounts: number | string;
  postCounts: number | string;
}

const MainPageStatsCards = ({ artistCounts, postCounts }: StatsProps) => {
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      {/* STATS */}
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <StatCard
          name="Nombre de postes"
          icon={NewspaperIcon}
          value={postCounts}
          color="#8B5CF6"
        />
        <StatCard
          name="Nombre d'artistes"
          icon={Headphones}
          value={artistCounts}
          color="#6EE7B7"
        />
        <StatCard
          name="Partenaires Financiers"
          icon={HandCoins}
          value="12"
          color="#EC4899"
        />
        <StatCard
          name="Partenaires culturels"
          icon={BookUser}
          value="17"
          color="#EC4899"
        />
      </motion.div>

      {/* CHARTS */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full flex flex-col gap-8"
      >
        <PostsTable currentUserIsAdmin={false} />
        <ArtistsTable currentUserIsAdmin={false} />
      </motion.div>
    </main>
  );
};

export default MainPageStatsCards;
