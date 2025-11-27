import PagesToModify from '@/components/dashboard/PagesToModify';
import { getUserById } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const PagesToModifyPage = async () => {
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

  return <PagesToModify isAdmin={currentUserFromDb.isAdmin} />;
};

export default PagesToModifyPage;
