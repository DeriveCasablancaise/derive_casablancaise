'use client';

import React, { useState, useEffect } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { IArtist } from '@/lib/database/models/artist.model';
import { getAllArtists } from '@/lib/actions/artists.actions';
import Image from 'next/image';
import Link from 'next/link';

const ArtistsSection = () => {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [visibleArtists, setVisibleArtists] = useState(6);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('ArtistsPage');

  useEffect(() => {
    const fetchArtists = async () => {
      const fetchedArtists = await getAllArtists();
      if (fetchedArtists) {
        setArtists(fetchedArtists);
      }
    };
    fetchArtists();
  }, []);

  const showMoreArtists = () => {
    setVisibleArtists((prev) => prev + 6);
  };

  return (
    <section className="bg-[#E9EAEB] py-24 md:py-32">
      <motion.div
        variants={landingSlideUp}
        initial="initial"
        animate="enter"
        className="container mx-auto px-4"
      >
        <h2
          className={cn(
            'text-3xl md:text-5xl text-[#094142] mb-12 text-center',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold'
          )}
        >
          {t('heading')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.slice(0, visibleArtists).map((artist, index) => (
            <motion.div
              key={artist._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden shadow-xl p-2"
              style={{
                backgroundColor: '#094142',
              }}
            >
              <Link href={`/${locale}/community/${artist._id}`}>
                <div className="aspect-[3/4] relative overflow-hidden">
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
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3
                      className={cn(
                        'text-xl md:text-2xl mb-2',
                        isArabic
                          ? 'arabic-subtitle-bold'
                          : 'latin-subtitle-bold'
                      )}
                    >
                      {isArabic ? artist.arabicName : artist.frenchName}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {artists.length > visibleArtists && (
          <div className="mt-12 text-center">
            <button
              onClick={showMoreArtists}
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#094142] rounded-full hover:bg-[#00b0db] transition-colors duration-300"
            >
              {isArabic ? 'عرض المزيد' : 'Voir plus'}
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ArtistsSection;
