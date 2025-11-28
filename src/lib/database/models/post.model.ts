import { Schema, Document, model, models } from 'mongoose';

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
  endDateTime: Date;
  postCategory:
    | 'danse'
    | 'musique'
    | 'theatre'
    | 'lectures'
    | 'cinema'
    | 'conference'
    | 'ateliers'
    | 'autres';
  subCategory?: 'rencontres' | 'expositions' | 'productions';
  location: string;
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
  endDateTime: { type: Date, default: Date.now },
  postCategory: {
    type: String,
    enum: [
      'danse',
      'musique',
      'theatre',
      'lectures',
      'cinema',
      'conference',
      'ateliers',
      'autres',
    ],
    required: true,
    default: null,
  },
  subCategory: {
    type: String,
    enum: ['rencontres', 'expositions', 'productions'],
    required: false,
  },
  location: { type: String },
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
