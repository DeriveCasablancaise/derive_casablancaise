'use client';

import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatsCard';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import Link from 'next/link';
import PartnersTable from './PartnersTable';
import { Button } from '@/components/ui/button';

interface PartnerStats {
  totalPartners: number | string;
}

const PartnersPage = ({
  partnerStats,
  isAdmin,
}: {
  partnerStats: PartnerStats;
  isAdmin: boolean;
}) => {
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
            icon={Handshake}
            value={partnerStats.totalPartners}
            color="#EC4899"
          />
        </motion.div>

        <PartnersTable currentUserIsAdmin={isAdmin} />

        {isAdmin && (
          <Button
            asChild
            className="w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4"
            variant="outline"
          >
            <Link href="/darja-admin/partners/create">
              Créer un nouveau partenaire
            </Link>
          </Button>
        )}
      </main>
    </div>
  );
};

export default PartnersPage;
