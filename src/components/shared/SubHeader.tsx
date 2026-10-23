'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { BannerView } from '@/lib/banner';

const BANNER_WIDTH = 2000;
const BANNER_HEIGHT = 761;

interface SubHeaderProps {
  banner?: BannerView | null;
}

const DEFAULT_TEXT =
  'Biennale pluridisciplinaire : Danse/Théâtre/Musique/Cinéma/Lectures/Ateliers/Conférences/Rencontres';

export default function Component({ banner = null }: SubHeaderProps) {
  const t = useTranslations('HomeBanner');
  const reduceMotion = useReducedMotion();
  const text = banner?.text ?? DEFAULT_TEXT;
  const isArabic = banner?.isArabic ?? false;
  const link = banner?.link;
  // longer text needs more time to stay readable
  const duration = Math.max(15, Math.round(text.length * 0.2));
  const linkClass = cn(
    'mx-2 font-bold underline decoration-[#ee7103] decoration-2 underline-offset-4',
    isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
  );

  return (
    <div className="w-full flex flex-col">
      <h1 className="sr-only">
        <span lang="fr">{t('titleFr')}</span>{' '}
        <span lang="ar" dir="rtl">
          {t('titleAr')}
        </span>
      </h1>
      {/* The padding clears the fixed navbar and has the banner's own red,
          so the image and the section read as one surface */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full bg-brand-red-banner pt-16 lg:pt-[10vh]"
      >
        {/* Phones and tablets only crop the red sides, the blob is 29% of the
            image width and the visible part is 38% (square), 51% (4/3), 68% (16/9).
            From lg the whole image shows, the height is capped at 70vh */}
        <div className="relative mx-auto aspect-square w-full sm:aspect-[4/3] md:aspect-video lg:aspect-auto lg:h-[min(70vh,38.05vw)]">
          <Image
            src="/images/home-banner-2026-2.png"
            alt={t('alt')}
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center lg:object-contain"
          />
        </div>
      </motion.section>

      {/* Moving text, pauses on hover and focus */}
      <div className="marquee mt-4 md:mt-6 w-full overflow-hidden">
        <div
          className="marquee-track flex justify-center items-center text-center font-normal text-base md:text-lg whitespace-nowrap"
          data-rtl={isArabic}
          style={{ animationDuration: `${duration}s` }}
        >
          <span
            dir={isArabic ? 'rtl' : 'ltr'}
            className={cn(
              'text-[#094142]',
              isArabic ? 'arabic-subtitle-regular' : 'latin-title-light',
            )}
          >
            {text}
            {link &&
              (link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
          </span>
        </div>
      </div>
    </div>
  );
}
