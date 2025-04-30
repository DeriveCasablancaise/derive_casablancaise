'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ImageSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  alt: string;
}

const ImageSliderModal: React.FC<ImageSliderModalProps> = ({
  isOpen,
  onClose,
  images,
  alt,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-screen h-dvh bg-black bg-opacity-90 flex flex-col justify-center items-center z-[999] p-4 sm:p-6 md:p-8"
    >
      <div className="flex justify-between items-center mb-4 w-full absolute top-0 left-0 p-4 md:p-8 2xl:p-12">
        <span className="text-white text-lg">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full h-[calc(100vh-200px)] max-w-4xl"
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          layout="fill"
          objectFit="contain"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#094142] bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} className="text-[#00b0db]" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#094142] bg-opacity-50 p-2 rounded-full hover:bg-opacity-100 transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={24} className="text-[#00b0db]" />
        </button>
      </motion.div>

      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-[#00b0db]' : 'bg-[#00b0db]/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ImageSliderModal;
