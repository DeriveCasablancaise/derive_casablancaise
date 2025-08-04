'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { fadeIn } from '@/variants';
import TeaserModal from '../TeaserModal';
import AfterMovieModal from '../AfterMovieModal';
import ClientWrapper from '../PostWrapper';

const VideoSection = () => {
  const [teaserModalOpen, setTeaserModalOpen] = useState(false);
  const [afterMovieModalOpen, setAfterMovieModalOpen] = useState(false);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage');

  const openTeaserModal = () => setTeaserModalOpen(true);
  const closeTeaserModal = () => setTeaserModalOpen(false);
  const openAfterMovieModal = () => setAfterMovieModalOpen(true);
  const closeAfterMovieModal = () => setAfterMovieModalOpen(false);

  return (
    <ClientWrapper>
      <section className="relative py-16 md:py-24 overflow-hidden bg-[#E9EAEB]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id="pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="3" fill="#094142" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2
              className={cn(
                'text-[#ee7103] text-3xl md:text-4xl mb-4',
                isArabic ? 'arabic-title-bold' : 'latin-title-light'
              )}
            >
              {isArabic ? 'مكتبة الفيديو' : 'Vidéos '}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Teaser Video */}
            <div className="flex flex-col items-center w-full">
              <motion.div
                variants={fadeIn('up', 0.3)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-xl"
                onClick={openTeaserModal}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src="/images/thumbTeaser.jpg"
                    alt={isArabic ? 'إعلان دعائي' : 'Teaser thumbnail'}
                    className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/70 via-transparent to-transparent"></div>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="bg-white/20 backdrop-blur-md rounded-full p-4"
                    >
                      <PlayCircleIcon className="h-12 w-12 text-[#09414] " />
                    </motion.div>
                  </div>

                  <div className="absolute top-4 left-4 bg-[#00b0db] text-white px-3 py-1 rounded-full flex items-center space-x-2">
                    <Film size={16} />
                    <span className="font-medium text-sm">Teaser</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  'mt-4 text-center text-base md:text-lg font-bold text-[#094142]',
                  isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
                )}
              >
                {isArabic
                  ? 'إعلان دعائي لـلمنعطف البيضاوي 2024'
                  : 'Teaser Dérive Casablancaise 2024'}
              </motion.div>
            </div>

            {/* After Movie */}
            <div className="flex flex-col items-center w-full">
              <motion.div
                variants={fadeIn('up', 0.4)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-xl"
                onClick={openAfterMovieModal}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src="/images/thumbTeaser.jpg"
                    alt={isArabic ? 'الفيلم الختامي' : 'After movie thumbnail'}
                    className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/70 via-transparent to-transparent"></div>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.8 }}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="bg-white/20 backdrop-blur-md rounded-full p-4"
                    >
                      <PlayCircleIcon className="h-12 w-12 text-[#09414] " />
                    </motion.div>
                  </div>

                  <div className="absolute top-4 left-4 bg-[#ee7103] text-white px-3 py-1 rounded-full flex items-center space-x-2">
                    <Film size={16} />
                    <span className="font-medium text-sm">Aftermovie</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  'mt-4 text-center text-base md:text-lg font-bold text-[#094142]',
                  isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
                )}
              >
                {isArabic
                  ? 'إعلان دعائي لـلمنعطف البيضاوي 2024'
                  : 'Aftermovie Dérive Casablancaise 2024'}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <TeaserModal isOpen={teaserModalOpen} onClose={closeTeaserModal} />
        <AfterMovieModal
          isOpen={afterMovieModalOpen}
          onClose={closeAfterMovieModal}
        />
      </section>
    </ClientWrapper>
  );
};

export default VideoSection;
