'use client';

import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatsCard';
import { motion } from 'framer-motion';
import { LayersIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminButton } from './admin-ui';

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
            value={6}
            color="#6366F1"
          />
        </motion.div>

        {isAdmin && (
          <div>
            <AdminButton asChild variant="secondary" className="w-full my-4">
              <Link href="/darja-admin/homepage">
                Modifier la page d'accueil
              </Link>
            </AdminButton>
            <AdminButton asChild variant="secondary" className="w-full my-4">
              <Link href="/darja-admin/derive-2024">
                Modifier la page derive 2024
              </Link>
            </AdminButton>
            <AdminButton asChild variant="secondary" className="w-full my-4">
              <Link href="/darja-admin/derive-2026">
                Modifier la page derive 2026
              </Link>
            </AdminButton>
            <AdminButton asChild variant="secondary" className="w-full my-4">
              <Link href="/darja-admin/derive-2022">
                Modifier la page derive 2022
              </Link>
            </AdminButton>
            <AdminButton asChild variant="secondary" className="w-full my-4">
              <Link href="/darja-admin/ar2d">Modifier la page AR2D</Link>
            </AdminButton>
            <AdminButton asChild variant="secondary" className="w-full my-4">
              <Link href="/darja-admin/banner">
                Modifier la bannière de l'accueil
              </Link>
            </AdminButton>
          </div>
        )}
      </main>
    </div>
  );
};

export default PagesToModify;
