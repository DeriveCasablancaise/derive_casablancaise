import React from 'react';
import Projects from '../../components/shared/projects';
import Contact from '../../components/shared/contact';
import ProgramLanding from '@/components/shared/ProgramLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';
import AfterMovieSection from '@/components/shared/AfterMovieSection';

const Home = () => {
  return (
    <div className="overflow-hidden">
      <ProgramLanding />
      <Projects />
      <AfterMovieSection />
      <DynamicSlider />
      <Contact />
    </div>
  );
};

export default Home;
