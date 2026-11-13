'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import {
  artistsHeading,
  parseEditionSelection,
  serializeEditionSelection,
  toggleEdition,
} from '@/lib/artists-page';
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

const ArtistsSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editionKey = searchParams.getAll('edition').join(',');

  // the URL is the only state, so the browser back arrow restores the tabs
  const canonical = serializeEditionSelection(
    parseEditionSelection(editionKey ? [editionKey] : [])
  );
  // keyed on the canonical value so rewriting the URL does not refetch
  const selection = useMemo(() => parseEditionSelection([canonical]), [canonical]);
  const selectedCategories = new Set<ArtistCategoryKey>(selection);

  const [artists, setArtists] = useState<IArtist[]>([]);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('ArtistsPage');
  const tEdition = useTranslations('HomePage.Community');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const writeSelection = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('edition', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // a missing, repeated or unknown parameter is rewritten to the one we show
  useEffect(() => {
    if (editionKey !== canonical) writeSelection(canonical);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editionKey, canonical]);

  const handleCategoryToggle = (category: ArtistCategoryKey) => {
    writeSelection(serializeEditionSelection(toggleEdition(selection, category)));
  };

  const heading = artistsHeading(selection, new Date());
  const headingText =
    heading.kind === 'edition'
      ? tEdition('headingEdition', { year: heading.year })
      : heading.kind === 'past'
      ? tEdition('heading')
      : t('heading');

  useEffect(() => {
    let cancelled = false;
    const fetchArtists = async () => {
      try {
        // an empty selection means every artist
        const fetchedArtists = await getAllArtists(selection);

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
  }, [selection]);

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
            {headingText}
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
