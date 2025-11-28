import React from 'react';
import Contact from '../../components/shared/contact';
import ProgramLanding from '@/components/shared/ProgramLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';
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
