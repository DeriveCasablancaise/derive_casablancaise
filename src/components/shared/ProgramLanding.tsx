'use client';

import { cn, convertYouTubeToEmbed } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import SubHeader from './SubHeader';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { PlayCircleIcon } from 'lucide-react';
import { fadeIn } from '@/variants';
import TeaserModal from './TeaserModal';
import { IHomepage } from '@/lib/database/models/homepage.model';
import AfterMovieModal from './AfterMovieModal';
import type { BannerView } from '@/lib/banner';
import PosterSection from './PosterSection';
import { LandingFlow } from './LandingFlow';
import { getLandingView } from '@/lib/landing';

interface ProgramLandingProps {
  homepage: IHomepage;
  banner?: BannerView | null;
}

const ProgramLanding = ({ homepage, banner = null }: ProgramLandingProps) => {
  const [isTeaseModalOpen, setIsTeaseModalOpen] = useState<boolean>(false);
  const [isAfterMovieModalOpen, setIsAfterMovieModalOpen] =
    useState<boolean>(false);
  const locale = useLocale();
  const hasArabicContent = homepage.textAr && homepage.textAr !== '';
  const isArabic = locale === 'ar' && hasArabicContent;

  const video1EmbedLink = convertYouTubeToEmbed(homepage.video1IframeLink);
  const video2EmbedLink = convertYouTubeToEmbed(homepage.video2IframeLink);

  // one block: the same sanitising and Arabic fallback as the other pages
  const { texts, backgroundImage, showBackground } = getLandingView(
    {
      text1Fr: homepage.textFr,
      text1Ar: homepage.textAr,
      backgroundImage: homepage.backgroundImage,
    },
    locale === 'ar',
  );

  return (
    <>
      <SubHeader banner={banner} />
      {showBackground && (
        <LandingFlow
          texts={texts}
          backgroundImage={backgroundImage}
          isArabic={locale === 'ar'}
          topSpace={{ base: '60vh', lg: '85vh' }}
          flushTop
          anchor="bottom-start"
        />
      )}
      <PosterSection />
      <motion.div
        variants={fadeIn('up', 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mt-16 lg:mt-24"
      >
        <h2
          className={cn(
            'text-brand-title text-xl lg:text-3xl mb-4',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold',
          )}
        >
          {isArabic
            ? ' الفيلم الختامي لفعالية المنعطف البيضاوي '
            : 'After Movie 2024'}
        </h2>
      </motion.div>
      <div className="flex flex-col lg:flex-row justify-center items-start mx-auto my-8 md:my-10 xl:my-12 max-w-4xl gap-8 px-4">
        {/* First Video Showcase */}
        {/* <div className="flex flex-col items-center w-full lg:w-1/2">
          <motion.div
            variants={fadeIn('up', 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex justify-center items-center shadow-md cursor-pointer group w-full"
            onClick={() => setIsTeaseModalOpen(true)}
          >
            <Image
              src={homepage.video1Thumbnail}
              width={600}
              height={600}
              alt="tease_thumbnail"
              className="w-full object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/50 via-transparent to-transparent rounded-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/20 backdrop-blur-md rounded-full p-6"
              >
                <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-brand-orange" />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'mt-4 text-center text-base md:text-lg font-bold text-[#094142]',
              isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
            )}
          >
            {isArabic
              ? homepage.video1TitleAr || homepage.video1TitleFr
              : homepage.video1TitleFr}
          </motion.div>
        </div> */}

        {/* Second Video Showcase (Placeholder) */}
        <div className="flex flex-col items-center w-full lg:w-1/2 mt-8 lg:mt-0">
          <motion.div
            variants={fadeIn('up', 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex justify-center items-center shadow-md cursor-pointer group w-full"
            onClick={() => setIsAfterMovieModalOpen(true)}
          >
            <Image
              src={homepage.video2Thumbnail}
              width={600}
              height={600}
              alt="tease_thumbnail"
              className="w-full object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/50 via-transparent to-transparent rounded-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="bg-white/20 backdrop-blur-md rounded-full p-6"
              >
                <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-brand-orange" />
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'mt-4 text-center text-base md:text-lg font-bold text-[#094142]',
              isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
            )}
          >
            {isArabic
              ? homepage.video2TitleAr || homepage.video2TitleFr
              : homepage.video2TitleFr}
          </motion.div>
        </div>
      </div>
      <TeaserModal
        isOpen={isTeaseModalOpen}
        onClose={() => setIsTeaseModalOpen(false)}
        videoLink={video1EmbedLink}
      />
      <AfterMovieModal
        isOpen={isAfterMovieModalOpen}
        onClose={() => setIsAfterMovieModalOpen(false)}
        videoLink={video2EmbedLink}
      />
    </>
  );
};

export default ProgramLanding;
