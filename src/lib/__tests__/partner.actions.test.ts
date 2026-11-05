import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/require-admin', () => ({ requireAdmin: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('../database', () => ({ connectToDatabase: vi.fn() }));
vi.mock('../database/models/partner.model', () => ({
  default: { countDocuments: vi.fn() },
}));
vi.mock('../database/models/order.model', () => ({
  default: { findOneAndUpdate: vi.fn() },
}));

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { saveEditionOrder } from '../actions/partner.actions';
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';
import Partner from '../database/models/partner.model';

const ids = ['a'.repeat(24), 'b'.repeat(24)];

describe('saveEditionOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAdmin).mockResolvedValue(undefined as never);
  });

  it('rejects non-admins before touching the database', async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new Error('Unauthorized'));

    await expect(saveEditionOrder('2026', ids)).rejects.toThrow('Unauthorized');
    expect(connectToDatabase).not.toHaveBeenCalled();
    expect(Order.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('rejects an invalid list before touching the database', async () => {
    await expect(
      saveEditionOrder('2026', [ids[0], ids[0]]),
    ).rejects.toThrow('Invalid data');
    await expect(saveEditionOrder('2026', ['nope'])).rejects.toThrow(
      'Invalid data',
    );
    await expect(saveEditionOrder('1999' as never, ids)).rejects.toThrow(
      'Invalid data',
    );
    expect(connectToDatabase).not.toHaveBeenCalled();
  });

  it('rejects ids that are not partners of the edition', async () => {
    vi.mocked(Partner.countDocuments).mockResolvedValue(1 as never);

    await expect(saveEditionOrder('2026', ids)).rejects.toThrow('Invalid data');
    expect(Partner.countDocuments).toHaveBeenCalledWith({
      _id: { $in: ids },
      editions: { $in: ['2026'] },
    });
    expect(Order.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('upserts the order and revalidates the public pages', async () => {
    vi.mocked(Partner.countDocuments).mockResolvedValue(2 as never);

    await saveEditionOrder('2026', ids);

    expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
      { year: '2026' },
      { orderedIds: ids },
      { upsert: true },
    );
    const paths = vi.mocked(revalidatePath).mock.calls.map(([path]) => path);
    expect(paths).toEqual(
      expect.arrayContaining([
        '/fr',
        '/ar',
        '/fr/derive-2026',
        '/ar/derive-2026',
      ]),
    );
  });
});
