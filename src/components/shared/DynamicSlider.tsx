import { getAllArtists } from '@/lib/actions/artists.actions';
import React from 'react';
import SlidingImages from './slider';
import {
  CURRENT_EDITION_YEAR,
  getEdition,
  isEditionOver,
} from '@/constants/editions';
import { filterArtistsByEdition } from '@/lib/artist-editions';
import type { IArtist } from '@/lib/database/models/artist.model';

const DynamicSlider = async () => {
  const artists = filterArtistsByEdition<IArtist>(
    await getAllArtists(),
    CURRENT_EDITION_YEAR,
  );
  // checked at render time, the title goes back to the past wording after the festival
  const currentEdition = isEditionOver(
    getEdition(CURRENT_EDITION_YEAR),
    new Date(),
  )
    ? undefined
    : CURRENT_EDITION_YEAR;
  return <SlidingImages artists={artists} currentEdition={currentEdition} />;
};

export default DynamicSlider;
