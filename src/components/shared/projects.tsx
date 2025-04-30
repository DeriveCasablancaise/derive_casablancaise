'use client';

import { motion } from 'framer-motion';
import RoundedBtn from './rounded';
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
      <div className="w-full py-8 bg-[#E9EAEB] px-8 xl:px-[100px]">
        <Link href={`/${locale}/derive-2024`}>
          <RoundedBtn className='relative text-base group inline-flex items-center justify-center overflow-hidden rounded-full font-bold ring-offset-background transition-colors before:absolute before:left-[-10%] before:h-0 before:w-[120%] before:translate-y-3/4 before:scale-0 before:rounded-full before:pb-[120%] before:content-[""] after:absolute after:inset-0 after:h-full after:w-full after:-translate-y-full after:rounded-full after:transition-transform after:duration-300 after:ease-in-expo after:content-[""] hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-transform hover:before:duration-300 hover:before:ease-in-expo hover:after:translate-y-0 hover:after:transition-transform hover:after:delay-300 hover:after:duration-75 hover:after:ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-2 hover:border-solid hover:border-[#094142] before:bg-[#094142] after:bg-[#094142] px-16 py-4 before:-top-1/2 hover:text-background'>
            <p
              className={cn(
                'relative z-[1] transition-colors duration-400 text-[#094142] group-hover:text-[#00b0db] m-0 text-2xl md:text-4xl',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {moreWork}
            </p>
          </RoundedBtn>
        </Link>
        <Link href="/programme.pdf" download target="_blank">
          <RoundedBtn className='relative text-base group inline-flex items-center justify-center overflow-hidden rounded-full font-bold ring-offset-background transition-colors before:absolute before:left-[-10%] before:h-0 before:w-[120%] before:translate-y-3/4 before:scale-0 before:rounded-full before:pb-[120%] before:content-[""] after:absolute after:inset-0 after:h-full after:w-full after:-translate-y-full after:rounded-full after:transition-transform after:duration-300 after:ease-in-expo after:content-[""] hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-transform hover:before:duration-300 hover:before:ease-in-expo hover:after:translate-y-0 hover:after:transition-transform hover:after:delay-300 hover:after:duration-75 hover:after:ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-2 hover:border-solid hover:border-[#094142] before:bg-[#094142] after:bg-[#094142] px-16 py-4 before:-top-1/2 hover:text-background'>
            <p
              className={cn(
                'relative z-[1] transition-colors duration-400 text-[#094142] group-hover:text-[#00b0db] m-0 text-2xl md:text-4xl',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {t2('Download')}
            </p>
          </RoundedBtn>
        </Link>
      </div>
    </main>
  );
}
