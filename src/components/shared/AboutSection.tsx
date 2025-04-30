'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef(null);
  const arrowRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const imageContainerRef = useRef(null);

  const locale = useLocale();
  const isArabic = locale === 'ar';

  const t = useTranslations('AboutPage');

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
      gsap.to([text1Ref.current, text2Ref.current], {
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
        scale: 1.3, // Slight zoom in
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

  return (
    <section
      ref={sectionRef}
      className="section about-image once-in"
      data-scroll-section=""
    >
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
                'is-inview leading-6',
                isArabic
                  ? 'arabic-text-regular text-2xl'
                  : 'latin-text-medium text-xl'
              )}
            >
              {t('Section.description')}
            </motion.p>
            <motion.p
              ref={text2Ref}
              data-scroll=""
              data-scroll-speed="-1"
              data-scroll-position="top"
              data-scroll-offset="0%, -50%"
              className="is-inview leading-6 my-8"
            >
              <span
                style={{ opacity: 0.5, display: 'block', paddingTop: '.5em' }}
                className={cn(
                  isArabic
                    ? 'arabic-text-regular text-2xl'
                    : 'latin-text-medium text-xl'
                )}
              >
                {t('Section.suspense')}
                <span className="animate-dot">.</span>
                <span className="animate-dot">.</span>
                <span className="animate-dot">.</span>
              </span>
            </motion.p>
          </div>
          <div className="flex-col">
            <div className="single-about-image">
              <div
                className="image-overlay overlay-image is-inview"
                data-scroll
                data-scroll-speed="-2"
                data-scroll-position="top"
                ref={imageContainerRef}
              ></div>
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
