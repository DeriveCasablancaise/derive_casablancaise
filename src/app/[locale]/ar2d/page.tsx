import React from 'react';
import AboutLanding from '@/components/shared/About/AboutLanding';
import VideoSection from '@/components/shared/Derive2024/VideoSection';
import Contact from '@/components/shared/contact';
import { getAr2dData } from '@/lib/actions/ar2d.actions';

const EspaceDarja = async () => {
  const ar2d = await getAr2dData();

  return (
    <div className="overflow-hidden">
      <AboutLanding ar2d={ar2d} />
      <Contact />
    </div>
  );
};

export default EspaceDarja;
