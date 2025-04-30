'use client';

import React, { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import { TextReveal } from '../ui/typography';
import { cn, menu } from '../../lib/utils';
import Nav from './nav';
import { useLocale, useTranslations } from 'next-intl';
import LocaleSwitcher from './locale-switcher-select';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const t = useTranslations('Layout');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <>
      <motion.div
        initial={{
          height: isActive ? '100%' : '0',
        }}
        animate={{
          height: isActive ? (isMobile ? '100%' : '94%') : '0',
        }}
        className={cn(
          'fixed md:right-6 right-0 z-50 flex lg:hidden',
          isActive ? 'top-0 md:top-10' : 'top-6 md:top-10'
        )}
      >
        <motion.div
          className="md:w-[480px] w-full h-full bg-[#094142] relative rounded-3xl"
          variants={menu(isMobile)}
          animate={isActive ? 'open' : 'closed'}
          initial="closed"
        >
          <AnimatePresence>
            {isActive && <Nav setIsActive={setIsActive} />}
          </AnimatePresence>
        </motion.div>
        <Button
          isActive={isActive}
          toggleMenu={() => {
            setIsActive(!isActive);
          }}
        />
      </motion.div>
    </>
  );
};

export default Header;

function Button({
  isActive,
  toggleMenu,
}: {
  isActive: boolean;
  toggleMenu: () => void;
}) {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <React.Fragment>
      <div className="absolute md:top-0 top-4 right-4 md:right-0 w-[100px] h-10 rounded-full overflow-hidden cursor-pointer">
        <motion.div
          className={cn(
            'relative w-full h-full',
            isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
          )}
          animate={{ top: isActive ? '-100%' : '0%' }}
          transition={{
            duration: 0.5,
            type: 'tween',
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <motion.div
            className="bg-[#094142] h-full w-full grid place-items-center text-gray-50"
            onClick={() => {
              toggleMenu();
            }}
          >
            <TextReveal
              className={cn('capitalize font-bold', isArabic ? 'text-xl' : '')}
            >
              {t('Menu.menu').toString()}
            </TextReveal>
          </motion.div>
          <motion.div
            className="bg-[#00b0db] h-full w-full grid place-items-center text-[#094142]"
            onClick={() => {
              toggleMenu();
            }}
          >
            <TextReveal
              className={cn('capitalize font-bold', isArabic ? 'text-xl' : '')}
            >
              {t('Menu.close')}
            </TextReveal>
          </motion.div>
        </motion.div>
      </div>
      <div className="fixed  top-11 right-32 z-30 text-[#094142]  ">
        <LocaleSwitcher />
      </div>
    </React.Fragment>
  );
}
