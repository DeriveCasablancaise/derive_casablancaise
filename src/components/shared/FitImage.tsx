'use client';

import { useCallback, useState, type ReactNode, type SyntheticEvent } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_RATIO, ratioFrom } from '@/lib/image-ratio';

// Natural ratio of each src, read when the image loads. Several images can
// share one store, so a gallery knows a slide's ratio from its thumbnail.
export const useImageRatios = () => {
  const [ratios, setRatios] = useState<Record<string, number>>({});

  const ratioOf = useCallback(
    (src?: string | null) => (src && ratios[src]) || DEFAULT_RATIO,
    [ratios],
  );

  const onLoadFor = useCallback(
    (src?: string | null) => (e: SyntheticEvent<HTMLImageElement>) => {
      if (!src) return;
      const img = e.currentTarget;
      const r = ratioFrom(img.naturalWidth, img.naturalHeight);
      setRatios((prev) => (prev[src] === r ? prev : { ...prev, [src]: r }));
    },
    [],
  );

  return { ratioOf, onLoadFor };
};

// Classes of a justified tile; its style comes from tileStyle(ratio).
// Below 480px a tile takes the full width at its own ratio.
export const justifiedTileClass =
  'relative block min-w-0 max-w-full grow-[var(--tile-grow)] basis-[var(--tile-basis-sm)] md:basis-[var(--tile-basis)] max-[479px]:basis-full';

// flex-wrap rows; the filler at the end soaks up the last row's free space,
// so its tiles keep the target height instead of stretching across
export const JustifiedGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-wrap gap-4 md:gap-6', className)}>
    {children}
    <div
      aria-hidden="true"
      className="h-0 basis-0 grow-[100000] max-[479px]:hidden"
    />
  </div>
);

// White text over black at 75% stays above 10:1 even on a pure white photo.
// 'bottom' is for titles at the foot of a card, 'center' for centred titles.
const SCRIMS = {
  bottom:
    'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.65) 35%, rgba(0,0,0,0) 60%)',
  center:
    'radial-gradient(ellipse at center, rgba(0,0,0,.75) 0%, rgba(0,0,0,.6) 45%, rgba(0,0,0,.35) 100%)',
} as const;

export const Scrim = ({
  variant = 'bottom',
  className,
}: {
  variant?: keyof typeof SCRIMS;
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={cn('pointer-events-none absolute inset-0', className)}
    style={{ backgroundImage: SCRIMS[variant] }}
  />
);

export const textOnImageClass =
  'text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)]';
