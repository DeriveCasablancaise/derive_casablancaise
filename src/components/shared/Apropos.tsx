'use client';

import { cn, descOpacity, descSlideUp } from '../../lib/utils';
import { useInView, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const Apropos = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('AboutPage');

  const container = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  const isInView = useInView(container);
  const isInView1 = useInView(text1Ref);
  const isInView2 = useInView(text2Ref);
  const isInView3 = useInView(text3Ref);

  return (
    <section className="about-services">
      <div className="container" ref={container}>
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
              {t('About.title')}
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
                  'my-4 md:my-6 flex justify-center items-center ',
                  isArabic
                    ? 'arabic-text-regular text-2xl'
                    : 'latin-text-medium text-xl'
                )}
              >
                {t('About.desc1')}
              </motion.p>
              <motion.p
                ref={text2Ref}
                variants={descOpacity}
                animate={isInView2 ? 'open' : 'closed'}
                data-scroll=""
                data-scroll-speed="-1"
                data-scroll-position="top"
                data-scroll-offset="0%, -50%"
                className={cn(
                  'my-4 md:my-6 flex justify-center items-center',
                  isArabic
                    ? 'arabic-text-regular text-2xl'
                    : 'latin-text-medium text-xl'
                )}
              >
                {t('About.desc2')}
              </motion.p>
              <motion.p
                ref={text3Ref}
                variants={descOpacity}
                animate={isInView3 ? 'open' : 'closed'}
                data-scroll=""
                data-scroll-speed="-1"
                data-scroll-position="top"
                data-scroll-offset="0%, -50%"
                className={cn(
                  'my-4 md:my-6 flex justify-center items-center',
                  isArabic
                    ? 'arabic-text-regular text-xl '
                    : 'latin-text-medium text-xl '
                )}
              >
                {t('About.desc2')}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Apropos;
