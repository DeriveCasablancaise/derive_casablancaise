'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { fadeIn } from '@/variants';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onResetFilter: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onCategoryChange,
  onResetFilter,
}) => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <motion.div
      variants={fadeIn('up', 0.2)}
      initial="initial"
      animate="enter"
      className={cn(
        'flex flex-wrap gap-3 justify-center mb-10',
        isArabic ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <button
        onClick={onResetFilter}
        className={cn(
          'px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300',
          'border-2',
          selectedCategories.length === 0
            ? 'bg-[#094142] text-white border-[#094142]'
            : 'bg-transparent text-[#094142] border-[#094142] hover:bg-[#094142]/10'
        )}
      >
        {isArabic ? 'الكل' : 'Tous'}
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300',
            'border-2',
            selectedCategories.includes(category)
              ? 'bg-gradient-to-r from-[#094142] to-[#00b0db] text-white border-transparent'
              : 'bg-transparent text-[#094142] border-[#094142] hover:bg-[#094142]/10'
          )}
        >
          {category}
        </button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
