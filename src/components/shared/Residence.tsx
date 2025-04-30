'use client';

import React, { useEffect, useRef } from 'react';
import { cn, descSlideUp } from '../../lib/utils';
import { useInView, motion, useTransform, useScroll } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale, useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

const Residence = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('AboutPage');

  const container = useRef(null);
  const text1Ref = useRef(null);
  const sectionRef = useRef(null);
  const arrowRef = useRef(null);
  const imageContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    isArabic ? [150, 0] : [-50, 100]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Arrow rotation
      gsap.to(arrowRef.current, {
        rotate: 180,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Text sliding and fading in
      gsap.to([text1Ref.current], {
        y: 50,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Background image zoom effect
      gsap.to(imageContainerRef.current, {
        scale: 1.6, // Slight zoom in
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const isInView = useInView(container);
  const isInView1 = useInView(text1Ref);

  return (
    <section className="about-services" ref={sectionRef}>
      <div className="container">
        <div className="row border-b border-gray-500  ">
          <div className="flex-col " ref={container}>
            <motion.h2
              variants={descSlideUp}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'text-4xl  md:text-6xl font-bold bg-clip-text py-6 text-transparent bg-gradient-to-b from-[#696443] to-[#696443]/40',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {t('Residence.title')}
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
        <div className="row section about-image once-in" data-scroll-section="">
          <div className="bottom-lightgray"></div>
          <div className="container">
            <div className="row">
              <div className="flex-col">
                <motion.svg
                  style={{ rotate, scale: 2 }}
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn(
                    'absolute top-0 ',
                    isArabic ? 'left-[100%]  ' : 'right-[100%]'
                  )}
                >
                  <path
                    d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
                    fill="#696443"
                  />
                </motion.svg>
                <motion.p
                  ref={text1Ref}
                  data-scroll=""
                  data-scroll-speed="-1"
                  data-scroll-position="top"
                  data-scroll-offset="0%, -50%"
                  className={cn(
                    'is-inview',
                    isArabic
                      ? 'arabic-text-regular text-2xl'
                      : 'latin-text-medium text-xl'
                  )}
                >
                  {t('Residence.description')}
                </motion.p>
              </div>
              <div className="flex-col">
                <div className="single-about-image">
                  <div
                    className="image-overlay2 overlay-image absolute is-inview"
                    data-scroll
                    data-scroll-speed="-2"
                    data-scroll-position="top"
                    ref={imageContainerRef}
                  ></div>
                  <div className="image-overlay2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Residence;
