import React from 'react';
import Contact from '../../../components/shared/contact';
import ProgramSection from '@/components/shared/ProgramsSection';
import DeriveLanding from '@/components/shared/DeriveLanding';
import VideoSection from '@/components/shared/Derive2024/VideoSection';
import PartnersSlider from '@/components/shared/PartnersSlider';

const DerivePage = () => {
  return (
    <div className="overflow-hidden">
      <DeriveLanding />
      <VideoSection />
      <ProgramSection />
      <PartnersSlider />
      <Contact />
    </div>
  );
};

export default DerivePage;
