'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

const Categories = {
  danse: { fr: 'Danse', ar: 'رقص' },
  concert: { fr: 'Concerts', ar: 'حفلة موسيقية' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
} as const;

type CategoryKey = keyof typeof Categories;

export default function Projects() {
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('HomePage.Work');
  const t2 = useTranslations('Layout');

  const moreWork = t('moreWork');

  return (
    <main
      className={cn('flex flex-col items-center xl:mt-[200px] mb-0 md:my-32')}
    >
      <div className="w-full flex flex-col gap-[3vw] items-center justify-center">
        <div className="w-full px-8 xl:px-[100px] bg-[#094142] py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Object.keys(Categories) as CategoryKey[]).map((category) => (
              <Link
                href={`/${locale}/derive-2024?category=${category}#program_section`}
                key={category}
                className="group relative overflow-hidden bg-[#1b7172] transition-all duration-700 group"
              >
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <h3
                    className={cn(
                      'text-2xl md:text-3xl text-white mb-4',
                      isArabic ? 'arabic-title-bold' : 'latin-title-bold'
                    )}
                  >
                    {isArabic
                      ? Categories[category].ar
                      : Categories[category].fr}
                  </h3>
                  <motion.div className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-700">
                    <Image
                      src="/images/spirals.jpg"
                      className="rounded-full object-cover"
                      alt="spirals"
                      width={60}
                      height={60}
                    />
                  </motion.div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
