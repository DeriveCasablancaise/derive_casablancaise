'use client';

import { cn } from '../../lib/utils';
import { useLocale } from 'next-intl';
import React from 'react';

interface ProjectProps {
  index: number;
  title: string;
  manageModal: (active: boolean, index: number, x: number, y: number) => void;
}

const Project = ({ index, title, manageModal }: ProjectProps) => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      onMouseEnter={(e) => manageModal(true, index, e.clientX, e.clientY)}
      onMouseLeave={(e) => manageModal(false, index, e.clientX, e.clientY)}
      className={cn(
        'flex w-full justify-between items-center px-8 py-8 xl:py-[50px] border-t border-t-[#00b0db] cursor-pointer transition-all duration-200 last:border-b last:border-b-[#00b0db] text-[#00b0db] hover:text-[#ee7103] group '
      )}
    >
      <h2
        className={cn(
          'font-normal text-2xl md:text-4xl  transition-all duration-300 group-hover:transform group-hover:-translate-x-2  ',
          isArabic ? 'arabic-title-bold' : 'latin-title-bold'
        )}
      >
        {title}
      </h2>
    </div>
  );
};

export default Project;
