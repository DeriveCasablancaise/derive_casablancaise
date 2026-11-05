'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { connectToDatabase } from '../database';
import Partner from '../database/models/partner.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';
import Order from '../database/models/order.model';
import { parseInput } from '../parse-input';
import { editionOrderSchema, partnerFormSchema } from '../validator';
import {
  buildPartnerEditionsFilter,
  getPartnerEditions,
} from '../partner-editions';
import { mergeEditionOrder } from '../partner-order';
import {
  EDITION_YEARS,
  editionHref,
  isEditionYear,
  type EditionYear,
} from '@/constants/editions';

// Type definitions for partner operations
export type CreatePartnerParams = {
  frenchName: string;
  arabicName?: string;
  hrefLink?: string;
  editions: EditionYear[];
  logoImage: string;
  invertLogo?: boolean;
};

export type UpdatePartnerParams = {
  partner: CreatePartnerParams & { _id: string };
};

const revalidatePartnerPages = (years: readonly EditionYear[]) => {
  for (const locale of ['fr', 'ar']) {
    revalidatePath(`/${locale}`);
    for (const year of years) {
      revalidatePath(`/${locale}${editionHref(year)}`);
    }
  }
  revalidatePath('/darja-admin/partners');
};

// Populate partner (remains unchanged for consistency with post pattern)
const populatePartner = async (query: any) => {
  return query;
};

// Create Partner
export async function createPartner(partner: CreatePartnerParams) {
  await requireAdmin();

  const data = parseInput(partnerFormSchema, partner);

  try {
    await connectToDatabase();

    const newPartner = await Partner.create(data);

    return JSON.parse(JSON.stringify(newPartner));
  } catch (error) {
    handleError(error);
  }
}

// Update Partner
export async function updatePartner({ partner }: UpdatePartnerParams) {
  await requireAdmin();

  const { _id, ...input } = partner;
  if (!Types.ObjectId.isValid(_id)) throw new Error('Invalid data');
  const data = parseInput(partnerFormSchema, input);

  try {
    await connectToDatabase();

    const partnerToUpdate = await Partner.findById(_id);

    if (!partnerToUpdate) {
      throw new Error('Partner Not Found!');
    }

    const updatedPartner = await Partner.findByIdAndUpdate(_id, data, {
      new: true,
      runValidators: true,
    });

    // all years, the partner may just have left one of them
    revalidatePartnerPages(EDITION_YEARS);
    return JSON.parse(JSON.stringify(updatedPartner));
  } catch (error) {
    console.error('Error updating the partner', error);
    handleError(error);
  }
}

// Update Order
// One list per edition, so a partner in several editions has its own
// position in each. Partners missing from a list go last, nothing breaks.
export async function updatePartnerOrder(
  orderedIds: string[],
  year: EditionYear,
) {
  await requireAdmin();

  if (
    !isEditionYear(year) ||
    !orderedIds.every((id) => Types.ObjectId.isValid(id))
  ) {
    throw new Error('Invalid data');
  }

  try {
    await connectToDatabase();
    await Order.findOneAndUpdate({ year }, { orderedIds }, { upsert: true });
    revalidatePartnerPages([year]);
  } catch (error) {
    handleError(error);
  }
}

// Save from the "Ordre d'affichage" view, the whole list at once.
export async function saveEditionOrder(
  edition: EditionYear,
  partnerIds: string[],
) {
  await requireAdmin();

  const data = parseInput(editionOrderSchema, { edition, partnerIds });

  await connectToDatabase();

  const known = await Partner.countDocuments({
    _id: { $in: data.partnerIds },
    ...buildPartnerEditionsFilter([data.edition]),
  });
  if (known !== data.partnerIds.length) throw new Error('Invalid data');

  await Order.findOneAndUpdate(
    { year: data.edition },
    { orderedIds: data.partnerIds },
    { upsert: true },
  );

  revalidatePartnerPages([data.edition]);
}

// Delete Partner
export async function deletePartner({
  partnerId,
  path,
}: {
  partnerId: string;
  path: string;
}) {
  await requireAdmin();

  try {
    await connectToDatabase();

    const deletedPartner = await Partner.findByIdAndDelete(partnerId);

    if (deletedPartner) revalidatePath(path);
  } catch (error) {
    console.error('Error deleting partner', error);
    handleError(error);
  }
}

// Get Partner By Id
export async function getPartnerById(partnerId: string) {
  try {
    await connectToDatabase();

    const partner = await Partner.findById(new Types.ObjectId(partnerId));

    if (!partner) throw new Error('Error getting partner by its Id');

    return JSON.parse(JSON.stringify(partner));
  } catch (error) {
    console.error('Error fetching the partner', error);
    handleError(error);
  }
}

// Get All Partners
export async function getAllPartners(year: EditionYear) {
  await connectToDatabase();

  // 1. Get the order array - Explicitly type 'id' as any or mongoose.Types.ObjectId
  const orderDoc = await Order.findOne({ year });
  const orderedIds: string[] =
    orderDoc?.orderedIds.map((id: any) => id.toString()) || [];

  // 2. Get the partners
  const partners = await Partner.find(buildPartnerEditionsFilter([year]));

  // 3. Apply the order, partners not in it go last by name
  const plainPartners: any[] = JSON.parse(JSON.stringify(partners));
  return mergeEditionOrder(orderedIds, plainPartners);
}
// Get Partners By Year
export async function getPartnersByYear(year: EditionYear) {
  try {
    await connectToDatabase();

    const partnersQuery = Partner.find(buildPartnerEditionsFilter([year])).sort({
      createdAt: 'desc',
    });

    const partners = await partnersQuery;

    return JSON.parse(JSON.stringify(partners));
  } catch (error) {
    console.error('Error fetching partners by year:', error);
    handleError(error);
    return [];
  }
}

// Get Partner Counts
export async function getPartnerCounts() {
  await requireAdmin();

  try {
    await connectToDatabase();

    const partners = await Partner.find();

    // a partner in several editions counts once in each
    const countFor = (year: EditionYear) =>
      partners.filter((p) => getPartnerEditions(p).includes(year)).length;

    return {
      totalPartners: partners.length,
      partners2022: countFor('2022'),
      partners2024: countFor('2024'),
      partners2026: countFor('2026'),
    };
  } catch (error) {
    console.error('Failed to fetch partner statistics:', error);
    handleError(error);
    throw new Error('Failed to fetch partner statistics');
  }
}
