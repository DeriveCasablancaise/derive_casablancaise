'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { IArtist } from '@/lib/database/models/artist.model';
import { getAllArtists } from '@/lib/actions/artists.actions';
import Image from 'next/image';
import Link from 'next/link';
import ClientWrapper from './PostWrapper';

// Categories for artist years
const ArtistCategories = {
  '2022': {
    fr: '2022',
    ar: '٢٠٢٢',
  },
  '2024': {
    fr: '2024',
    ar: '٢٠٢٤',
  },
  '2026': {
    fr: '2026',
    ar: '٢٠٢٦',
  },
} as const;

type ArtistCategoryKey = keyof typeof ArtistCategories;

const ArtistsSection = () => {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    Set<ArtistCategoryKey>
  >(new Set());
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('ArtistsPage');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleCategoryToggle = (category: ArtistCategoryKey) => {
    setSelectedCategories((prev) => {
      const newCategories = new Set(prev);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return newCategories;
    });
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        let fetchedArtists: IArtist[] = [];

        if (selectedCategories.size === 0) {
          // If no categories selected, fetch all artists
          fetchedArtists = await getAllArtists();
        } else {
          // Fetch artists for each selected category and combine them
          const categoryPromises = Array.from(selectedCategories).map(
            (category) => getAllArtists(category as '2022' | '2024' | '2026')
          );
          const categoryResults = await Promise.all(categoryPromises);
          fetchedArtists = categoryResults.flat();
        }

        if (fetchedArtists) {
          setArtists(fetchedArtists);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, [selectedCategories]);

  return (
    <ClientWrapper>
      <section ref={ref} className="bg-[#E9EAEB] py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              'text-lg md:text-2xl xl:text-3xl text-[#ee7103] mb-12 text-center',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {t('heading')}
          </motion.h2>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
              {(Object.keys(ArtistCategories) as ArtistCategoryKey[]).map(
                (category, index) => (
                  <motion.button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={cn(
                      'text-lg md:text-xl transition-all duration-300 relative whitespace-nowrap',
                      "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5",
                      'before:bg-[#00b0db] before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300',
                      selectedCategories.has(category)
                        ? 'text-[#00b0db] before:scale-x-100 font-semibold'
                        : 'text-[#094142] hover:text-[#00b0db] hover:before:scale-x-100',
                      isArabic
                        ? 'arabic-subtitle-regular'
                        : 'latin-subtitle-regular'
                    )}
                  >
                    {isArabic
                      ? ArtistCategories[category].ar
                      : ArtistCategories[category].fr}
                  </motion.button>
                )
              )}
            </div>
          </motion.div>

          {/* Artists Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8"
          >
            {artists.map((artist, index) => (
              <motion.div
                key={artist._id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="group relative overflow-hidden shadow-xl p-1"
                style={{
                  backgroundColor: '#094142',
                }}
              >
                <Link href={`/${locale}/community/${artist._id}`}>
                  <div className="aspect-square relative overflow-hidden">
                    {artist.images && artist.images.length > 0 && (
                      <Image
                        src={artist.images[0]}
                        alt={isArabic ? artist.arabicName : artist.frenchName}
                        layout="fill"
                        objectFit="cover"
                        className="transform transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <h3
                        className={cn(
                          'text-base md:text-lg mb-1',
                          isArabic
                            ? 'arabic-subtitle-light'
                            : 'latin-subtitle-light'
                        )}
                      >
                        {isArabic ? artist.arabicName : artist.frenchName}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* No Artists Message */}
          {artists.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-center py-12"
            >
              <p
                className={cn(
                  'text-lg text-[#094142]',
                  isArabic
                    ? 'arabic-subtitle-regular'
                    : 'latin-subtitle-regular'
                )}
              >
                {selectedCategories.size > 0
                  ? isArabic
                    ? 'لا توجد فنانون في هذه الفئات'
                    : 'Aucun artiste trouvé dans ces catégories'
                  : isArabic
                  ? 'لا توجد فنانون'
                  : 'Aucun artiste trouvé'}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </ClientWrapper>
  );
};

export default ArtistsSection;
