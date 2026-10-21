import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';

async function findUserByClerkId(clerkId: string) {
  await connectToDatabase();
  return User.findOne({ clerkId }).lean<{ isAdmin?: boolean }>();
}

// For server actions: throws unless the caller is signed in and isAdmin in Mongo.
export async function requireAdmin() {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');

  const user = await findUserByClerkId(userId);
  if (!user || user.isAdmin !== true) throw new Error('Unauthorized');

  return user;
}

// For admin pages: signed-out visitors go to /sign-in, signed-in non-admins get isAdmin: false.
export async function getAdminOrRedirect() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const user = await findUserByClerkId(userId);
  if (!user || user.isAdmin !== true) return { isAdmin: false as const };

  return { isAdmin: true as const, user };
}
