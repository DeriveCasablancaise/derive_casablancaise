'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { IPartner } from '@/lib/database/models/partner.model';
import ClientWrapper from './PostWrapper';
import SliderRow from './SliderRow';
import type { EditionYear } from '@/constants/editions';

interface PartnerSliderProps {
  partners: IPartner[];
  // set while that edition is not over yet
  currentEdition?: EditionYear;
}

const PartnersImagesSlider = ({
  partners,
  currentEdition,
}: PartnerSliderProps) => {
  const container = useRef(null);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('PartnersSlider');

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [150, 0]);

  return (
    <ClientWrapper>
      <div
        ref={container}
        className="flex flex-col relative bg-[#E9EAEB] lg:mt-12 2xl:mt-24 z-[1] pb-24"
      >
        <div className="w-full hidden lg:flex flex-col lg:mb-12 py-4 xl:py-8 text-center bg-[#E9EAEB] px-8">
          <h2
            className={cn(
              'text-2xl xl:text-4xl w-full text-brand-title',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold',
            )}
          >
            {currentEdition
              ? t('headingEdition', { year: currentEdition })
              : t('heading')}
          </h2>
        </div>

        {/* WE NOW RENDER JUST ONE SLIDER INSTANCE WITH THE PASSED PARTNERS */}
        <div className="flex flex-col px-4 md:px-0">
          {partners.length > 0 && (
            <SliderInstance partners={partners} isArabic={isArabic} />
          )}
        </div>

        <motion.div
          style={{ height }}
          className="absolute bottom-0 w-full bg-[#141516] z-0 overflow-hidden"
        >
          <div
            className="h-[300%] w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute top-0"
            style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
          ></div>
        </motion.div>
      </div>
    </ClientWrapper>
  );
};

// --- Reusable Slider Logic ---

interface SliderInstanceProps {
  partners: IPartner[];
  isArabic: boolean;
}

const SliderInstance = ({ partners, isArabic }: SliderInstanceProps) => (
  <SliderRow isArabic={isArabic}>
    {partners.map((partner, index) => (
      <div
        key={index}
        className={cn(
          'relative shrink-0 flex justify-center items-center bg-[#E9EAEB] h-24 w-36 md:h-32 md:w-48 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group/card',
          isArabic ? 'ml-6 md:ml-8 last:ml-0' : 'mr-6 md:mr-8 last:mr-0',
        )}
      >
        <Link
          href={partner.hrefLink || '#'}
          target={partner.hrefLink ? '_blank' : undefined}
          rel={partner.hrefLink ? 'noopener noreferrer' : undefined}
          className="w-full h-full flex justify-center items-center relative"
        >
          {/* Multiply turns white into the card's grey. The white backing
              gives transparent logos something to screen against,
              otherwise the overlay shows as a solid orange box. */}
          <div className="relative w-full h-full p-6 bg-white isolate mix-blend-multiply">
            <Image
              fill
              alt={partner.frenchName}
              src={partner.logoImage || '/placeholder.svg'}
              className={cn(
                'object-contain p-1 transition-all duration-500 group-hover/card:scale-110',
                // written out because Tailwind's filter utilities force
                // their own order, with invert last
                partner.invertLogo
                  ? '[filter:invert(1)_grayscale(1)_contrast(1.3)]'
                  : '[filter:grayscale(1)_contrast(1.3)]',
              )}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-brand-title mix-blend-screen pointer-events-none"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <span
              className={cn(
                'text-white text-xs font-semibold w-full',
                isArabic
                  ? 'text-right arabic-subtitle-bold'
                  : 'text-left latin-subtitle-regular',
              )}
            >
              {isArabic
                ? partner.arabicName || partner.frenchName
                : partner.frenchName}
            </span>
          </div>
        </Link>
      </div>
    ))}
  </SliderRow>
);

export default PartnersImagesSlider;
