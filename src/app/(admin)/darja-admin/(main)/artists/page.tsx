import ArtistsPage from '@/components/dashboard/ArtistsPage';
import { getArtistsCounts } from '@/lib/actions/artists.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const page = async () => {
  const artistStats = await getArtistsCounts();

  const activeUser = await currentUser();

  if (!activeUser) {
    redirect('/darja-admin/sign-in');
    return null; // Ensure no component renders if redirecting
  }

  // Fetch additional user details from your database using Clerk's user ID
  const currentUserFromDb = await getUserById(activeUser.id);

  if (!currentUserFromDb) {
    redirect('/darja-admin/sign-in');
    return null;
  }

  return (
    <ArtistsPage
      artistStats={artistStats}
      isAdmin={currentUserFromDb.isAdmin}
    />
  );
};
export default page;
