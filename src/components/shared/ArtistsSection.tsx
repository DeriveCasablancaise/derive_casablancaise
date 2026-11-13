'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { parseEditionParam } from '@/constants/editions';
import { IArtist } from '@/lib/database/models/artist.model';
import { getAllArtists } from '@/lib/actions/artists.actions';
import { FallbackImage } from './ImageFallback';
import { PhotoCredit } from './PhotoCredit';
import { altWithCredit, creditFor } from '@/lib/photo-credits';
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

// the filter allows several years, so the parameter can repeat; invalid values are dropped
const readEditions = (values: string[]) =>
  new Set(
    values
      .map(parseEditionParam)
      .filter((year): year is ArtistCategoryKey => year !== null)
  );

const ArtistsSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editionValues = searchParams.getAll('edition');
  const editionKey = editionValues.join(',');

  const [artists, setArtists] = useState<IArtist[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    Set<ArtistCategoryKey>
  >(() => readEditions(editionValues));
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('ArtistsPage');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleCategoryToggle = (category: ArtistCategoryKey) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('edition');
    newCategories.forEach((year) => params.append('edition', year));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  // the URL can change while this stays mounted (the Community menu link)
  useEffect(() => {
    setSelectedCategories((prev) => {
      const fromUrl = readEditions(editionKey ? editionKey.split(',') : []);
      const same =
        fromUrl.size === prev.size &&
        Array.from(fromUrl).every((year) => prev.has(year));
      return same ? prev : fromUrl;
    });
  }, [editionKey]);

  useEffect(() => {
    let cancelled = false;
    const fetchArtists = async () => {
      try {
        // an empty selection means every artist
        const fetchedArtists = await getAllArtists(
          Array.from(selectedCategories)
        );

        if (fetchedArtists && !cancelled) {
          setArtists(fetchedArtists);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
    return () => {
      cancelled = true;
    };
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
              'text-lg md:text-2xl xl:text-3xl text-brand-title mb-12 text-center',
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
                className="group relative overflow-hidden shadow-xl p-1 aspect-square"
                style={{
                  backgroundColor: '#094142',
                }}
              >
                <Link href={`/${locale}/community/${artist._id}`}>
                  <div className="relative overflow-hidden aspect-square">
                    <FallbackImage
                      src={artist.images?.[0]}
                      alt={altWithCredit(
                        isArabic ? artist.arabicName : artist.frenchName,
                        creditFor(artist.imageCredits, artist.images?.[0]),
                        isArabic,
                      )}
                      className="object-contain object-center"
                    />
                    <PhotoCredit
                      credit={creditFor(
                        artist.imageCredits,
                        artist.images?.[0],
                      )}
                      isArabic={isArabic}
                      position="top-end"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <h3
                        className={cn(
                          'text-base mb-1',
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
