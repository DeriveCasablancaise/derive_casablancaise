'use client';

import { cn, convertYouTubeToEmbed, descOpacity } from '@/lib/utils';
import { useInView, motion, useTransform, useScroll } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus_Jakarta_Sans } from 'next/font/google';
import TeaserModal from './TeaserModal';
import AfterMovieModal from './AfterMovieModal';
import { fadeIn } from '@/variants';
import VideoCard from './VideoCard';
import { getLandingView, type LandingData } from '@/lib/landing';
import { LandingFlow, type BackgroundFit } from './LandingFlow';

const jakarta = Plus_Jakarta_Sans({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

interface DeriveLandingProps {
  data: LandingData;
  // anchored: absolute blocks at fixed anchors (2022, 2024). flow: blocks in normal flow (2026)
  layout?: 'anchored' | 'flow';
  // flow only. pan: a tall collage scrolls through the frame instead of being cropped to its middle
  backgroundFit?: BackgroundFit;
  // data: the editable heading of the landing (2026). translation: no heading (2022, 2024)
  headingSource?: 'data' | 'translation';
}

const BLOCK_CLASS: Record<number, string> = {
  1: 'lg:absolute lg:left-0 lg:top-0 lg:h-auto lg:bg-[#E9EAEB] lg:w-[60%] bg-white/70 h-fit lg:flex flex-col justify-start py-4 lg:py-6 items-start gap-4 2xl:gap-8 text-[#00b0db] md:text-black/90 px-4 lg:px-6',
  2: 'lg:absolute lg:right-0 lg:bottom-[400px] lg:h-auto lg:bg-[#E9EAEB] lg:w-[60%] bg-white/70 h-fit  lg:my-16 lg:flex flex-col justify-start py-4 lg:py-6 items-start gap-4 2xl:gap-8 text-[#00b0db] md:text-black/90 px-4 lg:px-6 order-2',
  3: 'lg:absolute lg:left-0 lg:bottom-12 lg:h-auto lg:bg-[#E9EAEB] lg:w-[60%] bg-white/70 h-fit lg:flex flex-col justify-start py-4 lg:py-6 items-start gap-4 2xl:gap-8 text-[#00b0db] md:text-black/90 px-4 lg:px-6',
};

interface LandingBackgroundProps {
  texts: { n: number; html: string }[];
  backgroundImage: string;
  isArabic: boolean;
}

// own component so the scroll hooks only run when the block is rendered
const LandingBackground = ({
  texts,
  backgroundImage,
  isArabic,
}: LandingBackgroundProps) => {
  const sectionRef = useRef(null);
  const imageContainerRef = useRef(null);
  const isInView = useInView(imageContainerRef);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if the user is on a smaller screen (e.g., mobile)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // Example breakpoint (768px)
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ['start end', 'end end'], // When section starts and ends
  });

  // Create a zoom effect: scaling from 1 to 1.3 based on scroll position
  const backgroundSize = useTransform(
    scrollYProgress,
    [0.4, 1],
    isMobile ? ['cover', 'cover'] : ['100%', '200%'],
  );

  return (
    <section ref={sectionRef} data-scroll-section="" className="">
      <motion.div
        ref={imageContainerRef}
        className={cn(
          'w-full min-h-[200vh] relative py-24   lg:mt-[10vh]  flex flex-col lg:flex-row lg:items-center border-b-2 z-20',
          isArabic ? 'text-lg z-30' : 'text-sm',
        )}
        style={{
          backgroundSize,
          ...(backgroundImage && {
            backgroundImage: `url(${backgroundImage})`, // Use dynamic image
          }),
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {texts.map(({ n, html }) => (
          <motion.div
            key={n}
            className={
              n === 2
                ? cn(BLOCK_CLASS[n], isArabic && 'lg:-bottom-96')
                : BLOCK_CLASS[n]
            }
            variants={descOpacity}
            animate={isInView ? 'open' : 'closed'}
          >
            <motion.div
              variants={descOpacity}
              animate={isInView ? 'open' : 'closed'}
              className={cn(
                'w-full font-bold text-[#094142] m-0 tiptap-content',
                jakarta.className,
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

const DeriveLanding = ({
  data,
  layout = 'anchored',
  backgroundFit = 'cover',
  headingSource = 'data',
}: DeriveLandingProps) => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const tVideos = useTranslations('HomeVideos');
  const [isTeaseModalOpen, setIsTeaseModalOpen] = useState<boolean>(false);
  const [isAfterMovieModalOpen, setIsAfterMovieModalOpen] =
    useState<boolean>(false);

  const { texts, videos, videosHeading, backgroundImage, showBackground } =
    getLandingView(data, isArabic);

  const isFlow = layout === 'flow';
  // the 2026 heading is editable and can be empty; 2022 and 2024 show no heading, only the titled videos.
  // I skip it when it repeats a video title, so the same text never shows above and under a card
  const sameText = (a?: string, b?: string) =>
    (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase();
  const heading =
    headingSource === 'data' &&
    isFlow &&
    videosHeading &&
    !videos.some((v) => sameText(v.title, videosHeading.text))
      ? { text: videosHeading.text, arabic: videosHeading.rtl }
      : null;

  return (
    <>
      {showBackground &&
        (isFlow ? (
          <LandingFlow
            texts={texts}
            backgroundImage={backgroundImage}
            backgroundImageCredit={data.backgroundImageCredit}
            isArabic={isArabic}
            fit={backgroundFit}
          />
        ) : (
          <LandingBackground
            texts={texts}
            backgroundImage={backgroundImage}
            isArabic={isArabic}
          />
        ))}
      {videos.length > 0 && (
        <>
          {heading && (
            <motion.div
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mt-24 lg:mt-48"
            >
              <h2
                className={cn(
                  'text-brand-title text-xl lg:text-3xl mb-4',
                  heading.arabic ? 'arabic-title-bold' : 'latin-title-bold',
                )}
              >
                {heading.text}
              </h2>
            </motion.div>
          )}
          <div
            className={cn(
              'grid grid-cols-1 items-start gap-8 mx-auto mb-8 md:mb-10 xl:mb-12 px-4',
              heading ? 'mt-8 md:mt-10 xl:mt-12' : 'mt-24 lg:mt-48',
              videos.length > 1
                ? 'lg:grid-cols-2 max-w-[1100px]'
                : 'max-w-3xl',
            )}
          >
            {videos.map(({ n, thumbnail, title }) => {
              const label = title?.trim();
              return (
                <VideoCard
                  key={n}
                  title={label}
                  titleIsArabic={isArabic}
                  thumbnail={thumbnail}
                  ariaLabel={tVideos('playVideo', { title: label || `${n}` })}
                  sizes={
                    videos.length > 1
                      ? '(min-width: 1024px) 534px, 100vw'
                      : '(min-width: 768px) 768px, 100vw'
                  }
                  onOpen={() =>
                    n === 1
                      ? setIsTeaseModalOpen(true)
                      : setIsAfterMovieModalOpen(true)
                  }
                />
              );
            })}
          </div>
        </>
      )}
      {videos.some((v) => v.n === 1) && (
        <TeaserModal
          isOpen={isTeaseModalOpen}
          onClose={() => setIsTeaseModalOpen(false)}
          videoLink={convertYouTubeToEmbed(videos.find((v) => v.n === 1)!.link)}
        />
      )}
      {videos.some((v) => v.n === 2) && (
        <AfterMovieModal
          isOpen={isAfterMovieModalOpen}
          onClose={() => setIsAfterMovieModalOpen(false)}
          videoLink={convertYouTubeToEmbed(videos.find((v) => v.n === 2)!.link)}
        />
      )}
    </>
  );
};

export default DeriveLanding;
