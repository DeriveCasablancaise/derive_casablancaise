'use client';

import { cn, descOpacity, descSlideUp } from '../../lib/utils';
import { useInView, motion, useScroll, useTransform } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import React, { useRef } from 'react';

const Transmission = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('AboutPage');

  const container = useRef(null);
  const sectionRef = useRef(null);
  const text1Ref = useRef(null);

  const isInView = useInView(container);
  const isInView1 = useInView(text1Ref);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const height = useTransform(scrollYProgress, [0, 0.9], ['200px', '0px']);

  return (
    <section className="about-services z-10">
      <div className="container z-30" ref={container}>
        <div className="row border-b border-gray-500  ">
          <div className="flex-col ">
            <motion.h2
              variants={descSlideUp}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'text-4xl  md:text-6xl font-bold bg-clip-text py-6 text-transparent bg-gradient-to-b from-[#696443] to-[#696443]/40',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {t('Transmission.title')}
              <span className="animate-dot bg-clip-text py-6 text-transparent bg-gradient-to-b from-[#696443] to-[#696443]/40 mx-1">
                .
              </span>
              <span className="animate-dot bg-clip-text py-6 text-transparent bg-gradient-to-b from-[#696443] to-[#696443]/40 mx-1 ">
                .
              </span>
              <span className="animate-dot bg-clip-text py-6 text-transparent bg-gradient-to-b from-[#696443] to-[#696443]/40 mx-1">
                .
              </span>
            </motion.h2>
          </div>
        </div>
        <div className="row">
          <div className="flex-col" ref={container}>
            <div className="w-full my-8 md:my-16">
              <motion.p
                ref={text1Ref}
                variants={descOpacity}
                animate={isInView1 ? 'open' : 'closed'}
                data-scroll=""
                data-scroll-speed="-1"
                data-scroll-position="top"
                data-scroll-offset="0%, -50%"
                className={cn(
                  'my-4 md:my-6',
                  isArabic
                    ? 'arabic-text-regular text-2xl'
                    : 'latin-text-medium text-xl'
                )}
              >
                {t('Transmission.description')}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-[3vw] relative bg-[#E9EAEB] z-[1]"
        ref={sectionRef}
      >
        <motion.div
          style={{ height }}
          className={cn('relative mt-24 bg-[#141516] ')}
        >
          <div
            className={cn(
              'h-full md:h-[150%]  w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-[1] '
            )}
            style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
          ></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Transmission;
