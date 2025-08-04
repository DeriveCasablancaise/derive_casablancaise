'use client';

import React, { useState, useEffect } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { IArtist } from '@/lib/database/models/artist.model';
import { getAllArtists } from '@/lib/actions/artists.actions';
import Image from 'next/image';
import Link from 'next/link';
import ClientWrapper from './PostWrapper';

const ArtistsSection = () => {
  const [artists, setArtists] = useState<IArtist[]>([]);
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

  return (
    <ClientWrapper>
      <section className="bg-[#E9EAEB] py-24 md:py-32">
        <div className="container mx-auto px-4">
          <h2
            className={cn(
              ' text-lg md:text-2xl xl:text-3xl text-[#ee7103] mb-12 text-center',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {t('heading')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {artists.map((artist, index) => (
              <motion.div
                key={artist._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
          </div>
        </div>
      </section>
    </ClientWrapper>
  );
};

export default ArtistsSection;
