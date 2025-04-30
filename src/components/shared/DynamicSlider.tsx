import { getAllArtists } from '@/lib/actions/artists.actions';
import React from 'react';
import SlidingImages from './slider';

const DynamicSlider = async () => {
  const artists = await getAllArtists();
  return <SlidingImages artists={artists} />;
};

export default DynamicSlider;
