'use client';

import { motion } from 'framer-motion';
import { FallbackImage } from '../ImageFallback';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IArtist } from '@/lib/database/models/artist.model';

interface ArtistCardProps {
  artist: IArtist;
  index: number;
  isArabic: boolean;
  locale: string;
  isInView: boolean;
}

export const ArtistCard = ({
  artist,
  index,
  isArabic,
  locale,
  isInView,
}: ArtistCardProps) => {
  return (
    <motion.div
      key={artist._id}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
      }}
      className="shadow-lg"
    >
      <Link
        href={`/${locale}/community/${artist._id}`}
        className="block aspect-square relative overflow-hidden bg-[#094142]"
      >
        <div className="absolute inset-2">
          <FallbackImage
            src={artist.images?.[0]}
            alt={isArabic ? artist.arabicName : artist.frenchName}
            className="object-contain object-center"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3
            className={cn(
              'text-white text-lg mb-1 font-semibold',
              isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
            )}
          >
            {isArabic ? artist.arabicName : artist.frenchName}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};
