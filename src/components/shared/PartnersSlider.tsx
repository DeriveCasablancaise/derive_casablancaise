import React from 'react';
import { getAllPartners } from '@/lib/actions/partner.actions';
import PartnersImagesSlider from './PartnersImagesSlider';
import type { EditionYear } from '@/constants/editions';

interface PartnersSliderProps {
  edition: EditionYear;
}

const PartnersSlider = async ({ edition }: PartnersSliderProps) => {
  // partners have no 2026 year yet, and getAllPartners also returns 'both'
  // partners (2022 & 2024), so 2026 renders nothing until the year is added
  if (edition === '2026') return null;

  const partners = await getAllPartners(edition);
  return <PartnersImagesSlider partners={partners} />;
};

export default PartnersSlider;
