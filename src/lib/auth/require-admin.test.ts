import { beforeEach, describe, expect, it, vi } from 'vitest';

const { auth, lean } = vi.hoisted(() => ({ auth: vi.fn(), lean: vi.fn() }));

vi.mock('server-only', () => ({}));
vi.mock('@clerk/nextjs/server', () => ({ auth }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/lib/database', () => ({ connectToDatabase: vi.fn() }));
vi.mock('@/lib/database/models/user.model', () => ({
  default: { findOne: vi.fn(() => ({ lean })) },
}));

import { requireAdmin } from './require-admin';

describe('requireAdmin', () => {
  beforeEach(() => {
    auth.mockReset();
    lean.mockReset();
  });

  it('throws when there is no session', async () => {
    auth.mockReturnValue({ userId: null });

    await expect(requireAdmin()).rejects.toThrow('Unauthorized');
    expect(lean).not.toHaveBeenCalled();
  });

  it('throws when the user is not an admin', async () => {
    auth.mockReturnValue({ userId: 'user_1' });
    lean.mockResolvedValue({ clerkId: 'user_1', isAdmin: false });

    await expect(requireAdmin()).rejects.toThrow('Unauthorized');
  });

  it('throws when the user is not in the database', async () => {
    auth.mockReturnValue({ userId: 'user_1' });
    lean.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow('Unauthorized');
  });

  it('returns the user when they are an admin', async () => {
    const admin = { clerkId: 'user_1', isAdmin: true };
    auth.mockReturnValue({ userId: 'user_1' });
    lean.mockResolvedValue(admin);

    await expect(requireAdmin()).resolves.toEqual(admin);
  });
});
