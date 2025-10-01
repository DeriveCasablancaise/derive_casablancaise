'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SubCategories = {
  rencontres: { fr: 'Rencontres', ar: 'لقاءات' },
  expositions: { fr: 'Expositions', ar: 'معارض' },
} as const;

type SubCategoryKey = keyof typeof SubCategories;

interface SubCategorySelectorProps {
  selectedSubCategory: SubCategoryKey | null;
  onSubCategorySelect: (subCategory: SubCategoryKey) => void;
  isArabic: boolean;
}

const SubCategorySelector: React.FC<SubCategorySelectorProps> = ({
  selectedSubCategory,
  onSubCategorySelect,
  isArabic,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div
        className={cn(
          'flex flex-col sm:flex-row gap-4 justify-center items-center',
          isArabic && 'sm:flex-row-reverse'
        )}
      >
        <h3
          className={cn(
            'text-lg font-semibold text-[#094142] mb-2 sm:mb-0',
            isArabic
              ? 'arabic-subtitle-regular text-right'
              : 'latin-subtitle-regular'
          )}
        >
          {isArabic ? 'اختر نوع المحتوى:' : 'Choisissez le type de contenu:'}
        </h3>

        <div className="flex gap-3">
          {(Object.keys(SubCategories) as SubCategoryKey[]).map((subCat) => (
            <button
              key={subCat}
              onClick={() => onSubCategorySelect(subCat)}
              className={cn(
                'px-6 py-3 rounded-full transition-all duration-300 font-medium',
                isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular',
                selectedSubCategory === subCat
                  ? 'bg-[#ee7103] text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              )}
            >
              {isArabic ? SubCategories[subCat].ar : SubCategories[subCat].fr}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SubCategorySelector;
