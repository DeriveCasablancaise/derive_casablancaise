'use client';

import { cn, convertYouTubeToEmbed } from '@/lib/utils';
import React, { useState } from 'react';
import SubHeader from './SubHeader';
import { useLocale, useTranslations } from 'next-intl';
import VideoCard from './VideoCard';
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
            showBoth ? 'lg:grid-cols-2 max-w-[1100px]' : 'max-w-3xl',
          )}
        >
          {showTeaser && (
            <VideoCard
              {...teaser}
              thumbnail={homepage.video1Thumbnail}
              ariaLabel={t('playVideo', { title: teaser.title })}
              sizes={
                showBoth
                  ? '(min-width: 1024px) 534px, 100vw'
                  : '(min-width: 768px) 768px, 100vw'
              }
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
                  ? '(min-width: 1024px) 534px, 100vw'
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
