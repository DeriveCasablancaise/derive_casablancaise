'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { IArtist } from '@/lib/database/models/artist.model';

const SCROLL_AMOUNT = 150;
const ABSOLUTE_LEFT_OFFSET = -150; // The absolute leftmost position for the slider content

interface SlidingImagesProps {
  artists: IArtist[];
}

const SlidingImages = ({ artists }: SlidingImagesProps) => {
  const container = useRef(null);
  const slider1Ref = useRef<HTMLDivElement>(null); // Ref for the motion.div (the actual scrollable content)
  const slider1ParentRef = useRef<HTMLDivElement>(null); // Ref for the visible container of slider1

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  // Initial offsets as per original code
  const [x1Offset, setX1Offset] = useState(ABSOLUTE_LEFT_OFFSET + 300);
  const [x2Offset, setX2Offset] = useState(ABSOLUTE_LEFT_OFFSET + 150);

  // Dynamic max scroll for slider 1
  const [maxScroll1, setMaxScroll1] = useState(0);
  const [maxScroll2, setMaxScroll2] = useState(0);

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [150, -20]);

  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage.Community');

  // Calculate the maximum scroll offset dynamically
  const calculateMaxScroll = useCallback(
    (
      sliderRef: React.RefObject<HTMLDivElement>,
      parentRef: React.RefObject<HTMLDivElement>
    ) => {
      if (sliderRef.current && parentRef.current) {
        const sliderWidth = sliderRef.current.scrollWidth; // Total width of the content inside the slider
        const parentWidth = parentRef.current.clientWidth; // Visible width of the container

        // The maximum negative translation needed to show the last item
        // This is calculated relative to the ABSOLUTE_LEFT_OFFSET
        const maxScrollValue =
          ABSOLUTE_LEFT_OFFSET - (sliderWidth - parentWidth);
        // Ensure maxScrollValue doesn't go above ABSOLUTE_LEFT_OFFSET if content is smaller than visible area
        return Math.min(ABSOLUTE_LEFT_OFFSET, maxScrollValue);
      }
      return 0; // Default or fallback
    },
    []
  );

  useEffect(() => {
    const updateMaxScrolls = () => {
      setMaxScroll1(calculateMaxScroll(slider1Ref, slider1ParentRef));
      // If slider2 is uncommented, you would add: setMaxScroll2(calculateMaxScroll(slider2Ref, slider2ParentRef));
    };

    updateMaxScrolls(); // Calculate on mount
    window.addEventListener('resize', updateMaxScrolls); // Recalculate on resize

    return () => {
      window.removeEventListener('resize', updateMaxScrolls);
    };
  }, [artists, calculateMaxScroll]); // Recalculate if artists array changes

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
      ); // Original multiplier for left scroll
    } else {
      setX2Offset((prev) =>
        Math.min(ABSOLUTE_LEFT_OFFSET + 150, prev + SCROLL_AMOUNT * 2)
      ); // Original multiplier for left scroll
    }
  };

  const canScrollLeft = (slider: 'slider1' | 'slider2') => {
    const offset = slider === 'slider1' ? x1Offset : x2Offset;
    const initialOffsetForSlider =
      slider === 'slider1'
        ? ABSOLUTE_LEFT_OFFSET + 300
        : ABSOLUTE_LEFT_OFFSET + 150;
    return offset < initialOffsetForSlider;
  };

  const canScrollRight = (slider: 'slider1' | 'slider2') => {
    const offset = slider === 'slider1' ? x1Offset : x2Offset;
    const currentMaxScroll = slider === 'slider1' ? maxScroll1 : maxScroll2;
    return offset > currentMaxScroll;
  };

  // Split artists into two sliders
  const slider1Artists = artists.slice(0, 16);
  const slider2Artists = artists.slice(8, 16); // This slice might be problematic if artists.length < 16

  return (
    <div
      ref={container}
      className={cn(
        'flex flex-col gap-[3vw] relative bg-[#E9EAEB] lg:mt-12 2xl:mt-48 z-[1] '
      )}
    >
      <div className="w-full hidden lg:flex py-4 xl:py-8 text-start bg-[#E9EAEB]">
        <h2
          className={cn(
            'text-xl lg:text-3xl w-full text-[#ee7103] text-center',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold'
          )}
        >
          {t('heading')}
        </h2>
      </div>
      {/* Slider 1 */}
      <div
        className="relative items-center w-[120vw] hidden lg:flex"
        ref={slider1ParentRef}
      >
        <Button
          onClick={() => handleScrollLeft('slider1')}
          disabled={!canScrollLeft('slider1')}
          className={cn(
            'absolute z-10 bg-transparent hover:bg-transparent text-white px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
            isArabic ? 'right-0' : 'left-0'
          )}
        >
          <ChevronLeft
            className={cn('size-16', isArabic ? 'rotate-180' : '')}
          />
        </Button>
        <motion.div
          ref={slider1Ref} // Attach ref here
          style={{ x: x1, translateX: x1Offset }}
          className={cn(
            'hidden md:flex relative gap-[3vw] w-[240vw]',
            isArabic ? 'right-[-10vw]' : 'left-[-10vw]'
          )}
        >
          {slider1Artists.map((artist, index) => (
            <div
              key={index}
              className={cn(' size-[12vw] flex justify-center items-center')}
              style={{
                backgroundColor: '#094142',
              }}
            >
              <Link
                href={`/${locale}/community/${artist._id}`}
                className="w-full h-full flex justify-center items-center group p-1 relative"
              >
                <div className={cn('relative size-full overflow-hidden')}>
                  <Image
                    fill={true}
                    alt={'image'}
                    src={artist.images[0] || '/placeholder.svg'}
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
                    {isArabic ? artist.arabicName : artist.frenchName}
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
            'absolute z-10 bg-transparent hover:bg-transparent text-white px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
            isArabic ? 'left-[20vw]' : 'right-[20vw]'
          )}
        >
          <ChevronRight
            className={cn('size-16', isArabic ? 'rotate-180' : '')}
          />
        </Button>
      </div>
      {/* Slider 2 (commented out in original, keeping it commented) */}
      {/* <div className="relative hidden md:flex items-center mt-8 w-[120vw]">
        <Button
          onClick={() => handleScrollLeft('slider2')}
          disabled={!canScrollLeft('slider2')}
          className={cn(
            'absolute z-10 bg-transparent hover:bg-transparent text-white px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
            isArabic ? 'right-0' : 'left-0'
          )}
        >
          <ChevronLeft
            className={cn('size-16', isArabic ? 'rotate-180' : '')}
          />
        </Button>
        <motion.div
          style={{ x: x2, translateX: x2Offset }}
          className={cn(
            'hidden md:flex relative gap-[3vw] w-[120vw]',
            isArabic ? 'right-[-10vw]' : 'left-[-10vw]'
          )}
        >
          {slider2Artists.map((artist, index) => (
            <div
              key={index}
              className={cn('size-[12vw] flex justify-center items-center')}
              style={{
                backgroundColor: '#094142',
              }}
            >
              <Link
                href={`/${locale}/community/${artist._id}`}
                className="w-full h-full flex justify-center items-center group p-2"
              >
                <div className={cn('relative size-full overflow-hidden')}>
                  <Image
                    fill={true}
                    alt={'image'}
                    src={artist.images[0] || "/placeholder.svg"}
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className={cn(
                      'absolute bottom-2 text-lg text-white z-20',
                      isArabic
                        ? 'right-2 arabic-subtitle-bold'
                        : 'left-2 latin-subtitle-regular'
                    )}
                  >
                    {isArabic ? artist.arabicName : artist.frenchName}
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
            'absolute z-10 bg-transparent hover:bg-transparent text-white px-4 py-2 rounded-md mx-4 disabled:opacity-50 disabled:cursor-not-allowed',
            isArabic ? 'left-[20vw]' : 'right-[20vw]'
          )}
        >
          <ChevronRight
            className={cn('size-16', isArabic ? 'rotate-180' : '')}
          />
        </Button>
      </div> */}
      <motion.div
        style={{ height }}
        className={cn('relative mt-24 bg-[#141516]')}
      >
        <div
          className={cn(
            'h-full md:h-[250%] w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-[1] '
          )}
          style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
        ></div>
      </motion.div>
    </div>
  );
};

export default SlidingImages;
