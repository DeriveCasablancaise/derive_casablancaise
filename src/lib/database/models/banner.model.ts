import { Schema, Document, model, models } from 'mongoose';

// Singleton: one banner for the home page, hidden until an admin turns it on
export interface IBanner extends Document {
  _id: string;
  isActive: boolean;
  textFr: string;
  textAr?: string;
  linkUrl?: string;
  linkLabelFr?: string;
  linkLabelAr?: string;

  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const text = { type: String, default: '' };

const BannerSchema = new Schema(
  {
    isActive: { type: Boolean, default: false },
    textFr: text,
    textAr: text,
    linkUrl: text,
    linkLabelFr: text,
    linkLabelAr: text,
  },
  {
    timestamps: true,
  },
);

const Banner = models?.Banner || model('Banner', BannerSchema);

export default Banner;
