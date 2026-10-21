import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';
import FinanceContent from './finance-content';

const page = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  return <FinanceContent />;
};

export default page;
