import React from 'react';
import Projects from '../../components/shared/projects';
import Contact from '../../components/shared/contact';
import ProgramLanding from '@/components/shared/ProgramLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';
import AfterMovieSection from '@/components/shared/AfterMovieSection';
import { getHomepageData } from '@/lib/actions/homepage.actions';

const Home = async () => {
  const homepage = await getHomepageData();

  return (
    <div className="overflow-hidden">
      <ProgramLanding homepage={homepage} />
      {/* <Projects /> */}
      {/* <AfterMovieSection /> */}
      <DynamicSlider />
      <Contact />
    </div>
  );
};

export default Home;
