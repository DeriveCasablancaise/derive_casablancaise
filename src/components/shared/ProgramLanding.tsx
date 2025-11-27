'use client';

import { cn, convertYouTubeToEmbed, descOpacity } from '@/lib/utils';
import { useInView, motion, useTransform, useScroll } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import SubHeader from './SubHeader';
import { useLocale, useTranslations } from 'next-intl';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import { PlayCircleIcon } from 'lucide-react';
import { fadeIn } from '@/variants';
import TeaserModal from './TeaserModal';
import { IHomepage } from '@/lib/database/models/homepage.model';
import AfterMovieModal from './AfterMovieModal';

const jakarta = Plus_Jakarta_Sans({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

interface ProgramLandingProps {
  homepage: IHomepage;
}

const ProgramLanding = ({ homepage }: ProgramLandingProps) => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const isInView = useInView(imageContainerRef);
  const [isMobile, setIsMobile] = useState(false);
  const [isTeaseModalOpen, setIsTeaseModalOpen] = useState<boolean>(false);
  const [isAfterMovieModalOpen, setIsAfterMovieModalOpen] =
    useState<boolean>(false);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Derive2024');
  const t2 = useTranslations('HomePage');

  const video1EmbedLink = convertYouTubeToEmbed(homepage.video1IframeLink);
  const video2EmbedLink = convertYouTubeToEmbed(homepage.video2IframeLink);

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

  return (
    <>
      <section ref={sectionRef} data-scroll-section="" className="">
        <div className="relative flex h-full w-full">
          <SubHeader />
        </div>
        <motion.div
          ref={imageContainerRef}
          className="w-full min-h-screen relative py-8 mb-8 lg:mt-[400px] md:mb-16 2xl:mb-[23rem] 2xl: mt-[26rem]  flex flex-col lg:flex-row lg:items-center border-b-2"
          style={{
            backgroundSize,
            backgroundImage: `url(${homepage.backgroundImage})`, // Use dynamic image
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="lg:absolute lg:left-0 lg:-bottom-24 lg:h-auto lg:bg-[#E9EAEB] lg:w-[60%] bg-white/70 h-fit  my-auto lg:flex flex-col justify-start py-4 lg:py-6 items-start gap-4 2xl:gap-8 text-[#00b0db] md:text-black/90 px-4 lg:px-6">
            <motion.div
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'w-full font-bold text-[#094142] m-0 tiptap-content',
                jakarta.className
              )}
              dangerouslySetInnerHTML={{
                __html: isArabic
                  ? homepage.textAr || homepage.textFr
                  : homepage.textFr,
              }}
            />
          </div>
        </motion.div>
      </section>
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
              src={homepage.video1Thumbnail}
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
              ? homepage.video1TitleAr || homepage.video1TitleFr
              : homepage.video1TitleFr}
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
              src={homepage.video2Thumbnail}
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
              ? homepage.video2TitleAr || homepage.video2TitleFr
              : homepage.video2TitleFr}
          </motion.div>
        </div>
      </div>
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

export default ProgramLanding;
