import { Schema, Document, model, models } from 'mongoose';

// Interface for the Project document
export interface IPost extends Document {
  _id: string;
  frenchTitle: string;
  arabicTitle: string;
  frenctText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  startDateTime: Date;
  endDateTime: Date;
  postCategory:
    | 'danse'
    | 'concert'
    | 'theatre'
    | 'lectures'
    | 'cinema'
    | 'ateliers';
  location: string;
  url?: string;
  isInHomepage: boolean;
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
    required: true,
  },
  frenchText: {
    type: String,
    required: true,
  },
  arabicText: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  videoSource: {
    type: String,
    required: false,
  },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  postCategory: {
    type: String,
    enum: ['danse', 'concert', 'theatre', 'lectures', 'cinema', 'ateliers'],
    required: true,
    default: null,
  },
  location: { type: String },
  url: { type: String, required: false },
  isInHomepage: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = models?.Post || model('Post', PostSchema);

export default Post;
