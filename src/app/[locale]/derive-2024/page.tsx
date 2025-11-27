import React from 'react';
import Contact from '../../../components/shared/contact';
import ProgramSection from '@/components/shared/ProgramsSection';
import DeriveLanding from '@/components/shared/DeriveLanding';
import PartnersSlider from '@/components/shared/PartnersSlider';
import { getDerive2024Data } from '@/lib/actions/derive2024.actions';

const DerivePage = async () => {
  const derive2024 = await getDerive2024Data();

  return (
    <div className="overflow-hidden">
      <DeriveLanding derive2024={derive2024} />
      {/* <VideoSection /> */}
      <ProgramSection />
      <PartnersSlider edition="2024" />
      <Contact />
    </div>
  );
};

export default DerivePage;
