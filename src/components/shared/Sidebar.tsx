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
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SIDEBAR_ITEMS = [
  { name: 'Accueil', icon: HouseIcon, href: '/darja-admin' },
  { name: 'Postes', icon: NewspaperIcon, href: '/darja-admin/posts' },
  { name: 'Utilisateurs', icon: Users, href: '/darja-admin/users' },
  { name: 'Artistes', icon: HeadphonesIcon, href: '/darja-admin/artists' },
  { name: 'Partenaires', icon: Handshake, href: '/darja-admin/partners' },
  { name: 'Pages', icon: LayersIcon, href: '/darja-admin/pages-to-modify' },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div
        className={cn(
          'h-full bg-gray-800 p-4 border-r border-gray-700 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'items-start' : 'items-center',
        )}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Réduire le menu' : 'Ouvrir le menu'}
          aria-expanded={isSidebarOpen}
          className="p-4 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} aria-hidden="true" />
        </motion.button>

        <TooltipProvider delayDuration={100}>
          <nav className="mt-8 flex-grow" aria-label="Administration">
            {SIDEBAR_ITEMS.map((item) => {
              const isCurrent =
                item.href === '/darja-admin'
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              const link = (
                <Link
                  href={item.href}
                  aria-label={item.name}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2',
                    isCurrent && 'bg-gray-700',
                  )}
                >
                  <item.icon
                    size={20}
                    style={{ minWidth: '20px' }}
                    aria-hidden="true"
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
                </Link>
              );

              // the open menu already shows the name
              if (isSidebarOpen) {
                return <div key={item.href}>{link}</div>;
              }

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.name}</TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};
export default Sidebar;
