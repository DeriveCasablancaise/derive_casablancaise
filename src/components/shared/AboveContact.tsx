'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AboveContact = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [150, -20]);

  return (
    <motion.div
      style={{ height }}
      className={cn('relative mt-24 bg-[#141516] ')}
    >
      <div
        className={cn(
          'h-full md:h-[300%] w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-[1] '
        )}
        style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
      ></div>
    </motion.div>
  );
};

export default AboveContact;
