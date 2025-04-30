'use client';

import React, { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { cn, descOpacity } from '../../lib/utils';
import RoundedBtn from './rounded';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';

const Description = () => {
  const description = useRef(null);
  const isInView = useInView(description);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage');

  return (
    <div className="px-8 mt-[300px] flex flex-col justify-center xl:flex-row gap-16  relative">
      {/* Left Section */}
      <div className="w-[30%] hidden xl:flex flex-col justify-between items-center relative">
        {/* Top text */}
        <motion.div
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
          className={cn(
            'font-extrabold text-center text-6xl absolute bottom-96  transform -rotate-90  w-[600px] z-40 text-[#ee7103] ',
            isArabic
              ? 'arabic-title-bold 2xl:-right-36'
              : 'latin-title-bold 2xl:-left-36'
          )}
        >
          Rencontres des Arts de la Scène
        </motion.div>
      </div>
      {/* Bottom mini-circle image */}
      <motion.div
        className={cn(
          'absolute -bottom-32 ',
          isArabic ? '-right-96' : '-left-96'
        )}
        variants={descOpacity}
        animate={isInView ? 'open' : 'closed'}
      >
        <Image
          src="/desc-circle.png"
          width={1200}
          height={1200}
          alt="circle-background"
        />
      </motion.div>

      {/* Right Section */}
      <div
        ref={description}
        className="xl:w-[70%] md:mt-0 flex flex-col gap-[50px] justify-center items-center relative "
      >
        <motion.p
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
          className={cn(
            'text-lg 2xl:text-2xl w-[80%] font-semibold m-0 ',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {t('Hero.description')}
        </motion.p>
        <motion.p
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
          className={cn(
            'text-lg 2xl:text-2xl w-[80%] font-semibold m-0 ',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {t('Hero.subtitle')}
        </motion.p>
        <motion.p
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
          className={cn(
            'text-lg 2xl:text-2xl w-[80%] font-semibold m-0 ',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {t('Hero.subtitle2')}
        </motion.p>
        <motion.p
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
          className={cn(
            'text-lg 2xl:text-2xl w-[80%] font-semibold m-0 ',
            isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
          )}
        >
          {t('Hero.subtitle3')}
        </motion.p>
        <Link href={`/${locale}/ar2d`} className="mt-10 hidden md:block">
          <div data-scroll data-scroll-speed={0.1}>
            <RoundedBtn
              className={cn(
                'group absolute z-40 roundedBtnSize bg-[#094142] text-white rounded-full flex items-center justify-center cursor-pointer before:absolute before:left-[-10%] before:top-[-10%] before:h-0 before:w-[120%] before:translate-y-3/4 before:scale-0 before:rounded-full before:pb-[120%] before:content-[""] after:absolute after:inset-0 after:h-full after:w-full after:-translate-y-full after:rounded-full after:transition-transform after:duration-300 after:ease-in-expo after:content-[""] hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-transform hover:before:duration-300 hover:before:ease-in-expo hover:after:translate-y-0 hover:after:transition-transform hover:after:delay-300 hover:after:duration-75 hover:after:ease-linear before:bg-[#00b0db] after:bg-[#00b0db]',
                isArabic
                  ? 'right-[calc(100%-200px)]'
                  : 'left-[calc(100%-200px)]'
              )}
            >
              <p
                className={cn(
                  'relative z-[1] transition-colors duration-400 group-hover:text-white m-0 text-lg font-light ',
                  isArabic ? 'arabic-title-bold' : 'latin-title-bold'
                )}
              >
                {t('Hero.about')}
              </p>
            </RoundedBtn>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Description;
