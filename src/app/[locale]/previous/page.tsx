import React from 'react';
import Contact from '../../../components/shared/contact';
import DeriveLanding from '@/components/shared/DeriveLanding';
import PartnersSlider from '@/components/shared/PartnersSlider';
import { getDerive2022Data } from '@/lib/actions/derive2022.actions';
import ProgramSection from '@/components/shared/ProgramsSection';

const DerivePage = async () => {
  const derive2022 = await getDerive2022Data();

  return (
    <div className="overflow-hidden">
      <DeriveLanding derive2024={derive2022} />
      {/* <VideoSection /> */}
      <ProgramSection edition="2022" />
      <PartnersSlider edition="2022" />
      <Contact />
    </div>
  );
};

export default DerivePage;
