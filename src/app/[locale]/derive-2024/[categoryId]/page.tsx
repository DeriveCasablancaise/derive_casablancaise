import EditionCategoryPage from '@/components/shared/Derive2024/EditionCategoryPage';

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

const CategoryPage = ({ params: { categoryId } }: CategoryPageProps) => (
  <EditionCategoryPage
    categoryId={categoryId}
    edition="2024"
  />
);

export default CategoryPage;
