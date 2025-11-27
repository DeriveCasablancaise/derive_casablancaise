import React from 'react';
import { getAllPartners } from '@/lib/actions/partner.actions';
import PartnersImagesSlider from './PartnersImagesSlider';

interface PartnersSliderProps {
  edition: '2022' | '2024';
}

const PartnersSlider = async ({ edition }: PartnersSliderProps) => {
  const partners = await getAllPartners(edition);
  return <PartnersImagesSlider partners={partners} />;
};

export default PartnersSlider;
