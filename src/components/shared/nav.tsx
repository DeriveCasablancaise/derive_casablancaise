'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { cn, perspective } from '../../lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';

interface NavProps {
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

const Nav = ({ setIsActive }: NavProps) => {
  const t = useTranslations('Layout');
  const navKeys = ['home', 'derive2026', 'derive', 'previous', 'darja', 'contact'];
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const pathname = trimSlash(usePathname() ?? '');

  const hrefFor = (key: string) =>
    trimSlash(`/${locale}${t(`Navigation.${key}.href`)}`);
  // home only matches itself, the others also match their sub pages
  const isCurrent = (key: string) => {
    const href = hrefFor(key);
    if (href === `/${locale}`) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
                href={hrefFor(key)}
                aria-current={isCurrent(key) ? 'page' : undefined}
                className="flex flex-wrap overflow-hidden rounded-md px-2 transition-colors hover:bg-brand-chrome-hover focus:outline-none focus-visible:bg-brand-chrome-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-white aria-[current=page]:shadow-[inset_0_-3px_0_0_#fff]"
              >
                <motion.div
                  variants={perspective}
                  custom={i}
                  initial="initial"
                  animate="enter"
                  whileHover="whileHover"
                  whileTap="whileHover"
                  exit="exit"
                  className="text-3xl text-white flex items-center justify-center"
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
