import React from 'react';
import { getAllPartners } from '@/lib/actions/partner.actions';
import PartnersImagesSlider from './PartnersImagesSlider';

const PartnersSlider = async () => {
  const partners = await getAllPartners();
  return <PartnersImagesSlider partners={partners} />;
};

export default PartnersSlider;
