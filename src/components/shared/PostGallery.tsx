'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageSliderModal from './PostSlider';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div>
      <div
        className="relative aspect-video cursor-pointer overflow-hidden"
        onClick={() => setIsImageModalOpen(true)}
      >
        <Image
          src={images[0]}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <ImageSliderModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={images}
        alt={alt}
      />
    </div>
  );
};

export default ImageGallery;
