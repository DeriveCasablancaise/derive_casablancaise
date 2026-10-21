import React from 'react';
import { getPostsByCategory } from '@/lib/actions/post.actions';
import { getLocale } from 'next-intl/server';
import CategoryPostsClient from '@/components/shared/Derive2024/CategoryPostsClient';
import Contact from '@/components/shared/contact';
import { isCategoryKey, type EditionYear } from '@/constants/editions';

interface EditionCategoryPageProps {
  categoryId: string;
  edition: EditionYear;
}

const EditionCategoryPage = async ({
  categoryId,
  edition,
}: EditionCategoryPageProps) => {
  const locale = await getLocale();
  const isArabic = locale === 'ar';

  // Validate category
  if (!isCategoryKey(categoryId)) {
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

  const filteredPosts = await getPostsByCategory(
    categoryId,
    undefined,
    edition,
  );

  return (
    <div className="overflow-hidden">
      <CategoryPostsClient
        categoryId={categoryId}
        initialPosts={filteredPosts || []}
        locale={locale}
        isArabic={isArabic}
        edition={edition}
      />
      <Contact />
    </div>
  );
};

export default EditionCategoryPage;
