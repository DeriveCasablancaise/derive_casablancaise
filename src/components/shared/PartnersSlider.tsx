import React from 'react';
import { getAllPartners } from '@/lib/actions/partner.actions';
import PartnersImagesSlider from './PartnersImagesSlider';
import type { EditionYear } from '@/constants/editions';

interface PartnersSliderProps {
  edition: EditionYear;
}

const PartnersSlider = async ({ edition }: PartnersSliderProps) => {
  const partners = await getAllPartners(edition);
  // no partners for this edition, so no empty section with a title
  if (partners.length === 0) return null;

  return <PartnersImagesSlider partners={partners} />;
};

export default PartnersSlider;
