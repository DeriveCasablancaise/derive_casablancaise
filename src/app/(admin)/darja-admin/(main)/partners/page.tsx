import PartnersPage from '@/components/dashboard/partners/PartnersPage';
import { getPartnerCounts } from '@/lib/actions/partner.actions';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const PartnersAdminPage = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  const partnerStats = await getPartnerCounts();

  return <PartnersPage partnerStats={partnerStats} isAdmin={isAdmin} />;
};

export default PartnersAdminPage;
