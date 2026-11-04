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
  // show a clearly landscape image whole (object-contain) instead of cropping it
  containLandscape?: boolean;
};

// above this width / height a photo is a group or a wide shot, cropping it loses people
const LANDSCAPE_RATIO = 1.2;

// Fills its relative parent. Shows the placeholder when src is missing or fails to load.
export const FallbackImage = ({
  src,
  alt,
  containLandscape,
  className,
  onLoad,
  ...props
}: FallbackImageProps) => {
  // I remember which src failed, so a new src gets a fresh try
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [landscapeSrc, setLandscapeSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) return <ImagePlaceholder />;

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      fill
      // the box keeps its size, only the fit inside changes
      className={cn(
        className,
        containLandscape && landscapeSrc === src && 'object-contain object-center'
      )}
      onLoad={(e) => {
        const img = e.currentTarget;
        if (
          containLandscape &&
          img.naturalHeight > 0 &&
          img.naturalWidth / img.naturalHeight > LANDSCAPE_RATIO
        ) {
          setLandscapeSrc(src);
        }
        onLoad?.(e);
      }}
      onError={() => setFailedSrc(src)}
    />
  );
};
