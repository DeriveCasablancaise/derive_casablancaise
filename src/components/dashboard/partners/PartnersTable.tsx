'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getAllPartners } from '@/lib/actions/partner.actions';
import { DeleteConfirmation } from '../posts/DeleteConfirmation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Partner {
  _id: string;
  frenchName: string;
  arabicName: string;
  yearOfPartnership: number;
  logoImage?: string;
  partnerLink?: string;
  createdAt: Date;
}

interface PartnersTableProps {
  currentUserIsAdmin: boolean;
}

const PartnersTable = ({ currentUserIsAdmin }: PartnersTableProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    async function fetchPartners() {
      const allPartners = await getAllPartners();
      setPartners(allPartners);
      setFilteredPartners(allPartners);
    }

    fetchPartners();
  }, []);

  const handleDelete = (partnerId: string) => {
    setPartners((prevPartners) =>
      prevPartners.filter((partner) => partner._id !== partnerId)
    );
    setFilteredPartners((prevFiltered) =>
      prevFiltered.filter((partner) => partner._id !== partnerId)
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = partners.filter(
      (partner) =>
        partner.frenchName.toLowerCase().includes(term) ||
        partner.arabicName.toLowerCase().includes(term)
    );
    setFilteredPartners(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Les partenaires</h2>
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Logo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Année
              </th>
              {currentUserIsAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredPartners.map((partner) => (
              <motion.tr
                key={partner._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative h-10 w-12 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                        {partner.logoImage ? (
                          <Image
                            src={partner.logoImage || '/placeholder.svg'}
                            alt={partner.frenchName}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No logo
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-100">
                    {partner.frenchName}
                  </div>
                  {partner.arabicName && (
                    <div className="text-sm text-gray-400" dir="rtl">
                      {partner.arabicName}
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {partner.yearOfPartnership}
                  </div>
                </td>

                {currentUserIsAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Button
                      asChild
                      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md border border-gray-700 my-4 mx-2"
                      variant="outline"
                    >
                      <Link
                        href={`/darja-admin/partners/${partner._id}/update`}
                      >
                        Modifier
                      </Link>
                    </Button>
                    <DeleteConfirmation
                      postId={partner._id}
                      onDelete={handleDelete}
                    />
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PartnersTable;
