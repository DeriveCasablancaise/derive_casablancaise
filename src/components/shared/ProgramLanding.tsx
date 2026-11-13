'use client';

import { cn, convertYouTubeToEmbed } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import SubHeader from './SubHeader';
import { useLocale, useTranslations } from 'next-intl';
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

interface VideoCardProps {
  title: string;
  titleIsArabic: boolean;
  thumbnail: string;
  ariaLabel: string;
  sizes: string;
  featured?: boolean;
  onOpen: () => void;
}

const VideoCard = ({
  title,
  titleIsArabic,
  thumbnail,
  ariaLabel,
  sizes,
  featured = false,
  onOpen,
}: VideoCardProps) => (
  <motion.div
    variants={fadeIn('up', 0.1)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-col items-center w-full"
  >
    <button
      type="button"
      onClick={onOpen}
      aria-label={ariaLabel}
      className="relative block w-full rounded-lg shadow-md cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-title focus-visible:ring-offset-2"
    >
      <Image
        src={thumbnail}
        width={1200}
        height={675}
        sizes={sizes}
        alt={title}
        className="w-full h-auto object-contain rounded-lg"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg" />
      <span className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0.8 }}
          whileHover={{ scale: 1.1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="block bg-white/20 backdrop-blur-md rounded-full p-6"
        >
          <PlayCircleIcon
            className={cn(
              'text-brand-title',
              featured
                ? 'h-20 w-20 md:h-24 md:w-24'
                : 'h-16 w-16 md:h-20 md:w-20',
            )}
          />
        </motion.span>
      </span>
    </button>
    <h2
      className={cn(
        'mt-4 text-center font-bold text-brand-title',
        featured ? 'text-lg md:text-xl' : 'text-base md:text-lg',
        titleIsArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
      )}
    >
      {title}
    </h2>
  </motion.div>
);

const ProgramLanding = ({ homepage, banner = null }: ProgramLandingProps) => {
  const [isTeaseModalOpen, setIsTeaseModalOpen] = useState<boolean>(false);
  const [isAfterMovieModalOpen, setIsAfterMovieModalOpen] =
    useState<boolean>(false);
  const locale = useLocale();
  const t = useTranslations('HomeVideos');
  const isArabicLocale = locale === 'ar';

  const video1EmbedLink = convertYouTubeToEmbed(
    homepage.video1IframeLink?.trim(),
  );
  const video2EmbedLink = convertYouTubeToEmbed(
    homepage.video2IframeLink?.trim(),
  );

  // a video needs both its link and its thumbnail to be shown
  const showTeaser = Boolean(
    video1EmbedLink && homepage.video1Thumbnail?.trim(),
  );
  const showAfterMovie = Boolean(
    video2EmbedLink && homepage.video2Thumbnail?.trim(),
  );
  const showBoth = showTeaser && showAfterMovie;

  // the flag follows the text, not the page: a French title on /ar keeps its Latin font
  const pickTitle = (
    titleFr: string | undefined,
    titleAr: string | undefined,
    fallback: string,
  ) => {
    const arabicTitle = isArabicLocale ? titleAr?.trim() : '';
    if (arabicTitle) return { title: arabicTitle, titleIsArabic: true };
    const frenchTitle = titleFr?.trim();
    if (frenchTitle) return { title: frenchTitle, titleIsArabic: false };
    return { title: fallback, titleIsArabic: isArabicLocale };
  };

  const teaser = pickTitle(
    homepage.video1TitleFr,
    homepage.video1TitleAr,
    t('teaserFallback'),
  );
  const afterMovie = pickTitle(
    homepage.video2TitleFr,
    homepage.video2TitleAr,
    t('afterMovieFallback'),
  );

  // one block: the same sanitising and Arabic fallback as the other pages
  const { texts, backgroundImage, showBackground } = getLandingView(
    {
      text1Fr: homepage.textFr,
      text1Ar: homepage.textAr,
      backgroundImage: homepage.backgroundImage,
    },
    isArabicLocale,
  );

  return (
    <>
      <SubHeader banner={banner} />
      {showBackground && (
        <LandingFlow
          texts={texts}
          backgroundImage={backgroundImage}
          backgroundImageCredit={homepage.backgroundImageCredit}
          isArabic={isArabicLocale}
          topSpace={{ base: '60vh', lg: '15vh' }}
          flushTop
          anchor="bottom-start"
          flushBottom
          imagePosition="50% 80%"
          wideBlock
        />
      )}
      <PosterSection />
      {(showTeaser || showAfterMovie) && (
        <div
          className={cn(
            'grid grid-cols-1 items-start gap-8 mx-auto mt-16 lg:mt-24 mb-8 md:mb-10 xl:mb-12 px-4',
            showBoth ? 'lg:grid-cols-[1fr_1fr] max-w-[1100px]' : 'max-w-3xl',
          )}
        >
          {showTeaser && (
            <VideoCard
              {...teaser}
              thumbnail={homepage.video1Thumbnail}
              ariaLabel={t('playVideo', { title: teaser.title })}
              sizes={
                showBoth
                  ? '(min-width: 1024px) 465px, 100vw'
                  : '(min-width: 768px) 768px, 100vw'
              }
              featured
              onOpen={() => setIsTeaseModalOpen(true)}
            />
          )}
          {showAfterMovie && (
            <VideoCard
              {...afterMovie}
              thumbnail={homepage.video2Thumbnail}
              ariaLabel={t('playVideo', { title: afterMovie.title })}
              sizes={
                showBoth
                  ? '(min-width: 1024px) 465px, 100vw'
                  : '(min-width: 768px) 768px, 100vw'
              }
              onOpen={() => setIsAfterMovieModalOpen(true)}
            />
          )}
        </div>
      )}
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
