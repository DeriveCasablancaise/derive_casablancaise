'use client';

import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  isArabic: boolean;
}

export const EmptyState = ({ isArabic }: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] bg-[#E9EAEB] rounded-lg">
      <Users className="w-16 h-16 text-[rgb(9,65,66)] mb-4" />
      <p
        className={cn(
          'text-xl text-[#094142]',
          isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular'
        )}
      >
        {isArabic
          ? 'لا يوجد فنانين متاحين حاليًا'
          : 'Aucun artiste disponible pour le moment'}
      </p>
    </div>
  );
};
