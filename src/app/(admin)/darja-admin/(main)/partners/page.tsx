import PartnersPage from '@/components/dashboard/partners/PartnersPage';
import { getPartnerCounts } from '@/lib/actions/partner.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const PartnersAdminPage = async () => {
  const partnerStats = await getPartnerCounts();

  const activeUser = await currentUser();

  if (!activeUser) {
    redirect('/darja-admin/sign-in');
    return null;
  }

  // Fetch additional user details from your database using Clerk's user ID
  const currentUserFromDb = await getUserById(activeUser.id);

  if (!currentUserFromDb) {
    redirect('/darja-admin/sign-in');
    return null;
  }

  return (
    <PartnersPage
      partnerStats={partnerStats}
      isAdmin={currentUserFromDb.isAdmin}
    />
  );
};

export default PartnersAdminPage;
