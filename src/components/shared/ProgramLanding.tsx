'use client';

import { cn, descOpacity } from '@/lib/utils';
import { useInView, motion, useTransform, useScroll } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import SubHeader from './SubHeader';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import RoundedBtn from './rounded';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import { PlayCircleIcon } from 'lucide-react';
import { fadeIn } from '@/variants';
import TeaserModal from './TeaserModal';

const jakarta = Plus_Jakarta_Sans({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

const ProgramLanding = () => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const isInView = useInView(imageContainerRef);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Derive2024');
  const t2 = useTranslations('HomePage');

  // Detect if the user is on a smaller screen (e.g., mobile)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // Example breakpoint (768px)
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'], // When section starts and ends
  });

  // Create a zoom effect: scaling from 1 to 1.3 based on scroll position
  const backgroundSize = useTransform(
    scrollYProgress,
    [0.4, 1],
    isMobile ? ['cover', 'cover'] : ['80%', '130%']
  );

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <section ref={sectionRef} data-scroll-section="" className="">
        <div className="relative flex h-full w-full">
          <SubHeader />
        </div>
        <motion.div
          ref={imageContainerRef}
          className="bg-description w-full min-h-screen relative py-8 mb-8 lg:mt-[400px] md:mb-16 2xl:my-[23rem]  flex flex-col lg:flex-row lg:items-center border-b-2"
          style={{ backgroundSize }}
        >
          <div className="lg:absolute lg:left-0 lg:-bottom-32 lg:h-auto lg:bg-[#E9EAEB] lg:w-[40%] bg-white/70 h-fit  my-auto lg:flex flex-col justify-start py-4 lg:py-6 items-start gap-4 2xl:gap-8 text-[#00b0db] md:text-black/90 px-4 lg:px-6">
            <motion.p
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'text-lg lg:text-xl w-full font-medium text-[#094142] m-0',
                jakarta.className
              )}
            >
              {t2('Hero.subtitle2')}
            </motion.p>
            <motion.p
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'text-lg lg:text-xl w-full font-medium text-[#094142] m-0',
                jakarta.className
              )}
            >
              {t2('Hero.subtitle3')}
            </motion.p>
            {/* <Link
              href={`/${locale}/derive-2024`}
              className="hidden lg:flex w-full mt-4"
            >
              <RoundedBtn className="relative text-base group inline-flex items-center justify-center overflow-hidden rounded-full font-bold ring-offset-background transition-colors before:absolute before:left-[-10%] before:h-0 before:w-[120%] before:translate-y-3/4 before:scale-0 before:rounded-full before:pb-[120%] before:content-[''] after:absolute after:inset-0 after:h-full after:w-full after:-translate-y-full after:rounded-full after:transition-transform after:duration-300 after:ease-in-expo after:content-[''] hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-transform hover:before:duration-300 hover:before:ease-in-expo hover:after:translate-y-0 hover:after:transition-transform hover:after:delay-300 hover:after:duration-75 hover:after:ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-2 hover:border-solid hover:border-[#094142] before:bg-[#094142] after:bg-[#094142] px-8 py-3 before:-top-1/2 hover:text-background">
                <p
                  className={cn(
                    'relative z-[1] transition-colors duration-400 text-[#E9EAEB] md:text-[#094142] group-hover:text-[#00b0db] m-0 text-xl md:text-2xl',
                    isArabic
                      ? 'arabic-title-bold'
                      : 'latin-title-bold capitalize'
                  )}
                >
                  {t('more')}
                </p>
              </RoundedBtn>
            </Link> */}
          </div>
          {/* <Link
            href={`/${locale}/derive-2024`}
            className="lg:hidden mt-8 self-center"
          >
            <RoundedBtn className="relative text-base group inline-flex items-center justify-center overflow-hidden rounded-full font-bold ring-offset-background transition-colors before:absolute before:left-[-10%] before:h-0 before:w-[120%] before:translate-y-3/4 before:scale-0 before:rounded-full before:pb-[120%] before:content-[''] after:absolute after:inset-0 after:h-full after:w-full after:-translate-y-full after:rounded-full after:transition-transform after:duration-300 after:ease-in-expo after:content-[''] hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-transform hover:before:duration-300 hover:before:ease-in-expo hover:after:translate-y-0 hover:after:transition-transform hover:after:delay-300 hover:after:duration-75 hover:after:ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-2 hover:border-solid hover:border-[#094142] before:bg-[#094142] after:bg-[#094142] px-8 py-3 before:-top-1/2 hover:text-background">
              <p
                className={cn(
                  'relative z-[1] transition-colors duration-400 text-[#094142] group-hover:text-[#00b0db] m-0 text-xl md:text-2xl',
                  isArabic ? 'arabic-title-bold' : 'latin-title-bold capitalize'
                )}
              >
                {t('more')}
              </p>
            </RoundedBtn>
          </Link> */}
        </motion.div>
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2
            className={cn(
              'text-[#094142] text-3xl md:text-4xl lg:text-5xl mb-4',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {isArabic
              ? ' الفيلم الختامي لفعالية المنعطف البيضاوي '
              : 'Actualités'}
          </h2>
        </motion.div>
      </section>
      <div className="flex justify-center items-center mx-auto my-8 md:my-10 xl:my-12 max-w-2xl">
        <motion.div
          variants={fadeIn('up', 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative flex justify-center items-center shadow-md cursor-pointer group"
          onClick={() => openModal()}
        >
          <Image
            src="/images/thumbTeaser.jpg"
            width={600}
            height={600}
            alt="tease_thumbnail"
            className="w-full md:w-[80vw] object-contain rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/50 via-transparent to-transparent rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.8 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="bg-white/20 backdrop-blur-md rounded-full p-6"
            >
              <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-[#094142]" />
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              'absolute bottom-6 text-white text-xl md:text-2xl font-bold',
              isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
            )}
          >
            {isArabic
              ? 'إعلان دعائي لـلمنعطف البيضاوي 2024'
              : 'Aftermovie Dérive Casablancaise 2024'}
          </motion.div>
        </motion.div>
      </div>
      <TeaserModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default ProgramLanding;
