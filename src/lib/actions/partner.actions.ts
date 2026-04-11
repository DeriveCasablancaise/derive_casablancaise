'use server';

import { connectToDatabase } from '../database';
import Partner from '../database/models/partner.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';
import Order from '../database/models/order.model';

// Type definitions for partner operations
export type CreatePartnerParams = {
  frenchName: string;
  arabicName?: string;
  hrefLink?: string;
  yearOfPartnership: '2022' | '2024' | 'both';
  logoImage: string;
};

export type UpdatePartnerParams = {
  partner: CreatePartnerParams & { _id: string };
};

// Populate partner (remains unchanged for consistency with post pattern)
const populatePartner = async (query: any) => {
  return query;
};

// Create Partner
export async function createPartner(partner: CreatePartnerParams) {
  try {
    await connectToDatabase();

    const newPartner = await Partner.create({
      ...partner,
      logoImage: partner.logoImage,
      yearOfPartnership: partner.yearOfPartnership,
    });

    return JSON.parse(JSON.stringify(newPartner));
  } catch (error) {
    handleError(error);
  }
}

// Update Partner
export async function updatePartner({ partner }: UpdatePartnerParams) {
  try {
    await connectToDatabase();

    const partnerToUpdate = await Partner.findById(partner._id);

    if (!partnerToUpdate) {
      throw new Error('Partner Not Found!');
    }

    const updatedPartner = await Partner.findByIdAndUpdate(
      partner._id,
      {
        ...partner,
        logoImage: partner.logoImage,
        yearOfPartnership: partner.yearOfPartnership,
      },
      { new: true },
    );

    revalidatePath('/darja-admin/partners');
    return JSON.parse(JSON.stringify(updatedPartner));
  } catch (error) {
    console.error('Error updating the partner', error);
    handleError(error);
  }
}

// Update Order
export async function updatePartnerOrder(
  orderedIds: string[],
  year: '2022' | '2024',
) {
  try {
    await connectToDatabase();
    await Order.findOneAndUpdate({ year }, { orderedIds }, { upsert: true });
    revalidatePath('/darja-admin/partners');
  } catch (error) {
    handleError(error);
  }
}

// Delete Partner
export async function deletePartner({
  partnerId,
  path,
}: {
  partnerId: string;
  path: string;
}) {
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
export async function getAllPartners(year: '2022' | '2024') {
  await connectToDatabase();

  // 1. Get the order array - Explicitly type 'id' as any or mongoose.Types.ObjectId
  const orderDoc = await Order.findOne({ year });
  const orderedIds: string[] =
    orderDoc?.orderedIds.map((id: any) => id.toString()) || [];

  // 2. Get the partners
  const partners = await Partner.find({
    $or: [{ yearOfPartnership: year }, { yearOfPartnership: 'both' }],
  });

  // 3. Sort partners based on the orderedIds array
  // We type 'a' and 'b' as 'any' here because JSON.stringify makes them plain objects,
  // or you can use your IPartner interface if it's imported.
  const sortedPartners = JSON.parse(JSON.stringify(partners)).sort(
    (a: any, b: any) => {
      const indexA = orderedIds.indexOf(a._id);
      const indexB = orderedIds.indexOf(b._id);

      // If an item isn't in the orderedIds list yet, move it to the end
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    },
  );

  return sortedPartners;
}
// Get Partners By Year
export async function getPartnersByYear(year: '2022' | '2024') {
  try {
    await connectToDatabase();

    const partnersQuery = Partner.find({ yearOfPartnership: year }).sort({
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
  try {
    await connectToDatabase();

    const partners = await Partner.find();

    // Count partners by year
    const partners2022 = partners.filter(
      (p) => p.yearOfPartnership === '2022',
    ).length;
    const partners2024 = partners.filter(
      (p) => p.yearOfPartnership === '2024',
    ).length;

    return {
      totalPartners: partners.length,
      partners2022,
      partners2024,
    };
  } catch (error) {
    console.error('Failed to fetch partner statistics:', error);
    handleError(error);
    throw new Error('Failed to fetch partner statistics');
  }
}
