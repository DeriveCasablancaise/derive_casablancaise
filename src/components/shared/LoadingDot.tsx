'use client';

import { motion } from 'framer-motion';

interface LoadingDotProps {
  delay: number;
}

export const LoadingDot: React.FC<LoadingDotProps> = ({ delay }) => {
  return (
    <motion.span
      initial={{ y: 0 }}
      animate={{ y: [-8, 0] }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: delay,
        ease: 'easeInOut',
      }}
      className="inline-block"
    >
      .
    </motion.span>
  );
};
