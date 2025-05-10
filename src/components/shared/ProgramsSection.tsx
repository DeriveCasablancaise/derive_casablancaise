'use client';

import React, { useState } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { getPostsByStartDate } from '@/lib/actions/post.actions';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IPost } from '@/lib/database/models/post.model';
import RoundedBtn from '../shared/rounded';

const ProgramSection = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Derive2024');
  const t2 = useTranslations('Layout');

  React.useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPostsByStartDate();
      if (allPosts) {
        setPosts(allPosts);
      }
    };
    fetchPosts();
  }, []);

  const showMorePosts = () => {
    setVisiblePosts((prev) => prev + 6);
  };

  return (
    <section className="bg-[#E9EAEB] py-16 md:py-24">
      <motion.div
        variants={landingSlideUp}
        initial="initial"
        animate="enter"
        className="container mx-auto px-4"
      >
        <h2
          className={cn(
            'text-3xl md:text-5xl text-[#094142] mb-12 text-center',
            isArabic ? 'arabic-title-bold' : 'latin-title-bold'
          )}
        >
          {t('heading')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, visiblePosts).map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden shadow-xl p-2"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #094142 0%, #00b0db 100%)',
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
                        isArabic
                          ? 'arabic-subtitle-bold'
                          : 'latin-subtitle-bold'
                      )}
                    >
                      {isArabic ? post.arabicTitle : post.frenchTitle}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length > visiblePosts && (
          <div className="mt-12 text-center">
            <button
              onClick={showMorePosts}
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-[#094142] rounded-full hover:bg-[#00b0db] transition-colors duration-300"
            >
              {isArabic ? 'عرض المزيد' : 'Voir plus'}
            </button>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/programme.pdf" download target="_blank">
            <RoundedBtn className="relative text-base group inline-flex items-center justify-center overflow-hidden rounded-full font-bold ring-offset-background transition-colors hover:border-2 hover:border-solid hover:border-[#094142] before:bg-[#094142] after:bg-[#094142] px-16 py-4 before:-top-1/2 hover:text-background">
              <p
                className={cn(
                  'relative z-[1] transition-colors duration-400 text-[#094142] group-hover:text-[#00b0db] m-0 text-2xl md:text-4xl',
                  isArabic ? 'arabic-title-bold' : 'latin-title-bold'
                )}
              >
                {t2('Download')}
              </p>
            </RoundedBtn>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default ProgramSection;
