'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { cn, perspective } from '../../lib/utils';
import { useLocale, useTranslations } from 'next-intl';

interface NavProps {
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

const Nav = ({ setIsActive }: NavProps) => {
  const t = useTranslations('Layout');
  const navKeys = [
    'home',
    'derive',
    'previous',
    'darja',
    'community',
    'contact',
  ];
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      className={cn(
        'flex justify-center flex-col w-full h-full px-10 pt-[100px] pb-[50px] z-[999]',
        isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
      )}
    >
      <div className="flex gap-2 md:gap-4 lg:gap-6 2xl:gap-8 flex-col">
        {navKeys.map((key, i) => {
          return (
            <div
              key={`b_${i}`}
              className="linkContainer"
              onClick={() => setIsActive(false)}
            >
              <Link
                href={`/${locale}${t(`Navigation.${key}.href`)}`}
                className="flex flex-wrap overflow-hidden"
              >
                <motion.div
                  variants={perspective}
                  custom={i}
                  initial="initial"
                  animate="enter"
                  whileHover="whileHover"
                  whileTap="whileHover"
                  exit="exit"
                  className="text-3xl text-[#00b0db] flex items-center justify-center"
                >
                  <motion.span
                    variants={{
                      initial: { x: isArabic ? 20 : -20 },
                      whileHover: { x: 0 },
                    }}
                  >
                    <ArrowRight className={`${isArabic ? 'rotate-180' : ''}`} />
                  </motion.span>
                  <motion.span
                    variants={{
                      initial: { x: 0 },
                      whileHover: { x: isArabic ? -20 : 20 },
                    }}
                  >
                    {t(`Navigation.${key}.title`)}
                  </motion.span>
                </motion.div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Nav;
