'use client';

import { useEffect, useRef, useState } from 'react';
import { cn, landingSlideUp } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { IArtist } from '@/lib/database/models/artist.model';
import { CategoryFilter, CategoryKey } from './artists/CategoryFilter';
import { getAllArtists } from '@/lib/actions/artists.actions';
import { ArtistCard } from './artists/ArtistCard';
import { EmptyState } from './artists/EmptyState';

const ArtistsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const [artists, setArtists] = useState<IArtist[]>([]);
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const t = useTranslations('ArtistsPage');
  const [selectedCategories, setSelectedCategories] = useState<
    Set<CategoryKey>
  >(new Set());

  useEffect(() => {
    const fetchArtists = async () => {
      // Get the first selected category if any
      const category =
        selectedCategories.size > 0
          ? Array.from(selectedCategories)[0]
          : undefined;

      const fetchedArtists = await getAllArtists(category);
      if (fetchedArtists) {
        setArtists(fetchedArtists);
      }
    };
    fetchArtists();
  }, [selectedCategories]);

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategories((prev) => {
      const newCategories = new Set(prev);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        // Clear previous selection and set new category
        newCategories.clear();
        newCategories.add(category);
      }
      return newCategories;
    });
  };

  return (
    <section ref={sectionRef} id="artists_section" className="">
      <motion.div
        // variants={landingSlideUp}
        initial="initial"
        animate="enter"
        className="mx-auto sm:mt-20 lg:mt-[15vh]  py-8 xl:py-20 px-4 md:px-8 lg:px-16"
      >
        <div className="flex flex-col md:flex-row gap-8 mt-16 sm:mt-0">
          {/* Categories Filter */}
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

            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              isArabic={isArabic}
              heading={t('heading')}
            />
          </motion.div>

          {/* Artists Grid */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.length > 0 ? (
                artists.map((artist, index) => (
                  <ArtistCard
                    key={artist._id}
                    artist={artist}
                    index={index}
                    isArabic={isArabic}
                    locale={locale}
                    isInView={isInView}
                  />
                ))
              ) : (
                <EmptyState isArabic={isArabic} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ArtistsSection;
