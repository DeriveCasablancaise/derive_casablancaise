'use client';

import { cn } from '@/lib/utils';

export const Categories = {
  '2022': { fr: 'Édition 2022', ar: 'نسخة 2022' },
  '2024': { fr: 'Édition 2024', ar: 'نسخة 2024' },
} as const;

export type CategoryKey = keyof typeof Categories;

interface CategoryFilterProps {
  selectedCategories: Set<CategoryKey>;
  onCategoryChange: (category: CategoryKey) => void;
  isArabic: boolean;
  heading: string;
}

export const CategoryFilter = ({
  selectedCategories,
  onCategoryChange,
  isArabic,
  heading,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-col mb-8">
      <h3
        className={cn(
          'text-xl mb-4 text-[#094142]',
          isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
        )}
      >
        {isArabic ? 'النسخ' : 'Éditions'}
      </h3>
      <div className="flex flex-col gap-4">
        {(Object.keys(Categories) as CategoryKey[]).map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'text-left text-lg md:text-xl transition-all duration-300 relative w-fit',
              'before:content-[""] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5',
              'before:bg-[#00b0db] before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300',
              selectedCategories.has(category)
                ? 'text-[#00b0db] before:scale-x-100'
                : 'text-[#094142] hover:text-[#00b0db] hover:before:scale-x-100',
              isArabic
                ? 'arabic-subtitle-regular text-right'
                : 'latin-subtitle-regular'
            )}
          >
            {isArabic ? Categories[category].ar : Categories[category].fr}
          </button>
        ))}
      </div>
    </div>
  );
};
