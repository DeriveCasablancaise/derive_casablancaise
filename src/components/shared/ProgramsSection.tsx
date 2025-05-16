'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { getAllPosts, getPostsByStartDate } from '@/lib/actions/post.actions';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { motion, useInView } from 'framer-motion';
import SubHeader from './SubHeader';
import { IPost } from '@/lib/database/models/post.model';
import {
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';
import { fr, arMA } from 'date-fns/locale';
import { useSearchParams, useRouter } from 'next/navigation';
import RoundedBtn from './rounded';

const Categories = {
  danse: { fr: 'Danse', ar: 'رقص' },
  concert: { fr: 'Concert', ar: 'حفلة موسيقية' },
  theatre: { fr: 'Théâtre', ar: 'مسرح' },
  lectures: { fr: 'Lectures', ar: 'قراءات' },
  cinema: { fr: 'Cinéma', ar: 'سينما' },
  ateliers: { fr: 'Ateliers', ar: 'ورش عمل' },
} as const;

type CategoryKey = keyof typeof Categories;

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
    <section ref={sectionRef} id="program_section" className="">
      <motion.div
        variants={landingSlideUp}
        initial="initial"
        animate="enter"
        className="mx-auto py-8 xl:py-20 px-4 md:px-8 lg:px-16 "
      >
        <div className="flex flex-col md:flex-row gap-8 mt-16 sm:mt-0">
          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/4 flex flex-col justify-center items-start md:justify-start"
          >
            <h2
              className={cn(
                'text-2xl xl:text-4xl text-[#FF5C00] mb-12 w-full xl:w-[50%] text-start',
                isArabic ? 'arabic-title-bold' : 'latin-title-bold'
              )}
            >
              {t('heading')}
            </h2>

            {/* Categories Filter */}
            <div className="flex flex-col mb-8">
              <div className="flex flex-col  gap-4">
                {(Object.keys(Categories) as CategoryKey[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={cn(
                      'text-left text-lg md:text-xl transition-all duration-300 relative w-fit',
                      'before:content-[""] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5',
                      'before:bg-[#00b0db] before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-300',
                      selectedCategories.has(category)
                        ? 'text-[#00b0db] before:scale-x-100'
                        : 'text-[#094142] hover:text-[#00b0db] hover:before:scale-x-100',
                      isArabic
                        ? 'arabic-subtitle-regular text-right'
                        : 'latin-subtitle-regular'
                    )}
                  >
                    {isArabic
                      ? Categories[category].ar
                      : Categories[category].fr}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Posts Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.2, // Adjust delay for staggered effect
                    }}
                    className="shadow-lg"
                  >
                    <Link
                      href={`/${locale}/derive-2024/${post._id}`}
                      className="block aspect-[16/9] md:aspect-[3/4] lg:aspect-[1/1] relative group overflow-hidden group"
                    >
                      <div
                        className="absolute inset-0 transition-all duration-300"
                        style={{
                          backgroundColor: '#094142',
                        }}
                      />
                      {post.images && (
                        <div className="absolute inset-2 flex justify-center items-center overflow-hidden">
                          <Image
                            src={post.images[0]}
                            alt={isArabic ? post.arabicTitle : post.frenchTitle}
                            layout="fill"
                            objectFit="cover"
                            className="transform transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 bg-gradient-to-t from-[#094142]/90 via-transparent to-transparent p-4  ">
                        <h3
                          className={cn(
                            'text-white text-lg mb-1 font-semibold ',
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
        </div>
      </motion.div>
      <Link href="/programme.pdf" download target="_blank" className="mt-8">
        <RoundedBtn className='relative text-base group inline-flex items-center justify-center overflow-hidden rounded-full font-bold ring-offset-background transition-colors before:absolute before:left-[-10%] before:h-0 before:w-[120%] before:translate-y-3/4 before:scale-0 before:rounded-full before:pb-[120%] before:content-[""] after:absolute after:inset-0 after:h-full after:w-full after:-translate-y-full after:rounded-full after:transition-transform after:duration-300 after:ease-in-expo after:content-[""] hover:before:translate-y-0 hover:before:scale-100 hover:before:transition-transform hover:before:duration-300 hover:before:ease-in-expo hover:after:translate-y-0 hover:after:transition-transform hover:after:delay-300 hover:after:duration-75 hover:after:ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:border-2 hover:border-solid hover:border-[#094142] before:bg-[#094142] after:bg-[#094142] px-16 py-4 before:-top-1/2 hover:text-background'>
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
    </section>
  );
};

export default ProgramSection;
