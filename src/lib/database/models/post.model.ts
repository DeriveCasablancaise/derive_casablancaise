import { Schema, Document, model, models } from 'mongoose';
import {
  CATEGORY_KEYS,
  EDITION_YEARS,
  type CategoryKey,
  type EditionYear,
} from '@/constants/editions';

// Interface for the Project document
export interface IPost extends Document {
  _id: string;
  frenchTitle: string;
  arabicTitle?: string;
  frenctText: string;
  arabicText?: string;
  images: string[];
  thumbnailImage?: string;
  videoSource?: string;
  startDateTime: Date;
  endDateTime?: Date;
  postCategory: CategoryKey;
  subCategory?: 'rencontres' | 'expositions' | 'productions';
  yearOfEdition: EditionYear;
  location: string;
  locationAr?: string;
  url?: string;
  artists: string[];
  createdAt: Date;
  __v?: number;
}

const PostSchema = new Schema({
  frenchTitle: {
    type: String,
    required: true,
  },
  arabicTitle: {
    type: String,
    required: false,
  },
  frenchText: {
    type: String,
    required: true,
  },
  arabicText: {
    type: String,
    required: false,
  },
  images: {
    type: [String],
    default: [],
  },
  thumbnailImage: {
    type: String,
    required: false,
  },
  videoSource: {
    type: String,
    required: false,
  },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, required: false },
  postCategory: {
    type: String,
    enum: CATEGORY_KEYS,
    required: true,
    default: null,
  },
  subCategory: {
    type: String,
    enum: ['rencontres', 'expositions', 'productions'],
    required: false,
  },
  yearOfEdition: {
    type: String,
    enum: EDITION_YEARS,
    required: true,
  },
  location: { type: String },
  locationAr: { type: String, required: false },
  url: { type: String, required: false },
  artists: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = models?.Post || model('Post', PostSchema);

export default Post;
