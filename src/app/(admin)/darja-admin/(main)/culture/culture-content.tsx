'use client';

import Navbar from '@/components/shared/Navbar';
import { AdminButton } from '@/components/dashboard/admin-ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { BookUser } from 'lucide-react';
import StatCard from '@/components/shared/StatsCard';
import CultureTable from '@/components/dashboard/culture/CultureTable';

const CultureContent = () => {
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

        <AdminButton asChild className="w-full my-4">
          <Link href="/darja-admin/culture/create">
            Créer un nouveau partenaire culturel
          </Link>
        </AdminButton>
      </main>
    </div>
  );
};

export default CultureContent;
