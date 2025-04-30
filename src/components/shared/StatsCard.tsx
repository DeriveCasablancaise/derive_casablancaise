'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { FC } from 'react';

interface StatCardProps {
  name: string;
  icon: LucideIcon; // Updated this to use LucideIcon type
  value: string | number;
  color: string;
}

const StatCard: FC<StatCardProps> = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
      whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
    >
      <div className="flex flex-col justify-center items-center px-4 py-5 sm:p-6">
        <span className="flex flex-col justify-center items-center  text-sm font-medium text-gray-400">
          <Icon size={20} style={{ color }} />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
