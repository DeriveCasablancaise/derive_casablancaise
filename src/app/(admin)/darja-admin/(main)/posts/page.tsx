import PostsPage from '@/components/dashboard/PostsPage';
import { getPostCounts } from '@/lib/actions/post.actions';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const UsersPage = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  const postStats = await getPostCounts();

  return <PostsPage postStats={postStats} isAdmin={isAdmin} />;
};
export default UsersPage;
