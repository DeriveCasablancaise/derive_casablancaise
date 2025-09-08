'use client';

import { useRef } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import ClientWrapper from './PostWrapper';
import { CategoryImageButton } from './Derive2024/CategoryImageBtn';

const Categories = {
  danse: { fr: 'Danse', ar: 'رقص' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  musique: { fr: 'Musique', ar: 'حفلة موسيقية' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  conference: { fr: 'Conférences', ar: 'مؤتمر' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
  autres: { fr: 'En Marge...', ar: 'أخرى' },
} as const;

type CategoryKey = keyof typeof Categories;

const categoryImageMap: Record<CategoryKey, string> = {
  danse: '/assets/categories/danse.jpg',
  theatre: '/assets/categories/theatre.jpg',
  musique: '/assets/categories/musique.jpg',
  lectures: '/assets/categories/lectures.jpeg',
  cinema: '/assets/categories/cinema.jpg',
  conference: '/assets/categories/conférences.jpg',
  ateliers: '/assets/categories/ateliers.jpg',
  autres: '/assets/categories/autres.jpg',
};

const ProgramSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Derive2024');
  const t2 = useTranslations('Layout');

  return (
    <ClientWrapper>
      <section ref={sectionRef} id="program_section" className="">
        <motion.div
          variants={landingSlideUp}
          initial="initial"
          animate="enter"
          className="mx-auto py-8 xl:py-20 px-4 md:px-8 lg:px-16"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <h2
              className={cn(
                'text-2xl xl:text-4xl text-[#FF5C00] mb-12 text-center',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {t('heading')}
            </h2>

            {/* Category Image Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {(Object.keys(Categories) as CategoryKey[]).map(
                  (category, index) => (
                    <CategoryImageButton
                      key={category}
                      categoryKey={category}
                      categoryName={Categories[category]}
                      imageUrl={categoryImageMap[category]}
                      isSelected={false}
                      isArabic={isArabic}
                      onClick={() => {}} // Not used in navigation mode
                      index={index}
                      isInView={isInView}
                      isNavigationMode={true}
                      locale={locale}
                    />
                  )
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Download Button */}
          <div
            className={cn(
              'flex justify-center mt-16 text-[#094142] text-base lg:text-2xl',
              isArabic ? 'arabic-title-light' : 'latin-title-light'
            )}
          >
            <a href="/programme.pdf" download target="_blank">
              {t2('Download')}
            </a>
          </div>
        </motion.div>
      </section>
    </ClientWrapper>
  );
};

export default ProgramSection;
