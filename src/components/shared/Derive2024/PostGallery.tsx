'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FallbackImage, ImagePlaceholder } from '../ImageFallback';
import { PhotoCredit } from '../PhotoCredit';
import {
  altWithCredit,
  creditFor,
  type ImageCredit,
} from '@/lib/photo-credits';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  // artist pages: every photo whole in a true square, on the dark green frame
  contain?: boolean;
  credits?: ImageCredit[];
  isArabic?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt,
  contain,
  credits,
  isArabic = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainBox = contain
    ? 'relative mx-auto aspect-square w-full max-w-[600px] overflow-hidden bg-[#094142]'
    : 'relative aspect-square max-h-[600px] overflow-hidden';

  // fill ignores the parent's padding, so the frame comes from an inset wrapper
  // every slide carries its own credit, on the image and in its alt
  const mainImage = (src: string, baseAlt: string, coverClass: string) => {
    const credit = creditFor(credits, src);
    const imageAlt = altWithCredit(baseAlt, credit, isArabic);
    return (
      <>
        {contain ? (
          <div className="absolute inset-2">
            <FallbackImage
              src={src}
              alt={imageAlt}
              className="object-contain object-center"
            />
          </div>
        ) : (
          <FallbackImage src={src} alt={imageAlt} className={coverClass} />
        )}
        <PhotoCredit
          credit={credit}
          isArabic={isArabic}
          className={
            contain ? cn('bottom-3', isArabic ? 'left-3' : 'right-3') : undefined
          }
        />
      </>
    );
  };

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

  // nothing to show: one decorative block, same shape as the gallery
  if (images.length === 0) {
    return (
      <div className="w-full">
        <div className={mainBox}>
          <ImagePlaceholder />
        </div>
      </div>
    );
  }

  // If only one image, show simple display
  if (images.length === 1) {
    return (
      <div className="w-full">
        <div className={mainBox}>
          {mainImage(
            images[0],
            alt,
            'object-cover transition-transform duration-300',
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div className={cn(mainBox, 'group')}>
        {mainImage(
          images[currentIndex],
          `${alt} - Image ${currentIndex + 1}`,
          'object-cover transition-all duration-300',
        )}

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
        <div className={cn('w-full max-w-[600px]', contain && 'mx-auto')}>
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  'relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden transition-all duration-200',
                  contain && 'bg-[#094142]',
                  currentIndex === index
                    ? 'ring-2 ring-brand-orange ring-offset-1'
                    : 'opacity-70 hover:opacity-100'
                )}
              >
                <FallbackImage
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  className={
                    contain
                      ? 'object-contain object-center'
                      : 'object-cover transition-transform duration-200 hover:scale-105'
                  }
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
