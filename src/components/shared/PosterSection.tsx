'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { editionHref, getEdition } from '@/constants/editions';

const PosterSection = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Layout');
  const tPoster = useTranslations('Poster');
  const reduceMotion = useReducedMotion();
  const programmePdf = getEdition('2026').programmePdf;

  const linkClass = cn(
    'text-xl lg:text-2xl underline underline-offset-4 decoration-brand-orange decoration-2 hover:text-brand-orange transition-colors duration-300',
    isArabic ? 'arabic-title-light' : 'latin-title-light',
  );

  return (
    // the top padding clears the landing text box that hangs below its section on lg
    <section
      dir={isArabic ? 'rtl' : 'ltr'}
      className="px-4 pt-16 lg:pt-24 2xl:pt-0"
    >
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto w-full max-w-[480px] lg:mx-0 lg:justify-self-center"
        >
          <Image
            src="/images/affiche-2026.jpg"
            alt={tPoster('alt')}
            width={1200}
            height={1500}
            sizes="(min-width: 1024px) 448px, (min-width: 520px) 480px, 100vw"
            className="h-auto w-full shadow-xl"
          />
        </motion.div>
        <div className="flex flex-col items-center gap-6 text-center text-brand-teal lg:items-start lg:text-start">
          <Link href={`/${locale}${editionHref('2026')}`} className={linkClass}>
            {t('Navigation.derive2026.title')}
          </Link>
          {programmePdf && (
            <a
              href={programmePdf}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {t('Download')}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default PosterSection;
