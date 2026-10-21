import { Schema, Document, model, models } from 'mongoose';
import { EDITION_YEARS, type EditionYear } from '@/constants/editions';

export interface IPartner extends Document {
  _id: string;
  frenchName: string;
  arabicName?: string;
  hrefLink?: string;
  editions: EditionYear[];
  // Deprecated, read it through getPartnerEditions.
  yearOfPartnership?: '2022' | '2024' | 'both';
  logoImage: string;
  order: number;
  createdAt: Date;
  __v?: number;
}

const PartnerSchema = new Schema({
  frenchName: {
    type: String,
    required: true,
  },
  arabicName: {
    type: String,
    required: false,
  },
  hrefLink: {
    type: String,
    required: false,
    default: '#',
  },
  editions: {
    type: [{ type: String, enum: EDITION_YEARS }],
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one edition is required',
    },
  },
  // Deprecated, kept so documents not migrated yet still load.
  yearOfPartnership: {
    type: String,
    enum: ['2022', '2024', 'both'],
  },
  logoImage: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Partner = models?.Partner || model('Partner', PartnerSchema);

export default Partner;
