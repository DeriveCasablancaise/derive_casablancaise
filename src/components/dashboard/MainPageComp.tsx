'use client';

import React from 'react';
import StatCard from '../shared/StatsCard';
import {
  BookUser,
  HandCoins,
  Handshake,
  Headphones,
  NewspaperIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import PostsTable from './posts/PostsTable';
import ArtistsTable from './artists/ArtistsTable';
import { AdminButton } from './admin-ui';
import Link from 'next/link';

interface StatsProps {
  artistCounts: number | string;
  postCounts: number | string;
}

const MainPageStatsCards = ({ artistCounts, postCounts }: StatsProps) => {
  return (
    <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      {/* STATS */}
      <motion.div
        className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-8"
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
          name="Partenaires "
          icon={Handshake}
          value="12"
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

      <AdminButton asChild variant="secondary" className="w-full my-4">
        <Link href="/darja-admin/homepage">Modifier la page d'accueil</Link>
      </AdminButton>
    </main>
  );
};

export default MainPageStatsCards;
