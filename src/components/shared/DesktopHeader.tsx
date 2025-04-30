'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import DesktopNav from './DesktopNav';

const DesktopHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50); // Change the value as needed
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'w-screen justify-center hidden lg:flex lg:justify-center lg:items-center fixed top-0 z-50 transition-all duration-300 gap-20 bg-[#094142] lg:h-[15vh] shadow-xl'
      )}
    >
      <DesktopNav />
    </div>
  );
};

export default DesktopHeader;
