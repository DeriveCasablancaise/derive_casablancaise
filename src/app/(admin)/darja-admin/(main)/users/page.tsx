import UsersPage from '@/components/dashboard/UsersPage';
import { getUserCounts } from '@/lib/actions/user.actions';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';
import React from 'react';

const Users = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  // Get user statistics
  const userStats = await getUserCounts();

  return <UsersPage userStats={userStats} isAdmin={isAdmin} />;
};

export default Users;
