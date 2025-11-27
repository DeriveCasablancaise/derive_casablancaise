'use client';

import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatsCard';
import { motion } from 'framer-motion';
import { LayersIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const PagesToModify = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Les pages à modifier" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Pages à modifier"
            icon={LayersIcon}
            value={4}
            color="#6366F1"
          />
        </motion.div>

        {isAdmin && (
          <div>
            <Button
              asChild
              className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
              variant="outline"
            >
              <Link href="/darja-admin/homepage">
                Modifier la page d'accueil
              </Link>
            </Button>
            <Button
              asChild
              className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
              variant="outline"
            >
              <Link href="/darja-admin/derive-2024">
                Modifier la page derive 2024
              </Link>
            </Button>
            <Button
              asChild
              className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
              variant="outline"
            >
              <Link href="/darja-admin/derive-2022">
                Modifier la page derive 2022
              </Link>
            </Button>
            <Button
              asChild
              className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
              variant="outline"
            >
              <Link href="/darja-admin/ar2d">Modifier la page AR2D</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PagesToModify;
