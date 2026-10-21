'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { deleteUser as deleteUserByClerkId } from '@/lib/database/user-sync';
import { handleError } from '@/lib/utils';

// createUser / updateUser live in lib/database/user-sync.ts (webhook only).

export async function getUserById(clerkId: string) {
  await requireAdmin();

  try {
    await connectToDatabase();

    // Use `findOne` instead of `findById`
    const user = await User.findOne({ clerkId });

    if (!user) throw new Error('User not found');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  await requireAdmin();

  const deletedUser = await deleteUserByClerkId(clerkId);
  revalidatePath('/darja-admin/users');

  return deletedUser ?? null;
}

export async function getAllUsers() {
  await requireAdmin();

  try {
    await connectToDatabase();

    const users = await User.find({}); // Retrieves all users from the database

    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserCounts() {
  await requireAdmin();

  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all users
    const users = await User.find();
    const admins = await User.find({ isAdmin: true });

    return {
      totalUsers: users.length, // Total users count
      totalAdmins: admins.length, // Total admins count
    };
  } catch (error) {
    console.error('Failed to fetch user statistics:', error);
    throw new Error('Failed to fetch user statistics');
  }
}
