'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // If only one image, show simple display
  if (images.length === 1) {
    return (
      <div className="w-full">
        <div className="relative aspect-square max-h-[600px] overflow-hidden">
          <Image
            src={images[0]}
            alt={alt}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square max-h-[600px] overflow-hidden group">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-300"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && images.length <= 5 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  currentIndex === index
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="w-full max-w-[600px]">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  'relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all duration-200',
                  currentIndex === index
                    ? 'ring-2 ring-[#ee7103] ring-offset-2'
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-200 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
