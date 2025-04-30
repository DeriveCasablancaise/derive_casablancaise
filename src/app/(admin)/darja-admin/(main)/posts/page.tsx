import PostsPage from '@/components/dashboard/PostsPage';
import { getPostCounts } from '@/lib/actions/post.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const UsersPage = async () => {
  const postStats = await getPostCounts();

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
    <PostsPage postStats={postStats} isAdmin={currentUserFromDb.isAdmin} />
  );
};
export default UsersPage;
