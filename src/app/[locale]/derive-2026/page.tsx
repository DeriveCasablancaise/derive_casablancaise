import React from 'react';
import Contact from '@/components/shared/contact';
import ProgramSection from '@/components/shared/ProgramsSection';
import DeriveLanding from '@/components/shared/DeriveLanding';
import PartnersSlider from '@/components/shared/PartnersSlider';
import { getDerive2026Data } from '@/lib/actions/derive2026.actions';

const Derive2026Page = async () => {
  const derive2026 = await getDerive2026Data();

  return (
    // overflow-x-clip, not hidden: hidden would break the sticky background
    <div className="overflow-x-clip">
      <DeriveLanding data={derive2026} layout="flow" />
      <ProgramSection edition="2026" />
      <PartnersSlider edition="2026" />
      <Contact edition="2026" />
    </div>
  );
};

export default Derive2026Page;
