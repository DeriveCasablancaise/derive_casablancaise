'use client';

import { cn } from '../../lib/utils';
import { useLocale } from 'next-intl';
import React from 'react';
import Image from 'next/image';

interface ArtistProps {
  index: number;
  name: string;
  src: string;
  manageModal: (active: boolean, index: number, x: number, y: number) => void;
}

const Artist = ({ index, name, src, manageModal }: ArtistProps) => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      onMouseEnter={(e) => manageModal(true, index, e.clientX, e.clientY)}
      onMouseLeave={(e) => manageModal(false, index, e.clientX, e.clientY)}
      className={cn(
        'relative w-full h-[300px] flex items-center justify-center cursor-pointer transition-all duration-300 group'
      )}
    >
      <Image
        src={`/images/${src}`}
        alt={name}
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 group-hover:scale-110"
      />
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 group-hover:opacity-100'
        )}
      >
        <span className={cn('text-white text-xl font-bold')}>{name}</span>
      </div>
    </div>
  );
};

export default Artist;
