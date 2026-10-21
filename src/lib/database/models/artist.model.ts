import { Schema, Document, model, models } from 'mongoose';
import type { EditionYear } from '@/constants/editions';
import { EDITION_YEARS } from '@/lib/artist-editions';

// Interface for the Artist document
export interface IArtist extends Document {
  _id: string;
  frenchName: string;
  arabicName: string;
  frenchText: string;
  arabicText: string;
  images: string[];
  videoSource?: string;
  editions: EditionYear[];
  /** @deprecated use getArtistEditions */
  artistCategory?: '2022' | '2024' | '2026' | 'all';
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
  editions: {
    type: [{ type: String, enum: EDITION_YEARS }],
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one edition is required',
    },
  },
  // Deprecated, kept so documents not migrated yet still load.
  artistCategory: {
    type: String,
    enum: ['2022', '2024', '2026', 'all'],
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
