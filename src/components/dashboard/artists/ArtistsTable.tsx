'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getAllPosts } from '@/lib/actions/post.actions';
import { DeleteConfirmation } from './DeleteConfirmation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAllArtists } from '@/lib/actions/artists.actions';
import Image from 'next/image';

interface Artist {
  _id: string;
  frenchName: string;
  arabicName: string;
  frenctText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  artistCategory: '2022' | '2024';
  url?: string;
  createdAt: Date;
}

interface ArtistsTableProps {
  currentUserIsAdmin: boolean;
}

const ArtistsTable = ({ currentUserIsAdmin }: ArtistsTableProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    async function fetchArtists() {
      const allArtists = await getAllArtists();
      setArtists(allArtists);
      setFilteredArtists(allArtists);
    }

    fetchArtists();
  }, []);

  const handleDelete = (artistId: string) => {
    setArtists((prevArtists) =>
      prevArtists.filter((artist) => artist._id !== artistId)
    );
    setFilteredArtists((prevFiltered) =>
      prevFiltered.filter((artist) => artist._id !== artistId)
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = artists.filter(
      (artist) => artist.frenchName.toLowerCase().includes(term) // Fixed typo from 'title' to 'frenchTitle'
    );
    setFilteredArtists(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Les Artistes</h2>
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
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Crée le :
              </th>
              {currentUserIsAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredArtists.map((artist) => (
              <motion.tr
                key={artist._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="relative h-10 w-12 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                        {artist.images.length > 0 ? (
                          <Image
                            src={artist.images[0]}
                            alt={artist.frenchName}
                            fill
                            className="object-contain"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {artist.frenchName}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {artist.artistCategory}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {new Date(artist.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {currentUserIsAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Button
                      asChild
                      className=" bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md  border border-gray-700 my-4 mx-2"
                      variant="outline"
                    >
                      <Link href={`/darja-admin/artists/${artist._id}/update`}>
                        Modifier
                      </Link>
                    </Button>
                    <DeleteConfirmation
                      artistId={artist._id}
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

export default ArtistsTable;
