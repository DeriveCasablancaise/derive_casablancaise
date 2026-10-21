'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '../database';
import Banner, { IBanner } from '../database/models/banner.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { parseInput } from '../parse-input';
import { bannerFormSchema } from '../validator';
import { BANNER_DEFAULTS } from '../banner';

export interface UpdateBannerParams {
  banner: Partial<IBanner> & { _id?: string };
}

// Get banner data
export async function getBannerData() {
  try {
    await connectToDatabase();

    const doc = await Banner.findOne();

    // no write on public reads, defaults stay in memory
    if (!doc) return { ...BANNER_DEFAULTS };

    return { ...BANNER_DEFAULTS, ...JSON.parse(JSON.stringify(doc)) };
  } catch (error) {
    // the home page must not break because of the banner, so I stay hidden
    console.error('Error getting banner data:', error);
    return { ...BANNER_DEFAULTS };
  }
}

// Update banner
export async function updateBanner({ banner }: UpdateBannerParams) {
  await requireAdmin();

  // _id is ignored, the singleton is found with findOne
  const { _id, ...input } = banner;
  const data = parseInput(bannerFormSchema, input);

  try {
    await connectToDatabase();

    let doc = await Banner.findOne();

    if (!doc) {
      doc = await Banner.create(data);
    } else {
      doc = await Banner.findByIdAndUpdate(doc._id, data, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/fr');
    revalidatePath('/ar');
    revalidatePath('/darja-admin/banner');
    return JSON.parse(JSON.stringify(doc));
  } catch (error) {
    console.error('Error updating banner:', error);
    handleError(error);
  }
}
