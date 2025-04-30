'use client';

import React from 'react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import PostsTable from './posts/PostsTable';
import StatCard from '../shared/StatsCard';
import { Calendar, NewspaperIcon } from 'lucide-react';
import Navbar from '../shared/Navbar';
import Link from 'next/link';

interface PostStats {
  totalPosts: number | string;
}

const PostsPage = ({
  postStats,
  isAdmin,
}: {
  postStats: PostStats;
  isAdmin: boolean;
}) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Gérer les événements" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Nombre d'évenements"
            icon={NewspaperIcon}
            value={postStats.totalPosts}
            color="#8B5CF6"
          />
          <StatCard
            name="Nombre de Jours"
            icon={Calendar}
            value={5}
            color="#6EE7B7"
          />
        </motion.div>

        <PostsTable currentUserIsAdmin={isAdmin} />

        {isAdmin && (
          <Button
            asChild
            className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
            variant="outline"
          >
            <Link href="/darja-admin/posts/create">
              Créer un nouvel événement
            </Link>
          </Button>
        )}
      </main>
    </div>
  );
};

export default PostsPage;
