import UsersPage from '@/components/dashboard/UsersPage';
import { getUserById, getUserCounts } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const Users = async () => {
  // Get user statistics
  const userStats = await getUserCounts();

  // Get current user from Clerk
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
    <UsersPage userStats={userStats} isAdmin={currentUserFromDb.isAdmin} />
  );
};

export default Users;
