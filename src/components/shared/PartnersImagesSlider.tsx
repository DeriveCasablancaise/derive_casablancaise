'use client';

import {
  useScroll,
  useTransform,
  motion,
  useMotionValue,
  animate,
} from 'framer-motion';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { IPartner } from '@/lib/database/models/partner.model';
import ClientWrapper from './PostWrapper';

interface PartnerSliderProps {
  partners: IPartner[];
}

type YearFilter = 'all' | '2022' | '2024';
const SCROLL_AMOUNT = 300;

const PartnersImagesSlider = ({ partners }: PartnerSliderProps) => {
  const container = useRef(null);
  const [yearFilter, setYearFilter] = useState<YearFilter>('all');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [150, 0]);

  const partners2022 = partners.filter((p) => p.yearOfPartnership === '2022');
  const partners2024 = partners.filter((p) => p.yearOfPartnership === '2024');

  const shouldShowSlider1 = yearFilter === 'all' || yearFilter === '2022';
  const shouldShowSlider2 = yearFilter === 'all' || yearFilter === '2024';

  return (
    <ClientWrapper>
      <div
        ref={container}
        className="flex flex-col gap-12 relative bg-[#E9EAEB] lg:mt-12 2xl:mt-24 z-[1] pb-24"
      >
        <div className="w-full hidden lg:flex flex-col gap-6 py-4 xl:py-8 text-center bg-[#E9EAEB] px-8">
          <h2
            className={cn(
              'text-2xl xl:text-4xl w-full text-[#ee7103]',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold',
            )}
          >
            {isArabic
              ? ' الشركاء الذين دعمونا'
              : 'Les partenaires qui nous ont accompagnés'}
          </h2>
        </div>

        <div className="flex flex-col gap-16 px-4 md:px-0">
          {shouldShowSlider1 && partners2022.length > 0 && (
            <SliderInstance
              partners={partners2022}
              isArabic={isArabic}
              title="2022"
            />
          )}

          {shouldShowSlider2 && partners2024.length > 0 && (
            <SliderInstance
              partners={partners2024}
              isArabic={isArabic}
              title="2024"
            />
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
  title: string;
}

const SliderInstance = ({ partners, isArabic, title }: SliderInstanceProps) => {
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
  }, [partners]);

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
          className="flex w-max gap-6 md:gap-8 items-center"
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              // UPDATED: Changed bg-color to white, added rounded-xl and subtle shadow
              className="relative shrink-0 flex justify-center items-center bg-[#E9EAEB] h-24 w-36 md:h-32 md:w-48 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group/card "
            >
              <Link
                href={partner.hrefLink || '#'}
                target={partner.hrefLink ? '_blank' : undefined}
                rel={partner.hrefLink ? 'noopener noreferrer' : undefined}
                className="w-full h-full flex justify-center items-center relative"
              >
                {/* UPDATED: Increased padding (p-6) so logos don't touch edges */}
                <div className="relative w-full h-full p-6">
                  <Image
                    fill
                    alt={partner.frenchName}
                    src={partner.logoImage || '/placeholder.svg'}
                    className="object-contain p-1 transition-all duration-500 group-hover/card:scale-110"
                  />
                </div>

                {/* UPDATED: Changed gradient to black since background is now white */}
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
        </motion.div>
      </div>
    </div>
  );
};

export default PartnersImagesSlider;
