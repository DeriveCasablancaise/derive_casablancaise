import 'server-only';

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';
import { handleError } from '@/lib/utils';

import { CreateUserParams } from '@/types';

// Only called by the Clerk webhook. Not 'use server', so nothing here is reachable from the browser.

type SyncedUserFields = Omit<CreateUserParams, 'clerkId'>;

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// I only $set profile fields so a Clerk update can never touch isAdmin.
export async function updateUser(clerkId: string, user: SyncedUserFields) {
  try {
    await connectToDatabase();

    const { photo, firstName, lastName, username, email } = user;
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { $set: { photo, firstName, lastName, username, email } },
      { new: true }
    );

    if (!updatedUser) throw new Error('User update failed');
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId });

    if (!deletedUser) throw new Error('User not found');
    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    handleError(error);
  }
}
