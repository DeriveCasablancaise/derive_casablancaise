import { Schema, Document, model, models } from 'mongoose';

// Interface for the Homepage document
export interface IHomepage extends Document {
  _id: string;
  textFr: string;
  textAr?: string;

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

const HomepageSchema = new Schema(
  {
    textFr: {
      type: String,
      required: true,
    },
    textAr: {
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

const Homepage = models?.Homepage || model('Homepage', HomepageSchema);

export default Homepage;
