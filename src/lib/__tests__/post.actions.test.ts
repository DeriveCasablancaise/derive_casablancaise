import { beforeEach, describe, expect, it, vi } from 'vitest';

const findById = vi.fn();

vi.mock('@/lib/database', () => ({ connectToDatabase: vi.fn() }));
vi.mock('@/lib/database/models/post.model', () => ({
  default: { findById: (...args: unknown[]) => findById(...args) },
}));
vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { getPostById } from '../actions/post.actions';

const id = '64b7f0c2a1b2c3d4e5f60718';
const post2026 = { _id: id, yearOfEdition: '2026', frenchTitle: 'x' };

beforeEach(() => {
  findById.mockReset();
});

describe('getPostById', () => {
  it('returns the post when no year is given', async () => {
    findById.mockResolvedValue(post2026);
    expect(await getPostById(id)).toEqual(post2026);
  });

  it('returns the post when the year matches', async () => {
    findById.mockResolvedValue(post2026);
    expect(await getPostById(id, '2026')).toEqual(post2026);
  });

  it('returns null when the year does not match', async () => {
    findById.mockResolvedValue(post2026);
    expect(await getPostById(id, '2024')).toBeNull();
    expect(await getPostById(id, '2022')).toBeNull();
  });

  it('returns null for an invalid id without touching the database', async () => {
    expect(await getPostById('not-an-id')).toBeNull();
    expect(await getPostById('')).toBeNull();
    expect(findById).not.toHaveBeenCalled();
  });

  it('returns null when the post does not exist', async () => {
    findById.mockResolvedValue(null);
    expect(await getPostById(id, '2024')).toBeNull();
  });
});
