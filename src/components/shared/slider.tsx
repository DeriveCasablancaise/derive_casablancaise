'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { FallbackImage } from './ImageFallback';
import Link from 'next/link';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { IArtist } from '@/lib/database/models/artist.model';
import SliderRow from './SliderRow';
import type { EditionYear } from '@/constants/editions';

interface SlidingImagesProps {
  artists: IArtist[];
  // set while that edition is not over yet
  currentEdition?: EditionYear;
}

const SlidingImages = ({ artists, currentEdition }: SlidingImagesProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [150, -20]);

  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage.Community');

  return (
    <div
      ref={container}
      className={cn(
        'flex flex-col relative bg-[#E9EAEB] lg:mt-12 2xl:mt-48 z-[1] ',
      )}
    >
      <div className="w-full hidden lg:flex lg:mb-[3vw] py-4 xl:py-8 text-start bg-[#E9EAEB]">
        <h2
          className={cn(
            'text-xl lg:text-3xl w-full text-brand-title text-center',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold',
          )}
        >
          <Link
            // the past wording names no edition, so it opens the unfiltered page
            href={
              currentEdition
                ? `/${locale}/community?edition=${currentEdition}`
                : `/${locale}/community`
            }
            className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#094142]"
          >
            {currentEdition
              ? t('headingEdition', { year: currentEdition })
              : t('heading')}
          </Link>
        </h2>
      </div>

      <div className="flex flex-col mb-[3vw] px-4 md:px-0">
        {artists.length > 0 && (
          <ArtistSliderInstance
            artists={artists}
            isArabic={isArabic}
            locale={locale}
          />
        )}
      </div>

      <motion.div
        style={{ height }}
        className={cn('relative mt-24 bg-[#141516]')}
      >
        <div
          className={cn(
            'h-full md:h-[250%] w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-[1] ',
          )}
          style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
        ></div>
      </motion.div>
    </div>
  );
};

// --- Reusable Slider Logic for Artists ---

interface ArtistSliderInstanceProps {
  artists: IArtist[];
  isArabic: boolean;
  locale: string;
}

const ArtistSliderInstance = ({
  artists,
  isArabic,
  locale,
}: ArtistSliderInstanceProps) => (
  <SliderRow isArabic={isArabic}>
    {artists.map((artist, index) => (
      <div
        key={index}
        className={cn(
          'shrink-0 size-32 md:size-48 lg:size-[12vw] flex justify-center items-center',
          isArabic ? 'ml-[3vw] last:ml-0' : 'mr-[3vw] last:mr-0',
        )}
        style={{
          backgroundColor: '#094142',
        }}
      >
        <Link
          href={`/${locale}/community/${artist._id}`}
          className="w-full h-full flex justify-center items-center group p-1 relative"
        >
          <div className={cn('relative size-full overflow-hidden')}>
            <FallbackImage
              alt={'image'}
              src={artist.images?.[0]}
              className="object-contain object-center"
            />
            <div
              dir={isArabic ? 'rtl' : 'ltr'}
              className={cn(
                'absolute bottom-2 text-xs md:text-sm text-white z-20',
                isArabic
                  ? 'right-2 arabic-subtitle-bold'
                  : 'left-2 latin-subtitle-regular',
              )}
            >
              {isArabic ? artist.arabicName : artist.frenchName}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent" />
          </div>
        </Link>
      </div>
    ))}
  </SliderRow>
);

export default SlidingImages;
