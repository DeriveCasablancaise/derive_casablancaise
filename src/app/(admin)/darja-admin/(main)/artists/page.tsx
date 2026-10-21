import ArtistsPage from '@/components/dashboard/ArtistsPage';
import { getArtistsCounts } from '@/lib/actions/artists.actions';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const page = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  const artistStats = await getArtistsCounts();

  return <ArtistsPage artistStats={artistStats} isAdmin={isAdmin} />;
};
export default page;
