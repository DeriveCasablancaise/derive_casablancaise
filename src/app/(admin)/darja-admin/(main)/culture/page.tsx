'use client';

import Navbar from '@/components/shared/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { BookUser } from 'lucide-react';
import StatCard from '@/components/shared/StatsCard';
import CultureTable from '@/components/dashboard/culture/CultureTable';

const page = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Gérer les partenaires culturels" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Nombre de partenaires"
            icon={BookUser}
            value="14"
            color="#EC4899"
          />
        </motion.div>

        <CultureTable />

        <Button
          asChild
          className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
          variant="outline"
        >
          <Link href="/darja-admin/culture/create">
            Créer un nouveau partenaire culturel
          </Link>
        </Button>
      </main>
    </div>
  );
};

export default page;
