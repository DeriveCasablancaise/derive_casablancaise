'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { getAllPosts } from '@/lib/actions/post.actions';
import { DeleteConfirmation } from './DeleteConfirmation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Post {
  _id: string;
  frenchTitle: string;
  arabicTitle: string;
  frenchText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  postCategory:
    | 'danse'
    | 'concert'
    | 'théâtre'
    | 'lectures'
    | 'cinéma'
    | 'ateliers';
  url?: string;
  createdAt: Date;
}

interface PostsTableProps {
  currentUserIsAdmin: boolean;
}

const PostsTable = ({ currentUserIsAdmin }: PostsTableProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
    }

    fetchPosts();
  }, []);

  const handleDelete = (postId: string) => {
    // Update both posts and filteredPosts states after deletion
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    setFilteredPosts((prevFiltered) =>
      prevFiltered.filter((post) => post._id !== postId)
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = posts.filter((post) =>
      post.frenchTitle.toLowerCase().includes(term)
    );
    setFilteredPosts(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Les postes</h2>
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
                Titre
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
            {filteredPosts.map((post) => (
              <motion.tr
                key={post._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 ">
                      <div className="relative h-10 w-12 rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                        {post.images.length > 0 ? (
                          <Image
                            src={post.images[0]}
                            alt={post.frenchTitle}
                            fill
                            className="object-cover"
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
                        {post.frenchTitle}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300 capitalize">
                    {post.postCategory}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {currentUserIsAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <Button
                      asChild
                      className=" bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md  border border-gray-700 my-4 mx-2"
                      variant="outline"
                    >
                      <Link href={`/darja-admin/posts/${post._id}/update`}>
                        Modifier
                      </Link>
                    </Button>
                    <DeleteConfirmation
                      postId={post._id}
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

export default PostsTable;
