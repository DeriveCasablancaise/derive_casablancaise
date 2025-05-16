import React from 'react';
import Contact from '../../../components/shared/contact';
import ProgramSection from '@/components/shared/ProgramsSection';
import DeriveLanding from '@/components/shared/DeriveLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';
import VideoSection from '@/components/shared/Derive2024/VideoSection';

const DerivePage = () => {
  return (
    <div className="overflow-hidden">
      <DeriveLanding />
      <ProgramSection />
      <VideoSection />
      <DynamicSlider />
      <Contact />
    </div>
  );
};

export default DerivePage;
