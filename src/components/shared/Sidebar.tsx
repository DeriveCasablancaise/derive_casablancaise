'use client';

import {
  Handshake,
  HeadphonesIcon,
  HouseIcon,
  LayersIcon,
  Menu,
  NewspaperIcon,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const SIDEBAR_ITEMS = [
  {
    name: 'Acceuil',
    icon: HouseIcon,
    color: '#6366f1',
    href: '/darja-admin',
  },
  {
    name: 'Postes',
    icon: NewspaperIcon,
    color: '#8B5CF6',
    href: '/darja-admin/posts',
  },
  {
    name: 'Utilisateurs',
    icon: Users,
    color: '#6366F1',
    href: '/darja-admin/users',
  },
  {
    name: 'Artistes',
    icon: HeadphonesIcon,
    color: '#6EE7B7',
    href: '/darja-admin/artists',
  },
  {
    name: 'Partenaires',
    icon: Handshake,
    color: '#EC4899',
    href: '/darja-admin/partners',
  },
  {
    name: 'Pages',
    icon: LayersIcon,
    color: '#6366F1',
    href: '/darja-admin/pages-to-modify',
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div
        className={cn(
          'h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4  border-r border-gray-700 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'items-start' : 'items-center'
        )}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  'flex items-center  p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'
                )}
              >
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: '20px' }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};
export default Sidebar;
