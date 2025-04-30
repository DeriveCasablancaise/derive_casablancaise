'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllUsers } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { DeleteConfirmation } from './DeleteUserConfirmation';

interface User {
  _id: string;
  clerkId: string;
  username: string; // Added from your Mongoose model
  email: string;
  photo: string; // Added from your Mongoose model
  firstName?: string; // Optional
  lastName?: string; // Optional
  isAdmin: boolean; // Changed from 'role' to 'isAdmin'
  createdAt: Date; // Added from your Mongoose model
}

interface UsersTableProps {
  currentUserIsAdmin: boolean; // Add this prop
}

const UsersTable = ({ currentUserIsAdmin }: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    }

    fetchUsers();
  }, []);

  const handleDelete = (clerkId: string) => {
    // Update both posts and filteredPosts states after deletion
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.clerkId !== clerkId)
    );
    setFilteredUsers((prevFiltered) =>
      prevFiltered.filter((user) => user.clerkId !== clerkId)
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = filteredUsers.filter(
      (user) =>
        user.username?.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Utilisateurs</h2>
        <div className="relative hidden md:block">
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>

              {currentUserIsAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => {
              const isAdmin = user.isAdmin;

              return (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {user.username.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-100">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full  ',
                        isAdmin
                          ? 'bg-green-800 text-gray-300'
                          : 'bg-red-800 text-blue-100'
                      )}
                    >
                      <div className="w-full p-2 flex justify-center items-center gap-2">
                        <Image
                          src={
                            isAdmin
                              ? '/assets/check.svg'
                              : '/assets/cancelled.svg'
                          }
                          alt="status"
                          width={24}
                          height={24}
                          className="h-fit w-3"
                        />
                        Admin
                      </div>
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {currentUserIsAdmin && (
                      <DeleteConfirmation
                        clerkId={user.clerkId}
                        onDelete={handleDelete}
                      />
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
