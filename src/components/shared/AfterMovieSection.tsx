'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircleIcon, Film } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import AfterMovieModal from './AfterMovieModal';
import { fadeIn } from '@/variants';

const AfterMovieSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage');

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-[#E9EAEB]">
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
              'text-[#094142] text-3xl md:text-4xl lg:text-5xl mb-4',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {isArabic
              ? ' الفيلم الختامي لفعالية المنعطف البيضاوي '
              : 'Dérive Casablancaise Aftermovie'}
          </h2>
        </motion.div>

        <motion.div
          variants={fadeIn('up', 0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative max-w-5xl mx-auto group cursor-pointer"
          onClick={openModal}
        >
          <div className="relative overflow-hidden rounded-xl shadow-2xl">
            {/* Thumbnail Image */}
            <Image
              src="/images/thumbTeaser.jpg"
              width={1200}
              height={675}
              alt="Dérive Casablancaise Aftermovie"
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/70 via-transparent to-transparent"></div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/20 backdrop-blur-md rounded-full p-6"
              >
                <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-[#094142]" />
              </motion.div>
            </div>

            {/* Film Badge */}
            <div className="absolute top-6 left-6 bg-[#ee7103] text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <Film size={20} />
              <span className="font-medium">Aftermovie</span>
            </div>

            {/* Title Badge at Bottom */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <div
                className={cn(
                  'text-white text-xl md:text-2xl px-6',
                  isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
                )}
              >
                {isArabic ? 'انقر للمشاهدة' : 'Cliquez pour regarder'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AfterMovieModal isOpen={isOpen} onClose={closeModal} />
    </section>
  );
};

export default AfterMovieSection;
