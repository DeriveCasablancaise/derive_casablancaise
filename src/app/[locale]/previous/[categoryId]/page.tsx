import EditionCategoryPage from '@/components/shared/Derive2024/EditionCategoryPage';

type CategoryPageProps = {
  params: {
    categoryId: string;
  };
};

const CategoryPage = ({ params: { categoryId } }: CategoryPageProps) => (
  <EditionCategoryPage
    categoryId={categoryId}
    edition="2022"
    yearOfEdition="2022"
  />
);

export default CategoryPage;
