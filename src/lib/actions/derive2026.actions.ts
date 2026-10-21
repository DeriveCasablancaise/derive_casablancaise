'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '../database';
import Derive2026, { IDerive2026 } from '../database/models/derive2026.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { parseInput } from '../parse-input';
import { sanitizeFields } from '../sanitize';
import { derive2026FormSchema } from '../validator';
import { DERIVE_2026_DEFAULTS } from '../derive2026-defaults';

export interface UpdateDerive2026Params {
  derive2026: Partial<IDerive2026> & { _id?: string };
}

// Get derive 2026 data
export async function getDerive2026Data() {
  try {
    await connectToDatabase();

    const doc = await Derive2026.findOne();

    // no write on public reads, defaults stay in memory
    if (!doc) return { ...DERIVE_2026_DEFAULTS };

    return { ...DERIVE_2026_DEFAULTS, ...JSON.parse(JSON.stringify(doc)) };
  } catch (error) {
    console.error('Error getting derive 2026 data:', error);
    handleError(error);
  }
}

// Update derive2026
export async function updateDerive2026({ derive2026 }: UpdateDerive2026Params) {
  await requireAdmin();

  // _id is ignored, the singleton is found with findOne
  const { _id, ...input } = derive2026;
  const data = parseInput(
    derive2026FormSchema,
    sanitizeFields(input, [
      'text1Fr',
      'text1Ar',
      'text2Fr',
      'text2Ar',
      'text3Fr',
      'text3Ar',
    ]),
  );

  try {
    await connectToDatabase();

    let doc = await Derive2026.findOne();

    if (!doc) {
      doc = await Derive2026.create(data);
    } else {
      doc = await Derive2026.findByIdAndUpdate(doc._id, data, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/fr/derive-2026');
    revalidatePath('/ar/derive-2026');
    revalidatePath('/darja-admin/derive-2026');
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error updating derive2026:', error);
    handleError(error);
  }
}
