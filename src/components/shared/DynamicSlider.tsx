import { getAllArtists } from '@/lib/actions/artists.actions';
import React from 'react';
import SlidingImages from './slider';
import { getEdition, isEditionOver } from '@/constants/editions';

const DynamicSlider = async () => {
  const artists = await getAllArtists();
  // checked at render time, the title goes back to the past wording after the festival
  const currentEdition = isEditionOver(getEdition('2026'), new Date())
    ? undefined
    : '2026';
  return <SlidingImages artists={artists} currentEdition={currentEdition} />;
};

export default DynamicSlider;
