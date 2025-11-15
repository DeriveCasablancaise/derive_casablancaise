'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { fadeIn } from '@/variants';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoLink: string;
}

const TeaserModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoLink,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 w-screen h-dvh bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center z-[999] p-4 sm:p-6 md:p-8"
          onClick={onClose}
        >
          {/* Close button with animated ring effect */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-[#00b0db] transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close modal"
          >
            <div className="relative">
              <X size={32} className="relative z-20" />
              <motion.div
                className="absolute inset-0 bg-[#094142]/20 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </div>
          </motion.button>

          {/* Video container with animation */}
          <motion.div
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full max-w-6xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Custom decorative corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00b0db]"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00b0db]"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00b0db]"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00b0db]"></div>

            <iframe
              src={videoLink}
              width="100%"
              height="100%"
              frameBorder={0}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeaserModal;
