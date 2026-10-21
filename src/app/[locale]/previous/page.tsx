import React from 'react';
import Contact from '../../../components/shared/contact';
import DeriveLanding from '@/components/shared/DeriveLanding';
import PartnersSlider from '@/components/shared/PartnersSlider';
import { getDerive2022Data } from '@/lib/actions/derive2022.actions';
import ProgramSection from '@/components/shared/ProgramsSection';

const DerivePage = async () => {
  const derive2022 = await getDerive2022Data();

  return (
    // overflow-x-clip, not hidden: hidden would break the sticky background
    <div className="overflow-x-clip">
      <DeriveLanding
        data={derive2022}
        layout="flow"
        backgroundFit="pan"
        headingSource="translation"
      />
      {/* <VideoSection /> */}
      <ProgramSection edition="2022" />
      <PartnersSlider edition="2022" />
      <Contact />
    </div>
  );
};

export default DerivePage;
