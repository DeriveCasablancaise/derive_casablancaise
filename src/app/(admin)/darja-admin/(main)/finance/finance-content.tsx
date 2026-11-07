'use client';

import FinanceTable from '@/components/dashboard/finance/FinanceTable';
import Navbar from '@/components/shared/Navbar';
import { AdminButton } from '@/components/dashboard/admin-ui';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';
import { HandCoins } from 'lucide-react';
import StatCard from '@/components/shared/StatsCard';

const FinanceContent = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Gérer les partenaires financiers" />

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
            icon={HandCoins}
            value="14"
            color="#EC4899"
          />
        </motion.div>

        <FinanceTable />

        <AdminButton asChild className="w-full my-4">
          <Link href="/darja-admin/finance/create">
            Créer un nouveau partenaire financier
          </Link>
        </AdminButton>
      </main>
    </div>
  );
};

export default FinanceContent;
