'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  categoryHref,
  type CategoryKey,
  type EditionYear,
} from '@/constants/editions';
import { PhotoCredit } from '../PhotoCredit';
import { altWithCredit } from '@/lib/photo-credits';
import { Scrim, textOnImageClass } from '../FitImage';

interface CategoryImageButtonProps {
  categoryKey: CategoryKey;
  categoryName: { fr: string; ar: string };
  // undefined renders a plain tile
  imageUrl?: string;
  imageCredit?: string;
  isSelected: boolean;
  isArabic: boolean;
  onClick: (category: CategoryKey) => void;
  index: number;
  isInView: boolean;
  isNavigationMode?: boolean;
  locale?: string;
  edition: EditionYear;
}

const SIZES = '(max-width: 1023px) 50vw, 25vw';

// A square tile. The photo is shown whole (contain) over a blurred, darkened
// copy of itself that fills the square, so there are no empty bands.
export const CategoryImageButton: React.FC<CategoryImageButtonProps> = ({
  categoryKey,
  categoryName,
  imageUrl,
  imageCredit,
  isSelected,
  isArabic,
  onClick,
  index,
  isInView,
  isNavigationMode = false,
  edition,
}) => {
  const locale = useLocale();
  const imageAlt = altWithCredit(
    isArabic ? categoryName.ar : categoryName.fr,
    imageCredit,
    isArabic,
  );

  const picture = imageUrl ? (
    <>
      {/* scaled up so the blurred edges stay outside the square */}
      <Image
        src={imageUrl}
        alt=""
        aria-hidden="true"
        fill
        className="scale-[1.15] object-cover blur-[24px]"
        sizes={SIZES}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-contain"
        sizes={SIZES}
      />
      <Scrim variant="center" />
    </>
  ) : (
    // no picture of its own: a plain tile, never another image
    <div aria-hidden="true" className="absolute inset-0 bg-brand-chrome" />
  );

  const title = (
    <div className="absolute inset-0 flex items-center justify-center">
      <h3
        className={cn(
          textOnImageClass,
          'text-center px-4 py-2 font-semibold',
          'text-sm md:text-base lg:text-lg',
          'transform transition-all duration-300 group-hover:scale-110',
          isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular',
        )}
      >
        {isArabic ? categoryName.ar : categoryName.fr}
      </h3>
    </div>
  );

  const credit = imageUrl && (
    <PhotoCredit credit={imageCredit} isArabic={isArabic} />
  );

  if (isNavigationMode) {
    return (
      <Link
        href={`/${locale}${categoryHref(edition, categoryKey)}`}
        className="block"
      >
        {/* the whole tile scales on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          className={cn(
            'relative aspect-square w-full overflow-hidden cursor-pointer group',
            'transform transition-all duration-300 hover:scale-105 hover:shadow-xl',
          )}
        >
          {picture}
          {title}
          {credit}
        </motion.div>
      </Link>
    );
  }

  return (
    <button
      onClick={() => onClick(categoryKey)}
      className={cn(
        'relative block aspect-square w-full group overflow-hidden shadow-md transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b0db]',
        isSelected ? 'ring-4 ring-[#00b0db] ring-offset-2' : 'hover:shadow-xl',
      )}
    >
      {picture}
      {title}
      {credit}
    </button>
  );
};
