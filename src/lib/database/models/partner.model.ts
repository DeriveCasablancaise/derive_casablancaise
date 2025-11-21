import { Schema, Document, model, models } from 'mongoose';

export interface IPartner extends Document {
  _id: string;
  frenchName: string;
  arabicName?: string;
  hrefLink?: string;
  yearOfPartnership: '2022' | '2024';
  logoImage: string;
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
    enum: ['2022', '2024'],
    required: true,
  },
  logoImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Partner = models?.Partner || model('Partner', PartnerSchema);

export default Partner;
