'use client';

import { motion } from 'framer-motion';
import { LoadingDot } from './LoadingDot';
import { useLocale } from 'next-intl';

export const ComingSoon = () => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="text-center p-8 md:p-12  text-white"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold mb-4 tracking-wide latin-title-light"
        >
          {isArabic ? 'تحت الإنشاء' : 'En Construction'}
          <span className="inline-flex mx-4">
            <LoadingDot delay={0} />
            <LoadingDot delay={0.2} />
            <LoadingDot delay={0.4} />
          </span>
        </motion.h1>
      </motion.div>
    </div>
  );
};
