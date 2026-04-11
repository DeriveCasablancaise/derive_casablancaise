import { Schema, Document, model, models } from 'mongoose';

export interface IPartner extends Document {
  _id: string;
  frenchName: string;
  arabicName?: string;
  hrefLink?: string;
  yearOfPartnership: '2022' | '2024' | 'both';
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
  yearOfPartnership: {
    type: String,
    enum: ['2022', '2024', 'both'],
    required: true,
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
