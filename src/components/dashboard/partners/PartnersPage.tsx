'use client';

import Navbar from '@/components/shared/Navbar';
import StatCard from '@/components/shared/StatsCard';
import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import PartnersTable from './PartnersTable';
import PartnerOrderManager from './PartnerOrderManager';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [view, setView] = useState<'list' | 'order'>('list');
  const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false);

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

        {isAdmin && (
          <div
            role="group"
            aria-label="Vue"
            className="flex items-center gap-2 mb-6"
          >
            {(
              [
                ['list', 'Liste'],
                ['order', "Ordre d'affichage"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                // leaving the order view would drop the unsaved order
                disabled={hasUnsavedOrder}
                onClick={() => setView(key)}
                className={cn(
                  'min-h-10 px-4 py-2 rounded-md border border-gray-700 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500',
                  view === key
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-200',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* each view loads its own data when it opens, so they never disagree */}
        {isAdmin && view === 'order' ? (
          <PartnerOrderManager onDirtyChange={setHasUnsavedOrder} />
        ) : (
          <PartnersTable currentUserIsAdmin={isAdmin} />
        )}

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
