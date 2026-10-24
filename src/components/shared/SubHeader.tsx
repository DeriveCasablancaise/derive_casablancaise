'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { BannerView } from '@/lib/banner';

const BANNER_WIDTH = 3750;
const BANNER_HEIGHT = 1250;

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
    'mx-2 font-bold underline decoration-brand-orange decoration-2 underline-offset-4',
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
        {/* The text panel spans x 29.7-70.3% and y 16.4-83.6% of the image. With
            a 6% margin that is x 23.7-76.3% and y 10.4-89.6%, which stays visible
            with object-cover as long as the frame is between 1.6:1 and 3.79:1.
            So the height is the 3:1 height (capped at 70vh, at least 28rem on
            narrow screens) clamped to 26.4vw..62.5vw */}
        <div className="relative mx-auto w-full h-[clamp(26.4vw,min(70vh,max(33.34vw,min(62.5vw,28rem))),62.5vw)]">
          <Image
            src="/images/banner-v8.png"
            alt={t('alt')}
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            priority
            sizes="100vw"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </motion.section>

      {/* Moving text, pauses on hover and focus */}
      {/* the same gap above and below, the next section adds no margin */}
      <div className="marquee w-full overflow-hidden py-[clamp(1rem,3vw,2.5rem)]">
        <div
          className="marquee-track flex justify-center items-center text-center font-normal text-lg md:text-xl whitespace-nowrap"
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
