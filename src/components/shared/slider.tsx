'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { IArtist } from '@/lib/database/models/artist.model';

const SCROLL_AMOUNT = 150;
const MAX_SCROLL = -300;
const INITIAL_OFFSET = 150; // Added initial offset

interface SlidingImagesProps {
  artists: IArtist[];
}

const SlidingImages = ({ artists }: SlidingImagesProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const [x1Offset, setX1Offset] = useState(INITIAL_OFFSET + 150);
  const [x2Offset, setX2Offset] = useState(INITIAL_OFFSET + 150);

  const x1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const height = useTransform(scrollYProgress, [0, 0.9], [150, -20]);

  const locale = useLocale();
  const isArabic = locale === 'ar';

  const t = useTranslations('HomePage.Community');

  const handleScrollRight = (slider: 'slider1' | 'slider2') => {
    if (slider === 'slider1') {
      setX1Offset((prev) => Math.max(MAX_SCROLL, prev - SCROLL_AMOUNT));
    } else {
      setX2Offset((prev) => Math.max(MAX_SCROLL, prev - SCROLL_AMOUNT));
    }
  };

  const handleScrollLeft = (slider: 'slider1' | 'slider2') => {
    if (slider === 'slider1') {
      setX1Offset((prev) => Math.min(150, prev + SCROLL_AMOUNT * 2));
    } else {
      setX2Offset((prev) => Math.max(150, prev + SCROLL_AMOUNT * 2));
    }
  };

  const canScrollLeft = (slider: 'slider1' | 'slider2') => {
    const offset =
      slider === 'slider1'
        ? x1Offset - INITIAL_OFFSET
        : x2Offset - INITIAL_OFFSET * 2;
    return offset < 0;
  };

  const canScrollRight = (slider: 'slider1' | 'slider2') => {
    const offset = slider === 'slider1' ? x1Offset : x2Offset;
    return offset > MAX_SCROLL;
  };

  // Split artists into two sliders
  const slider1Artists = artists.slice(0, 4);
  const slider2Artists = artists.slice(4, 8);

  return (
    <div
      ref={container}
      className={cn(
        'flex flex-col gap-[3vw] relative bg-[#E9EAEB] md:mt-16 z-[1]'
      )}
    >
      <div className="w-full hidden md:flex py-4 xl:py-8 text-start bg-[#E9EAEB] px-8 xl:px-[100px] ">
        <Link
          href={`/${locale}/community`}
          className={cn(
            'text-2xl md:text-4xl text-[#ee7103] hover:scale-110 transition-all duration-300',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold'
          )}
        >
          {t('heading')}
        </Link>
      </div>
      {/* Slider 1 */}
      <div className="relative items-center w-[120vw] hidden md:flex">
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
          style={{ x: x1, translateX: x1Offset }}
          className={cn(
            'hidden md:flex relative gap-[3vw] w-[120vw]',
            isArabic ? 'right-[-10vw]' : 'left-[-10vw]'
          )}
        >
          {slider1Artists.map((artist, index) => (
            <div
              key={index}
              className={cn(
                'w-1/4 size-[22vw] flex justify-center items-center'
              )}
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
              }}
            >
              <Link
                href={`/${locale}/community/${artist._id}`}
                className="w-full h-full flex justify-center items-center group p-2 relative"
              >
                <div className={cn('relative size-full overflow-hidden')}>
                  <Image
                    fill={true}
                    alt={'image'}
                    src={artist.images[0]}
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className={cn(
                      'absolute bottom-2 text-lg text-white z-20',
                      isArabic
                        ? 'right-2 arabic-subtitle-bold'
                        : 'left-2 latin-subtitle-bold'
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
      {/* Slider 2 */}
      <div className="relative hidden md:flex items-center mt-8 w-[120vw]">
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
              className={cn(
                'w-1/4 size-[22vw] flex justify-center items-center'
              )}
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
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
                    src={artist.images[0]}
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div
                    dir={isArabic ? 'rtl' : 'ltr'}
                    className={cn(
                      'absolute bottom-2 text-lg text-white z-20',
                      isArabic
                        ? 'right-2 arabic-subtitle-bold'
                        : 'left-2 latin-subtitle-bold'
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
      </div>
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
