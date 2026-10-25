'use client';

import { cn } from '@/lib/utils';
import {
  motion,
  useTransform,
  useScroll,
  useReducedMotion,
} from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { fadeIn } from '@/variants';
import Image from 'next/image';

const jakarta = Plus_Jakarta_Sans({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

export type BackgroundFit = 'cover' | 'pan';

interface LandingFlowProps {
  texts: { n: number; html: string; rtl: boolean }[];
  backgroundImage: string;
  isArabic: boolean;
  fit?: BackgroundFit;
  // empty image area above the first block, below lg and from lg
  topSpace?: { base: string; lg: string };
  // drops the section's own top margin from lg
  flushTop?: boolean;
  // 'bottom-start': one block in the bottom start corner of the image
  anchor?: 'default' | 'bottom-start';
  // no bottom padding: the last block ends exactly where the image track ends
  flushBottom?: boolean;
}

// The image is a sticky full-screen layer, not absolute inset-0: the section can
// be several screens tall, and a cover image stretched over all of it would be
// cropped to a thin strip. Sticky keeps the whole picture in view between blocks.
export const LandingFlow = ({
  texts,
  backgroundImage,
  isArabic,
  fit = 'cover',
  topSpace = { base: '4rem', lg: '70vh' },
  flushTop = false,
  anchor = 'default',
  flushBottom = false,
}: LandingFlowProps) => {
  const corner = anchor === 'bottom-start';
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // transform only. Small screens and reduced motion keep a fixed scale,
  // and the translate stays inside what the scale leaves as margin
  const pan = fit === 'pan';
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    pan || reduceMotion ? [1, 1] : isDesktop ? [1, 1.15] : [1.08, 1.08],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    pan || reduceMotion
      ? ['0%', '0%']
      : isDesktop
        ? ['0%', '-5%']
        : ['0%', '-3%'],
  );
  // pan: the visible part of the image moves from its top to its bottom,
  // nothing is scaled so no edge shows. Reduced motion stays on the top
  const panY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ['0%', '0%'] : ['0%', '100%'],
  );

  const hasImage = Boolean(backgroundImage);
  const dir = isArabic ? 'rtl' : 'ltr';

  return (
    <section
      ref={sectionRef}
      data-scroll-section=""
      dir={dir}
      className={cn(
        // own stacking context and clipped: nothing of the image paints outside
        // (overflow clip, not hidden, so the sticky layer still works)
        'relative isolate overflow-clip bg-[#E9EAEB] border-b-2',
        !flushTop && 'lg:mt-[10vh]',
        hasImage
          ? flushBottom
            ? 'pb-0'
            : corner
              ? 'pb-4 md:pb-8 lg:pb-[5vh]'
              : 'pb-16 lg:pb-[10vh]'
          : 'pb-0',
      )}
    >
      {hasImage && (
        // the track is as tall as the wrapper and the sticky layer lives inside it,
        // so the layer cannot move past the last block
        <div aria-hidden className="absolute inset-0 z-0">
          <div className="sticky top-0 h-full max-h-screen overflow-hidden">
            <motion.div
              style={
                pan
                  ? ({ '--pan-y': panY } as React.CSSProperties)
                  : { scale, y }
              }
              className="relative h-full w-full will-change-transform"
            >
              <Image
                src={backgroundImage}
                alt=""
                fill
                sizes="100vw"
                priority={false}
                className={cn(
                  'object-cover',
                  pan && '[object-position:50%_var(--pan-y)]',
                )}
              />
            </motion.div>
          </div>
        </div>
      )}
      <div
        style={
          {
            '--top-space': topSpace.base,
            '--top-space-lg': topSpace.lg,
          } as React.CSSProperties
        }
        className={cn(
          'relative z-10 flex flex-col',
          hasImage
            ? 'gap-16 pt-[var(--top-space)] lg:gap-[20vh] lg:pt-[var(--top-space-lg)]'
            : 'gap-8 py-8 lg:gap-12 lg:py-16',
        )}
      >
        {texts.map(({ n, html, rtl }, i) => {
          const atStart = i % 2 === 0;
          // slides in from the side it sits on, the sides flip with the locale
          const fromLeft = atStart !== isArabic;
          return (
            <motion.div
              key={n}
              dir={rtl ? 'rtl' : 'ltr'}
              variants={fadeIn(fromLeft ? 'right' : 'left', 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className={cn(
                // below lg the block is inset and centred with a readable line length,
                // from lg up it keeps the 60% side-aligned box
                'landing-flow-block w-[calc(100%-2rem)] md:w-[calc(100%-5rem)] md:max-w-2xl lg:max-w-none lg:w-[60%] bg-white/70 lg:bg-[#E9EAEB] py-4 lg:py-6 px-4 lg:px-6 text-[#00b0db] md:text-black/90',
                // start side follows the locale, inset from the image edges
                corner
                  ? 'self-start mx-4 md:mx-10 lg:mx-[5vw] max-w-xl lg:w-[45%]'
                  : atStart
                    ? 'self-center lg:self-start'
                    : 'self-center lg:self-end',
                rtl ? 'text-right' : 'text-left',
              )}
            >
              <div
                className={cn(
                  'w-full font-bold text-[#094142] m-0 tiptap-content',
                  rtl
                    ? 'arabic-text-bold text-xl lg:text-2xl'
                    : cn('text-sm md:text-base lg:text-sm', jakarta.className),
                )}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
