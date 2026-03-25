'use client';
import {
  useScroll,
  useTransform,
  motion,
  useMotionValue,
  animate,
} from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { IArtist } from '@/lib/database/models/artist.model';

const SCROLL_AMOUNT = 300;

interface SlidingImagesProps {
  artists: IArtist[];
}

const SlidingImages = ({ artists }: SlidingImagesProps) => {
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
        'flex flex-col gap-[3vw] relative bg-[#E9EAEB] lg:mt-12 2xl:mt-48 z-[1] ',
      )}
    >
      <div className="w-full hidden lg:flex py-4 xl:py-8 text-start bg-[#E9EAEB]">
        <h2
          className={cn(
            'text-xl lg:text-3xl w-full text-[#ee7103] text-center',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold',
          )}
        >
          {t('heading')}
        </h2>
      </div>

      <div className="flex flex-col gap-16 px-4 md:px-0">
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
}: ArtistSliderInstanceProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [constraints, setConstraints] = useState({ min: 0, max: 0 });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !containerRef.current) return;

      const trackWidth = trackRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;

      if (trackWidth < containerWidth) {
        setConstraints({ min: 0, max: 0 });
        setCanScrollRight(false);
        setCanScrollLeft(false);
      } else {
        const maxScroll = -(trackWidth - containerWidth + 40);
        setConstraints({ min: 0, max: maxScroll });
        setCanScrollRight(true);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [artists]);

  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      setCanScrollLeft(latest < 0);
      setCanScrollRight(latest > constraints.max);
    });
    return () => unsubscribe();
  }, [x, constraints]);

  const handleSlide = (direction: 'left' | 'right') => {
    const currentX = x.get();
    let newX;

    if (direction === 'left') {
      newX = Math.min(currentX + SCROLL_AMOUNT, 0);
    } else {
      newX = Math.max(currentX - SCROLL_AMOUNT, constraints.max);
    }

    animate(x, newX, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto group">
      <Button
        onClick={() => handleSlide(isArabic ? 'right' : 'left')}
        disabled={isArabic ? !canScrollRight : !canScrollLeft}
        variant="ghost"
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white text-[#094142] border border-[#094142]/20 disabled:opacity-0 transition-opacity duration-300',
          isArabic ? 'right-2 md:-right-12' : 'left-2 md:-left-12',
        )}
      >
        <ChevronLeft className={cn('h-8 w-8', isArabic && 'rotate-180')} />
      </Button>

      <Button
        onClick={() => handleSlide(isArabic ? 'left' : 'right')}
        disabled={isArabic ? !canScrollLeft : !canScrollRight}
        variant="ghost"
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white text-[#094142] border border-[#094142]/20 disabled:opacity-0 transition-opacity duration-300',
          isArabic ? 'left-2 md:-left-12' : 'right-2 md:-right-12',
        )}
      >
        <ChevronRight className={cn('h-8 w-8', isArabic && 'rotate-180')} />
      </Button>

      <div ref={containerRef} className="overflow-hidden w-full px-4" dir="ltr">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max gap-[3vw] items-center"
        >
          {artists.map((artist, index) => (
            <div
              key={index}
              className={cn(
                'shrink-0 size-32 md:size-48 lg:size-[12vw] flex justify-center items-center',
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
                  <Image
                    fill={true}
                    alt={'image'}
                    src={artist.images[0] || '/placeholder.svg'}
                    className="object-cover object-center transition duration-700 group-hover:scale-110"
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
        </motion.div>
      </div>
    </div>
  );
};

export default SlidingImages;
