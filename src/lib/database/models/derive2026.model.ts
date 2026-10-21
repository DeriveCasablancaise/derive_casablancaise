import { Schema, Document, model, models } from 'mongoose';

// Every field is optional, an empty 2026 page is valid
export interface IDerive2026 extends Document {
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

  videosHeadingFr?: string;
  videosHeadingAr?: string;

  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const text = { type: String, default: '' };

const Derive2026Schema = new Schema(
  {
    text1Fr: text,
    text1Ar: text,
    text2Fr: text,
    text2Ar: text,
    text3Fr: text,
    text3Ar: text,
    video1Thumbnail: text,
    video1IframeLink: text,
    video1TitleFr: text,
    video1TitleAr: text,
    video2Thumbnail: text,
    video2IframeLink: text,
    video2TitleFr: text,
    video2TitleAr: text,
    backgroundImage: text,
    videosHeadingFr: text,
    videosHeadingAr: text,
  },
  {
    timestamps: true,
  },
);

const Derive2026 = models?.Derive2026 || model('Derive2026', Derive2026Schema);

export default Derive2026;
