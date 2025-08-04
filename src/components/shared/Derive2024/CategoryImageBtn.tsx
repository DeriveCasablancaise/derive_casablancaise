'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Define the CategoryKey type based on your existing Categories object
type CategoryKey =
  | 'danse'
  | 'concert'
  | 'theatre'
  | 'lectures'
  | 'cinema'
  | 'ateliers';

interface CategoryImageButtonProps {
  categoryKey: CategoryKey;
  categoryName: { fr: string; ar: string };
  imageUrl: string;
  isSelected: boolean;
  isArabic: boolean;
  onClick: (category: CategoryKey) => void;
  index: number;
  isInView: boolean;
}

export function CategoryImageButton({
  categoryKey,
  categoryName,
  imageUrl,
  isSelected,
  isArabic,
  onClick,
  index,
  isInView,
}: CategoryImageButtonProps) {
  return (
    <motion.button
      key={categoryKey}
      onClick={() => onClick(categoryKey)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        'relative group aspect-square overflow-hidden shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b0db]',
        isSelected ? 'ring-4 ring-[#00b0db] ring-offset-2' : 'hover:shadow-xl'
      )}
      aria-pressed={isSelected}
    >
      <Image
        src={imageUrl || '/placeholder.svg'}
        alt={isArabic ? categoryName.ar : categoryName.fr}
        layout="fill"
        objectFit="cover"
        className={cn(
          'transition-transform duration-500 group-hover:scale-105',
          isSelected ? 'opacity-80' : 'opacity-100'
        )}
      />
      <div
        className={cn(
          'absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          isSelected ? 'opacity-100' : ''
        )}
      >
        <span
          className={cn(
            'text-white text-base lg:text-xl font-bold text-center px-2',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {isArabic ? categoryName.ar : categoryName.fr}
        </span>
      </div>
    </motion.button>
  );
}
