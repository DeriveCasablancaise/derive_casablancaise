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
import { tileStyle } from '@/lib/image-ratio';
import {
  Scrim,
  justifiedTileClass,
  textOnImageClass,
  useImageRatios,
} from '../FitImage';

interface CategoryImageButtonProps {
  categoryKey: CategoryKey;
  categoryName: { fr: string; ar: string };
  // undefined renders a plain tile at the default ratio
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

// A tile of a JustifiedGrid: its box takes the photo's own ratio, so the
// whole photo shows with nothing around it.
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
  const { ratioOf, onLoadFor } = useImageRatios();
  const imageAlt = altWithCredit(
    isArabic ? categoryName.ar : categoryName.fr,
    imageCredit,
    isArabic,
  );

  const picture = imageUrl ? (
    <>
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-contain"
        sizes="(max-width: 479px) 100vw, (max-width: 1024px) 50vw, 33vw"
        onLoad={onLoadFor(imageUrl)}
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
        className={justifiedTileClass}
        style={tileStyle(ratioOf(imageUrl))}
      >
        {/* the whole tile scales on hover, so nothing gets cropped */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          className={cn(
            'relative h-full w-full overflow-hidden cursor-pointer group',
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
      style={tileStyle(ratioOf(imageUrl))}
      className={cn(
        justifiedTileClass,
        'group overflow-hidden shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00b0db]',
        isSelected ? 'ring-4 ring-[#00b0db] ring-offset-2' : 'hover:shadow-xl',
      )}
    >
      {picture}
      {title}
      {credit}
    </button>
  );
};
