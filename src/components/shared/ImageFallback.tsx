'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// Brand tile with the faint spiral, fills its (relative) parent. No text.
export const ImagePlaceholder = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn('absolute inset-0 bg-[#094142]', className)}
  >
    <div
      className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-20"
      style={{ backgroundImage: "url('/images/spiralTrans.png')" }}
    />
  </div>
);

type FallbackImageProps = Omit<ImageProps, 'src' | 'fill'> & {
  src?: string | null;
};

// Fills its relative parent. Shows the placeholder when src is missing or fails to load.
export const FallbackImage = ({ src, alt, ...props }: FallbackImageProps) => {
  // I remember which src failed, so a new src gets a fresh try
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <ImagePlaceholder />;

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill
      onError={() => setFailedSrc(src)}
    />
  );
};
