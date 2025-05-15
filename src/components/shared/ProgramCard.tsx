'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { IPost } from '@/lib/database/models/post.model';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface ProgramCardProps {
  post: IPost;
  index: number;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ post, index }) => {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <motion.div
      key={post._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden shadow-xl p-2"
      style={{
        backgroundImage: 'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
      }}
    >
      <Link href={`/${locale}/derive-2024/${post._id}`}>
        <div className="aspect-[3/4] relative overflow-hidden">
          {post.images && (
            <Image
              src={post.images[0]}
              alt={isArabic ? post.arabicTitle : post.frenchTitle}
              layout="fill"
              objectFit="cover"
              className="transform transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3
              className={cn(
                'text-lg mb-2',
                isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold'
              )}
            >
              {isArabic ? post.arabicTitle : post.frenchTitle}
            </h3>

            {post.postCategory && (
              <span className="inline-block px-3 py-1 text-xs bg-[#00b0db]/80 rounded-full">
                {post.postCategory}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProgramCard;
