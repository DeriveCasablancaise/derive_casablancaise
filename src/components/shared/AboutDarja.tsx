'use client';

import { useInView, motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import React, { useRef } from 'react';
import RoundedBtn from './rounded';
import { descOpacity } from '../../lib/utils';

const AboutDarja = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('AboutPage');
  const container = useRef(null);
  const isInView = useInView(container);

  return (
    <div className="mt-32 mb-8  flex flex-col justify-center 2xl:flex-row h-full">
      <div
        ref={container}
        className="max-w-[1400px] relative flex flex-col gap-[50px] border-b border-gray-500 pb-24 mx-16 xl:mx-[200px]"
      >
        <motion.h2
          variants={descOpacity}
          animate={isInView ? 'open' : 'closed'}
          className={`text-4xl md:text-8xl m-0 font-semibold text-start bg-clip-text py-6 text-transparent bg-gradient-to-b from-[#696443] to-[#696443]/40 ${
            isArabic ? 'arabic-title-bold' : 'latin-title-bold'
          }`}
        >
          {t('Section.title')}
        </motion.h2>
        <div
          className={`absolute top-[calc(100%-75px)] ${
            isArabic
              ? 'right-[calc(100%-170px)] md:right-[calc(100%-250px)]'
              : 'left-[calc(100%-170px)] md:left-[calc(100%-250px)]'
          }`}
        >
          <RoundedBtn className="roundedBtnSize bg-[#696443] text-white rounded-full absolute flex items-center justify-center overlay">
            <div className="globe">
              <div className="globe-wrap">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle-hor"></div>
                <div className="circle-hor-middle"></div>
              </div>
            </div>
          </RoundedBtn>
        </div>
      </div>
    </div>
  );
};

export default AboutDarja;
