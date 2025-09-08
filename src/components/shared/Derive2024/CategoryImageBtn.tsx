'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

const Categories = {
  danse: { fr: 'Danse', ar: 'رقص' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  musique: { fr: 'Musique', ar: 'حفلة موسيقية' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  conference: { fr: 'Conférences', ar: 'مؤتمر' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
  autres: { fr: 'En Marge...', ar: 'أخرى' },
} as const;

type CategoryKey = keyof typeof Categories;

interface CategoryImageButtonProps {
  categoryKey: CategoryKey;
  categoryName: { fr: string; ar: string };
  imageUrl: string;
  isSelected: boolean;
  isArabic: boolean;
  onClick: (category: CategoryKey) => void;
  index: number;
  isInView: boolean;
  isNavigationMode?: boolean;
  locale?: string;
}

export const CategoryImageButton: React.FC<CategoryImageButtonProps> = ({
  categoryKey,
  categoryName,
  imageUrl,
  isSelected,
  isArabic,
  onClick,
  index,
  isInView,
  isNavigationMode = false,
}) => {
  const locale = useLocale();

  const buttonContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
      className={cn(
        'relative aspect-square overflow-hidden cursor-pointer group',
        'transform transition-all duration-300 hover:scale-105 hover:shadow-xl',
        isSelected && !isNavigationMode ? 'ring-4 ring-[#00b0db] shadow-xl' : ''
      )}
    >
      <Image
        src={imageUrl}
        alt={isArabic ? categoryName.ar : categoryName.fr}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3
          className={cn(
            'text-white text-center px-4 py-2 font-semibold',
            'text-sm md:text-base lg:text-lg',
            'transform transition-all duration-300 group-hover:scale-110',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {isArabic ? categoryName.ar : categoryName.fr}
        </h3>
      </div>
    </motion.div>
  );

  if (isNavigationMode) {
    return (
      <Link href={`/${locale}/derive-2024/${categoryKey}`}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={() => onClick(categoryKey)}
      className={cn(
        'relative group aspect-square overflow-hidden shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b0db]',
        isSelected ? 'ring-4 ring-[#00b0db] ring-offset-2' : 'hover:shadow-xl'
      )}
    >
      <Image
        src={imageUrl || '/placeholder.svg'}
        alt={isArabic ? categoryName.ar : categoryName.fr}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300">
        <h3
          className={cn(
            'text-white text-center px-4 py-2 font-semibold',
            'text-sm md:text-base lg:text-lg',
            'transform transition-all duration-300 group-hover:scale-110',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {isArabic ? categoryName.ar : categoryName.fr}
        </h3>
      </div>
    </button>
  );
};
