'use client';

import React, { useRef } from 'react';
import AboveContact from '@/components/shared/AboveContact';
import { useScroll, useTransform, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start'],
  });

  const height = useTransform(scrollYProgress, [0, 0.9], [150, -20]);

  return (
    <>
      <div
        ref={container}
        className="flex flex-col gap-[3vw] relative bg-[#E9EAEB] md:mt-16 z-[1]"
      >
        {children}
      </div>
      <motion.div style={{ height }} className={cn('relative bg-[#141516] ')}>
        <div
          className={cn(
            'h-full md:h-[250%] w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-[1] '
          )}
          style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
        ></div>
      </motion.div>
    </>
  );
}
