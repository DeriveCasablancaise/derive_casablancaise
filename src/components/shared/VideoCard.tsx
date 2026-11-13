'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PlayCircleIcon } from 'lucide-react';
import { fadeIn } from '@/variants';

interface VideoCardProps {
  title?: string;
  titleIsArabic: boolean;
  thumbnail: string;
  ariaLabel: string;
  sizes: string;
  onOpen: () => void;
}

// one card for every video section: 16:9 box, same play button, same title
const VideoCard = ({
  title,
  titleIsArabic,
  thumbnail,
  ariaLabel,
  sizes,
  onOpen,
}: VideoCardProps) => (
  <motion.div
    variants={fadeIn('up', 0.1)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-col items-center w-full"
  >
    <button
      type="button"
      onClick={onOpen}
      aria-label={ariaLabel}
      className="relative block w-full aspect-video overflow-hidden rounded-lg shadow-md cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-title focus-visible:ring-offset-2"
    >
      <Image
        src={thumbnail}
        fill
        sizes={sizes}
        alt={title ?? ''}
        className="object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0.8 }}
          whileHover={{ scale: 1.1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className="block bg-white/20 backdrop-blur-md rounded-full p-6"
        >
          <PlayCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-brand-title" />
        </motion.span>
      </span>
    </button>
    {title && (
      <h3
        className={cn(
          'mt-4 text-center font-bold text-brand-title text-base md:text-lg',
          titleIsArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
        )}
      >
        {title}
      </h3>
    )}
  </motion.div>
);

export default VideoCard;
