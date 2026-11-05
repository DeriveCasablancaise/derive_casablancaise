'use client';

import { animate, motion, useMotionValue } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SCROLL_AMOUNT = 300;

interface SliderRowProps {
  isArabic: boolean;
  children: React.ReactNode;
}

interface ArrowProps {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Arrow = ({ label, disabled, onClick, children }: ArrowProps) => (
  // aria-disabled instead of disabled, so keyboard focus stays when the end is reached
  <button
    type="button"
    aria-label={label}
    aria-disabled={disabled}
    onClick={disabled ? undefined : onClick}
    className={cn(
      'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-chrome-active shadow-md transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-chrome-active focus-visible:ring-offset-2 focus-visible:ring-offset-[#E9EAEB]',
      disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
    )}
  >
    {children}
  </button>
);

const SliderRow = ({ isArabic, children }: SliderRowProps) => {
  const t = useTranslations('SliderControls');
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxScroll = useRef(0);
  const x = useMotionValue(0);
  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  // In Arabic the track starts on the right, so it travels the other way.
  const travel = isArabic ? 1 : -1;
  const itemCount = React.Children.count(children);

  useEffect(() => {
    const syncArrows = (position: number) => {
      setCanGoPrevious(position > 0.5);
      setCanGoNext(position < maxScroll.current - 0.5);
    };

    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return;

      const overflow =
        trackRef.current.scrollWidth - viewportRef.current.offsetWidth;
      maxScroll.current = overflow < 0 ? 0 : overflow + 40;

      // a wider window can leave the track past its new end
      const position = Math.min(
        Math.max(x.get() * travel, 0),
        maxScroll.current,
      );
      x.set(position * travel);
      syncArrows(position);
    };

    measure();
    window.addEventListener('resize', measure);
    const unsubscribe = x.on('change', (latest) => syncArrows(latest * travel));

    return () => {
      window.removeEventListener('resize', measure);
      unsubscribe();
    };
  }, [x, travel, itemCount]);

  const slide = (step: 1 | -1) => {
    const position = x.get() * travel + step * SCROLL_AMOUNT;
    const target = Math.min(Math.max(position, 0), maxScroll.current);

    animate(x, target * travel, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    // z-10 keeps the row above the curved block at the bottom of the partners section
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 md:px-2"
    >
      <Arrow
        label={t('previous')}
        disabled={!canGoPrevious}
        onClick={() => slide(-1)}
      >
        {isArabic ? (
          <ChevronRight className="h-6 w-6" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
      </Arrow>

      <div ref={viewportRef} className="overflow-hidden px-4">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-center"
        >
          {children}
        </motion.div>
      </div>

      <Arrow label={t('next')} disabled={!canGoNext} onClick={() => slide(1)}>
        {isArabic ? (
          <ChevronLeft className="h-6 w-6" />
        ) : (
          <ChevronRight className="h-6 w-6" />
        )}
      </Arrow>
    </div>
  );
};

export default SliderRow;
