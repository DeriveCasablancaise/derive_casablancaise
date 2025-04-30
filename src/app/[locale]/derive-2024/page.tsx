import React from 'react';
import Contact from '../../../components/shared/contact';
import ProgramSection from '@/components/shared/ProgramsSection';
import DeriveLanding from '@/components/shared/DeriveLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';

const DerivePage = () => {
  return (
    <div className="overflow-hidden">
      <DeriveLanding />
      <ProgramSection />
      <DynamicSlider />
      <Contact />
    </div>
  );
};

export default DerivePage;
