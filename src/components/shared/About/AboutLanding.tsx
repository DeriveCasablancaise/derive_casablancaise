'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, motion, useTransform, useScroll } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { cn, convertYouTubeToEmbed } from '@/lib/utils';
import { IAr2d } from '@/lib/database/models/ar2d.model';
import { useLocale } from 'next-intl';
import ClientWrapper from '../PostWrapper';
import { fadeIn } from '@/variants';
import Image from 'next/image';
import { PlayCircleIcon } from 'lucide-react';
import TeaserModal from '../TeaserModal';
import AfterMovieModal from '../AfterMovieModal';

const jakarta = Plus_Jakarta_Sans({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

// Animation variants for text reveal
const descOpacity = {
  closed: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.4,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
};

interface AboutLandingProps {
  ar2d: IAr2d;
}

const AboutLanding = ({ ar2d }: AboutLandingProps) => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const isInView = useInView(imageContainerRef);
  const [isMobile, setIsMobile] = useState(false);
  const [isTeaseModalOpen, setIsTeaseModalOpen] = useState<boolean>(false);
  const [isAfterMovieModalOpen, setIsAfterMovieModalOpen] =
    useState<boolean>(false);

  const video1EmbedLink = convertYouTubeToEmbed(ar2d.video1IframeLink);
  const video2EmbedLink = convertYouTubeToEmbed(ar2d.video2IframeLink);

  const locale = useLocale();
  const isArabic = locale === 'ar';

  // Detect if the user is on a smaller screen (e.g., mobile)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ['start end', 'end end'],
  });

  // Create a zoom effect: scaling from 1 to 1.3 based on scroll position
  const backgroundSize = useTransform(
    scrollYProgress,
    [0.4, 1],
    isMobile ? ['cover', 'cover'] : ['100%', '200%']
  );

  return (
    <>
      <section ref={sectionRef} className="">
        <motion.div
          ref={imageContainerRef}
          className="bg-gradient-to-bl from-orange-400 via-red-500 to-pink-600 w-full min-h-[200vh] relative py-24 lg:py-0 lg:mt-[10vh] flex flex-col lg:flex-row lg:items-center border-b-2 z-20"
          style={{
            backgroundSize,
            backgroundImage: `url(${ar2d.backgroundImage})`, // Use dynamic image
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* First text box - Les Rencontres de la Danse */}
          <motion.div
            className={cn(
              'lg:absolute lg:left-0 lg:top-0 lg:h-auto lg:bg-[#E9EAEB]/95 lg:w-[45%] bg-white/80 backdrop-blur-sm h-fit lg:flex flex-col justify-start py-6 lg:py-8 items-start gap-6 2xl:gap-8 text-[#00b0db] md:text-black/90 px-6 lg:px-8 shadow-xl',
              jakarta.className
            )}
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
          >
            <motion.div
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'w-full font-bold text-[#094142] m-0 tiptap-content',
                jakarta.className
              )}
              dangerouslySetInnerHTML={{
                __html: isArabic ? ar2d.text1Ar || ar2d.text1Fr : ar2d.text1Fr,
              }}
            />
          </motion.div>

          {/* Second text box - L'Espace DARJA */}
          <motion.div
            className={cn(
              'lg:absolute lg:right-0 lg:top-64 lg:h-auto lg:bg-[#E9EAEB]/95 lg:w-[45%] bg-white/80 backdrop-blur-sm h-fit lg:flex flex-col justify-start py-6 lg:py-8 items-start gap-6 2xl:gap-8 text-[#00b0db] md:text-black/90 px-6 lg:px-8 shadow-xl',
              jakarta.className
            )}
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
          >
            <motion.div
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'w-full font-bold text-[#094142] m-0 tiptap-content',
                jakarta.className
              )}
              dangerouslySetInnerHTML={{
                __html: isArabic ? ar2d.text2Ar || ar2d.text2Fr : ar2d.text2Fr,
              }}
            />
          </motion.div>

          {/* Third text box - Dérive Casablancaise */}
          <motion.div
            className={cn(
              'lg:absolute lg:left-0 lg:bottom-16 lg:h-auto lg:bg-[#E9EAEB]/95 lg:w-[45%] bg-white/80 backdrop-blur-sm h-fit lg:my-16 lg:flex flex-col justify-start py-6 lg:py-8 items-start gap-6 2xl:gap-8 text-[#00b0db] md:text-black/90 px-6 lg:px-8 order-2 shadow-xl',
              jakarta.className
            )}
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
          >
            <motion.div
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'w-full font-bold text-[#094142] m-0 tiptap-content',
                jakarta.className
              )}
              dangerouslySetInnerHTML={{
                __html: isArabic ? ar2d.text3Ar || ar2d.text3Fr : ar2d.text3Fr,
              }}
            />
          </motion.div>
        </motion.div>
      </section>

      <ClientWrapper>
        <motion.div
          variants={fadeIn('up', 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-24 lg:mt-48"
        >
          <h2
            className={cn(
              'text-[#ee7103] text-xl lg:text-3xl mb-4',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {isArabic
              ? ' الفيلم الختامي لفعالية المنعطف البيضاوي '
              : 'Actualités'}
          </h2>
        </motion.div>
        <div className="flex flex-col lg:flex-row justify-center items-start mx-auto my-8 md:my-10 xl:my-12 max-w-4xl gap-8 px-4">
          {/* First Video Showcase */}
          <div className="flex flex-col items-center w-full lg:w-1/2">
            <motion.div
              variants={fadeIn('up', 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex justify-center items-center shadow-md cursor-pointer group w-full"
              onClick={() => setIsTeaseModalOpen(true)}
            >
              <Image
                src={ar2d.video1Thumbnail}
                width={600}
                height={600}
                alt="tease_thumbnail"
                className="w-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/50 via-transparent to-transparent rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="bg-white/20 backdrop-blur-md rounded-full p-6"
                >
                  <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-[#ee7103]" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'mt-4 text-center text-base md:text-lg font-bold text-[#094142]',
                isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
              )}
            >
              {isArabic
                ? ar2d.video1TitleAr || ar2d.video1TitleFr
                : ar2d.video1TitleFr}
            </motion.div>
          </div>

          {/* Second Video Showcase (Placeholder) */}
          <div className="flex flex-col items-center w-full lg:w-1/2 mt-8 lg:mt-0">
            <motion.div
              variants={fadeIn('up', 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex justify-center items-center shadow-md cursor-pointer group w-full"
              onClick={() => setIsAfterMovieModalOpen(true)}
            >
              <Image
                src={ar2d.video2Thumbnail}
                width={600}
                height={600}
                alt="tease_thumbnail"
                className="w-full object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/50 via-transparent to-transparent rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  className="bg-white/20 backdrop-blur-md rounded-full p-6"
                >
                  <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-[#ee7103]" />
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'mt-4 text-center text-base md:text-lg font-bold text-[#094142]',
                isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
              )}
            >
              {isArabic
                ? ar2d.video2TitleAr || ar2d.video2TitleFr
                : ar2d.video2TitleFr}
            </motion.div>
          </div>
        </div>
      </ClientWrapper>

      <TeaserModal
        isOpen={isTeaseModalOpen}
        onClose={() => setIsTeaseModalOpen(false)}
        videoLink={video1EmbedLink}
      />
      <AfterMovieModal
        isOpen={isAfterMovieModalOpen}
        onClose={() => setIsAfterMovieModalOpen(false)}
        videoLink={video2EmbedLink}
      />
    </>
  );
};

export default AboutLanding;
