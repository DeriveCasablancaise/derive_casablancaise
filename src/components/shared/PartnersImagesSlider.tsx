'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { IPartner } from '@/lib/database/models/partner.model';

const SCROLL_AMOUNT = 150;
const ABSOLUTE_LEFT_OFFSET = -150;

interface PartnerSliderProps {
  partners: IPartner[];
}

type YearFilter = 'all' | '2022' | '2024';

const PartnersImagesSlider = ({ partners }: PartnerSliderProps) => {
  const container = useRef(null);
  const slider1Ref = useRef<HTMLDivElement>(null);
  const slider1ParentRef = useRef<HTMLDivElement>(null);
  const slider2Ref = useRef<HTMLDivElement>(null);
  const slider2ParentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const [x1Offset, setX1Offset] = useState(ABSOLUTE_LEFT_OFFSET + 300);
  const [x2Offset, setX2Offset] = useState(ABSOLUTE_LEFT_OFFSET + 150);

  const [maxScroll1, setMaxScroll1] = useState(0);
  const [maxScroll2, setMaxScroll2] = useState(0);

  const [yearFilter, setYearFilter] = useState<YearFilter>('all');

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [150, -20]);

  const locale = useLocale();
  const isArabic = locale === 'ar';

  const calculateMaxScroll = useCallback(
    (
      sliderRef: React.RefObject<HTMLDivElement>,
      parentRef: React.RefObject<HTMLDivElement>
    ) => {
      if (sliderRef.current && parentRef.current) {
        const sliderWidth = sliderRef.current.scrollWidth;
        const parentWidth = parentRef.current.clientWidth;

        const maxScrollValue =
          ABSOLUTE_LEFT_OFFSET - (sliderWidth - parentWidth);
        return Math.min(ABSOLUTE_LEFT_OFFSET, maxScrollValue);
      }
      return 0;
    },
    []
  );

  useEffect(() => {
    const updateMaxScrolls = () => {
      setMaxScroll1(calculateMaxScroll(slider1Ref, slider1ParentRef));
      setMaxScroll2(calculateMaxScroll(slider2Ref, slider2ParentRef));
    };

    updateMaxScrolls();
    window.addEventListener('resize', updateMaxScrolls);

    return () => {
      window.removeEventListener('resize', updateMaxScrolls);
    };
  }, [partners, calculateMaxScroll]);

  const handleScrollRight = (slider: 'slider1' | 'slider2') => {
    if (slider === 'slider1') {
      setX1Offset((prev) => Math.max(maxScroll1, prev - SCROLL_AMOUNT));
    } else {
      setX2Offset((prev) => Math.max(maxScroll2, prev - SCROLL_AMOUNT));
    }
  };

  const handleScrollLeft = (slider: 'slider1' | 'slider2') => {
    if (slider === 'slider1') {
      setX1Offset((prev) =>
        Math.min(ABSOLUTE_LEFT_OFFSET + 300, prev + SCROLL_AMOUNT * 2)
      );
    } else {
      setX2Offset((prev) =>
        Math.min(ABSOLUTE_LEFT_OFFSET + 150, prev + SCROLL_AMOUNT * 2)
      );
    }
  };

  const canScrollLeft = (slider: 'slider1' | 'slider2') => {
    const offset = slider === 'slider1' ? x1Offset : x2Offset;
    const initialOffsetForSlider =
      slider === 'slider1' ? ABSOLUTE_LEFT_OFFSET + 100 : ABSOLUTE_LEFT_OFFSET;
    return offset < initialOffsetForSlider;
  };

  const canScrollRight = (slider: 'slider1' | 'slider2') => {
    const offset = slider === 'slider1' ? x1Offset : x2Offset;
    const currentMaxScroll = slider === 'slider1' ? maxScroll1 : maxScroll2;
    return offset > currentMaxScroll;
  };

  const partners2022 = partners.filter((p) => p.yearOfPartnership === '2022');
  const partners2024 = partners.filter((p) => p.yearOfPartnership === '2024');

  const shouldShowSlider1 = yearFilter === 'all' || yearFilter === '2022';
  const shouldShowSlider2 = yearFilter === 'all' || yearFilter === '2024';

  const toggleYearFilter = (year: '2022' | '2024') => {
    if (yearFilter === year) {
      setYearFilter('all');
    } else {
      setYearFilter(year);
    }
  };

  return (
    <div
      ref={container}
      className={cn(
        'flex flex-col gap-[3vw] relative bg-[#E9EAEB] lg:mt-12 2xl:mt-24 z-[1]'
      )}
    >
      <div className="w-full hidden lg:flex flex-col gap-6 py-4 xl:py-8 text-center bg-[#E9EAEB] px-8">
        <h2
          className={cn(
            'text-2xl xl:text-4xl w-full text-[#ee7103]',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold'
          )}
        >
          {isArabic ? 'شركاء ديريف' : 'Nos Partenaires'}
        </h2>
      </div>

      {shouldShowSlider1 && partners2022.length > 0 && (
        <>
          <div
            className="relative items-center w-[120vw] hidden lg:flex"
            ref={slider1ParentRef}
          >
            <Button
              onClick={() => handleScrollLeft('slider1')}
              disabled={!canScrollLeft('slider1')}
              className={cn(
                'absolute z-10 bg-transparent hover:bg-transparent text-[#094142] px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
                isArabic ? 'right-0' : 'left-0'
              )}
            >
              <ChevronLeft
                className={cn('size-16', isArabic ? 'rotate-180' : '')}
              />
            </Button>
            <motion.div
              ref={slider1Ref}
              style={{ x: x1, translateX: x1Offset }}
              className={cn(
                'hidden md:flex relative gap-[3vw] w-[240vw]',
                isArabic ? 'right-[-10vw]' : 'left-[-10vw]'
              )}
            >
              {partners2022.map((partner, index) => (
                <div
                  key={index}
                  className={cn('size-[12vw] flex justify-center items-center')}
                  style={{
                    backgroundColor: '#094142',
                  }}
                >
                  <Link
                    href={partner.hrefLink || '#'}
                    target={partner.hrefLink ? '_blank' : undefined}
                    rel={partner.hrefLink ? 'noopener noreferrer' : undefined}
                    className="w-full h-full flex justify-center items-center group relative"
                  >
                    <div className={cn('relative size-full overflow-hidden')}>
                      <Image
                        fill={true}
                        alt={partner.frenchName}
                        src={partner.logoImage || '/placeholder.svg'}
                        className="object-cover object-center transition duration-700 group-hover:scale-110"
                      />
                      <div
                        dir={isArabic ? 'rtl' : 'ltr'}
                        className={cn(
                          'absolute bottom-2 text-xs text-white z-20',
                          isArabic
                            ? 'right-2 arabic-subtitle-bold'
                            : 'left-2 latin-subtitle-regular'
                        )}
                      >
                        {isArabic
                          ? partner.arabicName || partner.frenchName
                          : partner.frenchName}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent" />
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
            <Button
              onClick={() => handleScrollRight('slider1')}
              disabled={!canScrollRight('slider1')}
              className={cn(
                'absolute z-10 bg-transparent hover:bg-transparent text-[#094142] px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
                isArabic ? 'left-[20vw]' : 'right-[20vw]'
              )}
            >
              <ChevronRight
                className={cn('size-16', isArabic ? 'rotate-180' : '')}
              />
            </Button>
          </div>
        </>
      )}

      {shouldShowSlider2 && partners2024.length > 0 && (
        <>
          <div
            className="relative items-center w-[120vw] hidden lg:flex"
            ref={slider2ParentRef}
          >
            <Button
              onClick={() => handleScrollLeft('slider2')}
              disabled={!canScrollLeft('slider2')}
              className={cn(
                'absolute z-10 bg-transparent hover:bg-transparent text-[#094142] px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
                isArabic ? 'right-0' : 'left-0'
              )}
            >
              <ChevronLeft
                className={cn('size-16', isArabic ? 'rotate-180' : '')}
              />
            </Button>
            <motion.div
              ref={slider2Ref}
              style={{ x: x2, translateX: x2Offset }}
              className={cn(
                'hidden md:flex relative gap-[3vw] w-[240vw]',
                isArabic ? 'right-[-10vw]' : 'left-[-10vw]'
              )}
            >
              {partners2024.map((partner, index) => (
                <div
                  key={index}
                  className={cn('size-[12vw] flex justify-center items-center')}
                  style={{
                    backgroundColor: '#094142',
                  }}
                >
                  <Link
                    href={partner.hrefLink || '#'}
                    target={partner.hrefLink ? '_blank' : undefined}
                    rel={partner.hrefLink ? 'noopener noreferrer' : undefined}
                    className="w-full h-full flex justify-center items-center group relative"
                  >
                    <div className={cn('relative size-full overflow-hidden')}>
                      <Image
                        fill={true}
                        alt={partner.frenchName}
                        src={partner.logoImage || '/placeholder.svg'}
                        className="object-cover object-center transition duration-700 group-hover:scale-110"
                      />
                      <div
                        dir={isArabic ? 'rtl' : 'ltr'}
                        className={cn(
                          'absolute bottom-2 text-xs text-white z-20',
                          isArabic
                            ? 'right-2 arabic-subtitle-bold'
                            : 'left-2 latin-subtitle-regular'
                        )}
                      >
                        {isArabic
                          ? partner.arabicName || partner.frenchName
                          : partner.frenchName}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent" />
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
            <Button
              onClick={() => handleScrollRight('slider2')}
              disabled={!canScrollRight('slider2')}
              className={cn(
                'absolute z-10 bg-transparent hover:bg-transparent text-[#094142] px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
                isArabic ? 'left-[20vw]' : 'right-[20vw]'
              )}
            >
              <ChevronRight
                className={cn('size-16', isArabic ? 'rotate-180' : '')}
              />
            </Button>
          </div>
        </>
      )}

      <motion.div
        style={{ height }}
        className={cn('relative mt-24 bg-[#141516]')}
      >
        <div
          className={cn(
            'h-full md:h-[250%] w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-[1]'
          )}
          style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
        ></div>
      </motion.div>
    </div>
  );
};

export default PartnersImagesSlider;
