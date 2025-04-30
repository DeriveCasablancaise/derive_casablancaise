'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fadeIn } from '@/variants';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeaserModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-screen h-dvh bg-black flex flex-col justify-center items-center z-[999] p-4 sm:p-6 md:p-8 "
    >
      <div className="flex justify-end items-center mb-4 w-full absolute top-0 left-0 p-4 md:p-8 2xl:p-12">
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <motion.div
        variants={fadeIn('up', 0.1)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="w-full h-[400px] 2xl:h-[560px] "
      >
        <iframe
          src={`https://www.youtube.com/embed/chv70l147CE`}
          width="100%"
          height="100%"
          frameBorder={0}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </motion.div>
    </motion.div>
  );
};

export default TeaserModal;
