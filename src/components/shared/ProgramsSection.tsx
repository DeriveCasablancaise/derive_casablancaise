'use client';

import { useRef } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { CategoryImageButton } from './Derive2024/CategoryImageBtn';
import { CATEGORIES, getEdition, type EditionYear } from '@/constants/editions';
import ProgrammeLink from './ProgrammeLink';

interface ProgramSectionProps {
  edition: EditionYear;
}

const ProgramSection = ({ edition }: ProgramSectionProps) => {
  const {
    translationNamespace,
    categories,
    categoryImages,
    programmePdf,
    programmeBook,
  } = getEdition(edition);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations(translationNamespace ?? 'Layout');
  const t2 = useTranslations('Layout');

  return (
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
          {translationNamespace && (
            <h2
              className={cn(
                'text-2xl xl:text-4xl text-brand-title mb-12 text-center',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold',
              )}
            >
              {t('heading')}
            </h2>
          )}

          {/* Category Image Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-12"
          >
            {/* wraps and centres, so any count leaves no empty cell */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {categories.map((category, index) => (
                <div
                  key={category}
                  className="w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                >
                  <CategoryImageButton
                    categoryKey={category}
                    categoryName={CATEGORIES[category]}
                    imageUrl={categoryImages?.[category]}
                    isSelected={false}
                    isArabic={isArabic}
                    onClick={() => {}} // Not used in navigation mode
                    index={index}
                    isInView={isInView}
                    isNavigationMode={true}
                    locale={locale}
                    edition={edition}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Download Button */}
        {programmePdf && (
          <div
            className={cn(
              'flex justify-center mt-16 text-[#094142] text-base lg:text-2xl',
              isArabic ? 'arabic-title-light' : 'latin-title-light',
            )}
          >
            <ProgrammeLink href={programmePdf} programmeBook={programmeBook}>
              {t2('Download')}
            </ProgrammeLink>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProgramSection;
