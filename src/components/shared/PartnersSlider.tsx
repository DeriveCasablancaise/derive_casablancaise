import React from 'react';
import { getAllPartners } from '@/lib/actions/partner.actions';
import PartnersImagesSlider from './PartnersImagesSlider';
import {
  getEdition,
  isEditionOver,
  type EditionYear,
} from '@/constants/editions';

interface PartnersSliderProps {
  edition: EditionYear;
}

const PartnersSlider = async ({ edition }: PartnersSliderProps) => {
  const partners = await getAllPartners(edition);
  // no partners for this edition, so no empty section with a title
  if (partners.length === 0) return null;

  // same rule as the artists title, checked at render time
  const currentEdition = isEditionOver(getEdition(edition), new Date())
    ? undefined
    : edition;

  return (
    <PartnersImagesSlider partners={partners} currentEdition={currentEdition} />
  );
};

export default PartnersSlider;
