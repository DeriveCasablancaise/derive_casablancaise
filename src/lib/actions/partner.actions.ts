'use server';

import { connectToDatabase } from '../database';
import Partner from '../database/models/partner.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';

// Type definitions for partner operations
export type CreatePartnerParams = {
  frenchName: string;
  arabicName?: string;
  hrefLink?: string;
  yearOfPartnership: '2022' | '2024';
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
      { new: true }
    );

    revalidatePath('/darja-admin/partners');
    return JSON.parse(JSON.stringify(updatedPartner));
  } catch (error) {
    console.error('Error updating the partner', error);
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
export async function getAllPartners(yearOfPartnership?: '2022' | '2024') {
  try {
    await connectToDatabase();

    const condition: any = {};

    if (yearOfPartnership) {
      condition.yearOfPartnership = yearOfPartnership;
    }

    const partnersQuery = Partner.find(condition).sort({ createdAt: 'desc' });

    const partners = await populatePartner(partnersQuery);

    return JSON.parse(JSON.stringify(partners));
  } catch (error) {
    console.error('Error Getting All Partners', error);
    handleError(error);
  }
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
      (p) => p.yearOfPartnership === '2022'
    ).length;
    const partners2024 = partners.filter(
      (p) => p.yearOfPartnership === '2024'
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
