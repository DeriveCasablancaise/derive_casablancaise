import React from 'react';
import { getPostsByStartDate } from '@/lib/actions/post.actions';
import { getLocale } from 'next-intl/server';
import type { IPost } from '@/lib/database/models/post.model';
import CategoryPostsClient from '@/components/shared/Derive2024/CategoryPostsClient';
import Contact from '@/components/shared/contact';

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

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

const CategoryPage = async ({ params: { categoryId } }: CategoryPageProps) => {
  const locale = await getLocale();
  const isArabic = locale === 'ar';

  // Validate category
  if (!Object.keys(Categories).includes(categoryId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {isArabic ? 'فئة غير موجودة' : 'Catégorie non trouvée'}
          </h1>
          <p className="text-gray-600">
            {isArabic
              ? 'الفئة المطلوبة غير موجودة أو غير صالحة'
              : 'La catégorie demandée est introuvable ou invalide'}
          </p>
        </div>
      </div>
    );
  }

  // Fetch all posts and filter by category
  const allPosts = await getPostsByStartDate();
  const filteredPosts =
    allPosts?.filter((post: IPost) => post.postCategory === categoryId) || [];

  return (
    <div className="overflow-hidden">
      <CategoryPostsClient
        categoryId={categoryId as CategoryKey}
        initialPosts={filteredPosts}
        locale={locale}
        isArabic={isArabic}
      />
      <Contact />
    </div>
  );
};

export default CategoryPage;
