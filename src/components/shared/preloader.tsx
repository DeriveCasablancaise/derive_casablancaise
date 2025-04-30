'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn, opacity, slideUp } from '../../lib/utils';
import { usePathname } from 'next/navigation';
import { useLenis } from '../hooks/use-lenis';
import { useTimeOut } from '../hooks/use-time-out';
import { useLocale } from 'next-intl';

type PreloaderProps = {
  pageName?: string;
};

const words = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Olà',
  'مرحبا بكم',
  'Guten tag',
  'Hallo',
];

export default function Preloader({ pageName }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const locale = useLocale();
  const isArabic = locale === 'ar';

  useEffect(() => {
    const updateDimensions = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (index == words.length - 1) return;
    setTimeout(
      () => {
        setIndex(index + 1);
      },
      index == 0 ? 1000 : 150
    );
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  }  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height}  L0 0`;

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="h-screen w-screen flex items-center justify-center fixed z-[99] bg-[#094142]"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            variants={opacity}
            initial="initial"
            animate="enter"
            className={cn(
              'flex font-bold text-[#ee7103] text-[42px] items-center justify-center text-center absolute z-[1] ',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {pageName ? pageName : words[index]}
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)] ">
            <motion.path
              variants={curve}
              initial="initial"
              exit="exit"
              className="fill-[#094142]"
            ></motion.path>
          </svg>
        </>
      )}
    </motion.div>
  );
}

type TransitionProps = {
  children: React.ReactNode;
  pageName?: string; // Add pageName as a prop
};

export function Transition({ children, pageName }: TransitionProps) {
  const [isLoading, setLoading] = useState(true);
  const pathname = usePathname();

  useLenis();
  useTimeOut({
    callback: () => {
      setLoading(false);
      window.scrollTo(0, 0);
    },
    duration: 2000,
    deps: [pathname],
  });

  return (
    <div key={pathname} className="overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? <Preloader pageName={pageName} /> : null}
      </AnimatePresence>
      {children}
    </div>
  );
}
