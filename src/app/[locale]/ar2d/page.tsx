import React from 'react';
import AboutLanding from '@/components/shared/About/AboutLanding';
import VideoSection from '@/components/shared/Derive2024/VideoSection';
import Contact from '@/components/shared/contact';

const EspaceDarja = () => {
  return (
    <div className="overflow-hidden">
      <AboutLanding />
      <VideoSection />
      {/* <DynamicSlider /> */}
      <Contact />
    </div>
  );
};

export default EspaceDarja;
