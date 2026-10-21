import React from 'react';
import Contact from '../../../components/shared/contact';
import ProgramSection from '@/components/shared/ProgramsSection';
import DeriveLanding from '@/components/shared/DeriveLanding';
import PartnersSlider from '@/components/shared/PartnersSlider';
import { getDerive2024Data } from '@/lib/actions/derive2024.actions';

const DerivePage = async () => {
  const derive2024 = await getDerive2024Data();

  return (
    // overflow-x-clip, not hidden: hidden would break the sticky background
    <div className="overflow-x-clip">
      <DeriveLanding
        data={derive2024}
        layout="flow"
        backgroundFit="pan"
        headingSource="translation"
      />
      {/* <VideoSection /> */}
      <ProgramSection edition="2024" />
      <PartnersSlider edition="2024" />
      <Contact />
    </div>
  );
};

export default DerivePage;
