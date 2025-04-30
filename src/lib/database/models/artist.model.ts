import { Schema, Document, model, models } from 'mongoose';

// Interface for the Artist document
export interface IArtist extends Document {
  _id: string;
  frenchName: string;
  arabicName: string;
  frenchText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  artistCategory: '2022' | '2024';
  url?: string;
  isInHomepage: boolean;
  createdAt: Date;
  __v?: number;
}

const ArtistSchema = new Schema({
  frenchName: {
    type: String,
    required: true,
  },
  arabicName: {
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
  },
  artistCategory: {
    type: String,
    enum: ['2022', '2024'],
    required: true,
    default: null,
  },
  url: { type: String },
  isInHomepage: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Artist = models?.Artist || model('Artist', ArtistSchema);

export default Artist;
