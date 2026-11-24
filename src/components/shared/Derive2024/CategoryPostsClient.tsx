'use client';

import type React from 'react';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import type { IPost } from '@/lib/database/models/post.model';
import { useRouter } from 'next/navigation';
import ClientWrapper from '../PostWrapper';
import { FallbackImage } from '../ImageFallback';
import { PhotoCredit } from '../PhotoCredit';
import {
  JustifiedGrid,
  Scrim,
  justifiedTileClass,
  textOnImageClass,
  useImageRatios,
} from '../FitImage';
import { tileStyle } from '@/lib/image-ratio';
import { altWithCredit, creditFor } from '@/lib/photo-credits';
import { ParentLink } from '@/components/shared/ParentLink';
import SubCategorySelector from './SubcategorySelector';
import {
  CATEGORIES,
  categoryHref,
  editionHref,
  getEdition,
  postHref,
  type CategoryKey,
  type EditionYear,
} from '@/constants/editions';
import { formatCardLines, hasSessions } from '@/lib/post-sessions';


const SubCategories = {
  rencontres: { fr: 'Rencontres', ar: 'لقاءات' },
  expositions: { fr: 'Expositions', ar: 'معارض' },
  productions: { fr: 'Productions', ar: 'إنتاجات' },
} as const;

type SubCategoryKey = keyof typeof SubCategories;

// one line per day with its times, in order; older editions only show it for
// session lists. The block sits at the card's foot, so extra lines push it up.
const DateLine = ({
  post,
  isArabic,
  edition,
}: {
  post: IPost;
  isArabic: boolean;
  edition: EditionYear;
}) => {
  if (edition !== '2026' && !hasSessions(post)) return null;
  const lines = formatCardLines(post, isArabic);
  if (lines.length === 0) return null;
  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cn(
        textOnImageClass,
        'text-sm text-start',
        isArabic ? 'arabic-subtitle-regular' : 'latin-subtitle-regular',
      )}
    >
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
};

interface CategoryPostsClientProps {
  categoryId: CategoryKey;
  initialPosts: IPost[];
  locale: string;
  isArabic: boolean;
  edition: EditionYear;
}

const CategoryPostsClient: React.FC<CategoryPostsClientProps> = ({
  categoryId,
  initialPosts,
  locale,
  isArabic,
  edition,
}) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>(categoryId);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategoryKey | null>(null);
  const router = useRouter();
  const { ratioOf, onLoadFor } = useImageRatios();

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
      router.push(
        `/${locale}${editionHref(edition)}#program_section`,
      );
    } else {
      router.push(
        `/${locale}${categoryHref(edition, category)}`,
      );
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
          href={`/${locale}${editionHref(edition)}#program_section`}
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
              isArabic ? 'arabic-title-bold' : 'latin-title-bold',
            )}
          >
            {isArabic
              ? CATEGORIES[selectedCategory].ar
              : CATEGORIES[selectedCategory].fr}
          </h1>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
              {getEdition(edition).categories.map(
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
                        : 'latin-subtitle-regular',
                    )}
                  >
                    {isArabic
                      ? CATEGORIES[category].ar
                      : CATEGORIES[category].fr}
                  </motion.button>
                ),
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
          {displayedPosts.length > 0 ? (
            <JustifiedGrid className="md:gap-6">
              {displayedPosts.map((post, index) => {
                const src = post.thumbnailImage || post.images?.[0];
                const credit = creditFor(post.imageCredits, src);
                return (
                  <div
                    key={post._id}
                    className={justifiedTileClass}
                    style={tileStyle(ratioOf(src))}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="h-full w-full"
                    >
                      {/* the whole card scales on hover, so the photo is never cropped */}
                      <Link
                        href={`/${locale}${postHref(edition, post._id)}`}
                        className="block h-full w-full relative overflow-hidden shadow-lg transition-transform duration-700 ease-out hover:scale-[1.03]"
                      >
                        <FallbackImage
                          src={src}
                          alt={altWithCredit(post.frenchTitle, credit, isArabic)}
                          className="object-contain"
                          sizes="(max-width: 479px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          onLoad={onLoadFor(src)}
                        />
                        <Scrim />
                        <PhotoCredit
                          credit={credit}
                          isArabic={isArabic}
                          position="top-end"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <h3
                            className={cn(
                              textOnImageClass,
                              'text-lg mb-1 font-semibold capitalize',
                              isArabic
                                ? 'arabic-subtitle-regular'
                                : 'latin-subtitle-regular',
                            )}
                          >
                            {isArabic && post.arabicTitle
                              ? post.arabicTitle
                              : post.frenchTitle}
                          </h3>
                          <DateLine
                            post={post}
                            isArabic={isArabic}
                            edition={edition}
                          />
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </JustifiedGrid>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#E9EAEB] rounded-lg">
              <Calendar className="w-16 h-16 text-[rgb(9,65,66)] mb-4" />
              <p
                className={cn(
                  'text-xl text-[#094142]',
                  isArabic
                    ? 'arabic-subtitle-regular'
                    : 'latin-subtitle-regular',
                )}
              >
                {isArabic
                  ? 'لا يوجد محتوى متاح حاليًا'
                  : 'Aucun contenu disponible pour le moment'}
              </p>
            </div>
          )}
        </div>
      </section>
    </ClientWrapper>
  );
};

export default CategoryPostsClient;
