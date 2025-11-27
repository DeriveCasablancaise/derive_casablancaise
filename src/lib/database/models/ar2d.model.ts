import { Schema, Document, model, models } from 'mongoose';

// Interface for the Homepage document
export interface IAr2d extends Document {
  _id: string;
  text1Fr: string;
  text1Ar?: string;

  text2Fr: string;
  text2Ar?: string;

  text3Fr: string;
  text3Ar?: string;

  video1Thumbnail: string;
  video1IframeLink: string;
  video1TitleFr: string;
  video1TitleAr?: string;

  video2Thumbnail: string;
  video2IframeLink: string;
  video2TitleFr: string;
  video2TitleAr?: string;

  backgroundImage: string;

  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const Ar2dSchema = new Schema(
  {
    text1Fr: {
      type: String,
      required: true,
    },
    text1Ar: {
      type: String,
      required: false,
    },
    text2Fr: {
      type: String,
      required: true,
    },
    text2Ar: {
      type: String,
      required: false,
    },
    text3Fr: {
      type: String,
      required: true,
    },
    text3Ar: {
      type: String,
      required: false,
    },
    video1Thumbnail: {
      type: String,
      required: true,
    },
    video1IframeLink: {
      type: String,
      required: true,
    },
    video1TitleFr: {
      type: String,
      required: true,
    },
    video1TitleAr: {
      type: String,
      required: false,
    },
    video2Thumbnail: {
      type: String,
      required: true,
    },
    video2IframeLink: {
      type: String,
      required: true,
    },
    video2TitleFr: {
      type: String,
      required: true,
    },
    video2TitleAr: {
      type: String,
      required: false,
    },
    backgroundImage: {
      // Add this field
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ar2d = models?.Ar2d || model('Ar2d', Ar2dSchema);

export default Ar2d;
