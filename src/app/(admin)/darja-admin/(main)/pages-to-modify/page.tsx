import PagesToModify from '@/components/dashboard/PagesToModify';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const PagesToModifyPage = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  return <PagesToModify isAdmin={isAdmin} />;
};

export default PagesToModifyPage;
