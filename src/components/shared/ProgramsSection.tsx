'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { getPostsByStartDate } from '@/lib/actions/post.actions';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import type { IPost } from '@/lib/database/models/post.model';
import { useSearchParams, useRouter } from 'next/navigation';
import RoundedBtn from './rounded';
import ClientWrapper from './PostWrapper';
import { CategoryImageButton } from './Derive2024/CategoryImageBtn';

const Categories = {
  danse: { fr: 'Danse', ar: 'رقص' },
  musique: { fr: 'Musique', ar: 'حفلة موسيقية' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  conference: { fr: 'Conférence', ar: 'مؤتمر' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
  autres: { fr: 'En Marge...', ar: 'أخرى' },
} as const;

type CategoryKey = keyof typeof Categories;

const categoryImageMap: Record<CategoryKey, string> = {
  danse: '/placeholder.svg?height=300&width=400',
  musique: '/placeholder.svg?height=300&width=400',
  theatre: '/placeholder.svg?height=300&width=400',
  lectures: '/placeholder.svg?height=300&width=400',
  cinema: '/placeholder.svg?height=300&width=400',
  conference: '/placeholder.svg?height=300&width=400',
  ateliers: '/placeholder.svg?height=300&width=400',
  autres: '/placeholder.svg?height=300&width=400',
};

const ProgramSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [posts, setPosts] = useState<IPost[]>([]);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('Derive2024');
  const t2 = useTranslations('Layout');
  const [selectedCategories, setSelectedCategories] = useState<
    Set<CategoryKey>
  >(new Set());
  const searchParams = useSearchParams();
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    // Get category from URL parameters
    const categoryParam = searchParams.get('category') as CategoryKey | null;
    if (categoryParam && Object.keys(Categories).includes(categoryParam)) {
      setSelectedCategories(new Set([categoryParam]));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getPostsByStartDate();
      if (allPosts) {
        let filteredPosts = allPosts;
        // Filter by categories if selected
        if (selectedCategories.size > 0) {
          filteredPosts = filteredPosts.filter((post: IPost) =>
            selectedCategories.has(post.postCategory as CategoryKey)
          );
        }
        setPosts(filteredPosts);
      }
    };
    fetchPosts();
  }, [selectedCategories]);

  const handleCategoryToggle = (category: CategoryKey) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = new Set(prevCategories);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      // Update URL with categories parameter
      const params = new URLSearchParams(searchParams);
      if (newCategories.size > 0) {
        params.set('category', Array.from(newCategories).join(','));
      } else {
        params.delete('category');
      }
      router.push(`?${params.toString()}#program_section`, { scroll: false });
      return newCategories;
    });
  };

  return (
    <ClientWrapper>
      <section ref={sectionRef} id="program_section" className="">
        <motion.div
          variants={landingSlideUp}
          initial="initial"
          animate="enter"
          className="mx-auto py-8 xl:py-20 px-4 md:px-8 lg:px-16"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <h2
              className={cn(
                'text-2xl xl:text-4xl text-[#FF5C00] mb-12 text-center',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {t('heading')}
            </h2>

            {/* Categories Filter - Horizontal */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
                {(Object.keys(Categories) as CategoryKey[]).map(
                  (category, index) => (
                    <motion.button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className={cn(
                        'text-lg md:text-xl transition-all duration-300 relative whitespace-nowrap',
                        "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5",
                        'before:bg-[#00b0db] before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300',
                        selectedCategories.has(category)
                          ? 'text-[#00b0db] before:scale-x-100 font-semibold'
                          : 'text-[#094142] hover:text-[#00b0db] hover:before:scale-x-100',
                        isArabic
                          ? 'arabic-subtitle-regular'
                          : 'latin-subtitle-regular'
                      )}
                    >
                      {isArabic
                        ? Categories[category].ar
                        : Categories[category].fr}
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-12"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {(Object.keys(Categories) as CategoryKey[]).map(
                  (category, index) => (
                    <CategoryImageButton
                      key={category}
                      categoryKey={category}
                      categoryName={Categories[category]}
                      imageUrl={categoryImageMap[category]}
                      isSelected={selectedCategories.has(category)}
                      isArabic={isArabic}
                      onClick={handleCategoryToggle}
                      index={index}
                      isInView={isInView}
                    />
                  )
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Posts Grid - Full Width */}
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    className="shadow-lg overflow-hidden"
                  >
                    <Link
                      href={`/${locale}/derive-2024/${post._id}`}
                      className="block aspect-[16/9] md:aspect-[3/4] lg:aspect-[1/1] relative group overflow-hidden"
                    >
                      {post.images && (
                        <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                          <Image
                            src={post.images[0] || '/placeholder.svg'}
                            alt={isArabic ? post.arabicTitle : post.frenchTitle}
                            layout="fill"
                            objectFit="cover"
                            className="transform transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <h3
                          className={cn(
                            'text-white text-lg mb-1 font-semibold lowercase',
                            isArabic
                              ? 'arabic-subtitle-regular'
                              : 'latin-subtitle-regular'
                          )}
                        >
                          {isArabic ? post.arabicTitle : post.frenchTitle}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : selectedCategories.size > 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] bg-[#E9EAEB] rounded-lg">
                  <Calendar className="w-16 h-16 text-[rgb(9,65,66)] mb-4" />
                  <p
                    className={cn(
                      'text-xl text-[#094142]',
                      isArabic
                        ? 'arabic-subtitle-regular'
                        : 'latin-subtitle-regular'
                    )}
                  >
                    {isArabic
                      ? 'لا يوجد محتوى متاح حاليًا'
                      : 'Aucun contenu disponible pour le moment'}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Download Button */}
          <div
            className={cn(
              'flex justify-center mt-16 text-[#094142] text-base lg:text-2xl',
              isArabic ? 'arabic-title-light' : 'latin-title-light'
            )}
          >
            <Link href="/programme.pdf" download target="_blank">
              {t2('Download')}
            </Link>
          </div>
        </motion.div>
        {/* <motion.div
        style={{ height }}
        className={cn('relative mt-56 bg-[#E9EAEB]')}
      >
        <div
          className={cn(
            'h-full  w-[120%] -left-[10%] custom-border-radius bg-[#E9EAEB] absolute z-20 '
          )}
          style={{ boxShadow: '0px 60px 50px rgba(0, 0, 0, 0.748)' }}
        ></div>
      </motion.div> */}
      </section>
    </ClientWrapper>
  );
};

export default ProgramSection;
