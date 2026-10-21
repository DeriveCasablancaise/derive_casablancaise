import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';
import CultureContent from './culture-content';

const page = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  return <CultureContent />;
};

export default page;
