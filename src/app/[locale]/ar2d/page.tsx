import React from 'react';
import AboutLanding from '@/components/shared/About/AboutLanding';
import Contact from '@/components/shared/contact';
import { getAr2dData } from '@/lib/actions/ar2d.actions';

const EspaceDarja = async () => {
  const ar2d = await getAr2dData();

  return (
    // overflow-x-clip, not hidden: hidden would break the sticky background
    <div className="overflow-x-clip">
      <AboutLanding ar2d={ar2d} layout="flow" backgroundFit="pan" />
      <Contact />
    </div>
  );
};

export default EspaceDarja;
