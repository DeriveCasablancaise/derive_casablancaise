'use client';

import { IArtist } from '@/lib/database/models/artist.model';
import { cn } from '@/lib/utils';
import { ArtistCard } from './ArtistCard';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface RelatedArtistsProps {
  artists: IArtist[];
  isArabic: boolean;
  locale: string;
}

export const RelatedArtists = ({
  artists,
  isArabic,
  locale,
}: RelatedArtistsProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  // Take only the first 3 artists
  const limitedArtists = artists.slice(0, 3);

  if (!limitedArtists.length) return null;

  return (
    <div className="my-16 px-4" ref={sectionRef}>
      <h2
        className={cn(
          'text-2xl md:text-3xl mb-6 text-[#ee7103]',
          isArabic ? 'arabic-title-bold text-right' : 'latin-title-bold'
        )}
      >
        {isArabic ? 'فنانون آخرون' : 'Autres artistes'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {limitedArtists.map((artist, index) => (
          <ArtistCard
            key={artist._id}
            artist={artist}
            index={index}
            isArabic={isArabic}
            locale={locale}
            isInView={isInView}
          />
        ))}
      </div>
    </div>
  );
};
