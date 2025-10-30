'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import type { IPost } from '@/lib/database/models/post.model';
import { useRouter } from 'next/navigation';
import ClientWrapper from '../PostWrapper';
import { ParentLink } from '@/components/shared/ParentLink';
import SubCategorySelector from './SubcategorySelector';

const Categories = {
  danse: { fr: 'Danse', ar: 'رقص' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  musique: { fr: 'Musique', ar: 'حفلة موسيقية' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  conference: { fr: 'Conférences', ar: 'مؤتمر' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
  autres: { fr: 'En Marge...', ar: 'أخرى' },
} as const;

type CategoryKey = keyof typeof Categories;

const SubCategories = {
  rencontres: { fr: 'Rencontres', ar: 'لقاءات' },
  expositions: { fr: 'Expositions', ar: 'معارض' },
} as const;

type SubCategoryKey = keyof typeof SubCategories;

interface CategoryPostsClientProps {
  categoryId: CategoryKey;
  initialPosts: IPost[];
  locale: string;
  isArabic: boolean;
}

const CategoryPostsClient: React.FC<CategoryPostsClientProps> = ({
  categoryId,
  initialPosts,
  locale,
  isArabic,
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>(categoryId);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryKey | null>(null);
  const router = useRouter();
  const t = useTranslations('Derive2024');

  useEffect(() => {
    setPosts(initialPosts);
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
  }, [categoryId, initialPosts]);

  const displayedPosts =
    selectedCategory === 'autres' && selectedSubCategory
      ? posts.filter((post) => post.subCategory === selectedSubCategory)
      : posts;

  const handleCategoryChange = (category: CategoryKey) => {
    if (category === selectedCategory) {
      router.push(`/${locale}/derive-2024#program_section`);
    } else {
      router.push(`/${locale}/derive-2024/${category}`);
    }
  };

  const handleSubCategorySelect = (subCategory: SubCategoryKey | null) => {
    setSelectedSubCategory(subCategory);
  };

  return (
    <ClientWrapper>
      <section ref={sectionRef} className="py-8 pt-[20vh] pb-16 mb-24">
        <ParentLink
          label={isArabic ? 'العودة' : 'Retour'}
          className="px-4 mb-4"
          href={`/${locale}/derive-2024#program_section`}
        />

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 px-4"
        >
          <h1
            className={cn(
              'text-2xl xl:text-4xl text-[#FF5C00] mb-8 text-center',
              isArabic ? 'arabic-title-bold' : 'latin-title-bold'
            )}
          >
            {isArabic
              ? Categories[selectedCategory].ar
              : Categories[selectedCategory].fr}
          </h1>

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
                    onClick={() => handleCategoryChange(category)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={cn(
                      'text-lg md:text-xl transition-all duration-300 relative whitespace-nowrap',
                      "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5",
                      'before:bg-[#00b0db] before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300',
                      category === selectedCategory
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

          {selectedCategory === 'autres' && (
            <SubCategorySelector
              selectedSubCategory={selectedSubCategory}
              onSubCategorySelect={handleSubCategorySelect}
              isArabic={isArabic}
            />
          )}
        </motion.div>

        <div className="w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post, index) => (
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
                    href={`/${locale}/derive-2024/post/${post._id}`}
                    className="block aspect-[16/9] md:aspect-[3/4] lg:aspect-[1/1] relative group overflow-hidden"
                  >
                    {post.images && (
                      <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                        <Image
                          src={post.images[0] || '/placeholder.svg'}
                          alt={isArabic ? post.arabicTitle : post.frenchTitle}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3
                        className={cn(
                          'text-white text-lg mb-1 font-semibold capitalize',
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
            ) : (
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
            )}
          </div>
        </div>
      </section>
    </ClientWrapper>
  );
};

export default CategoryPostsClient;
