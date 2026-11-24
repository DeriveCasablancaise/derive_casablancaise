import React from 'react';
import Contact from '../../components/shared/contact';
import ProgramLanding from '@/components/shared/ProgramLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';
import PartnersSlider from '@/components/shared/PartnersSlider';
import { CURRENT_EDITION_YEAR } from '@/constants/editions';
import { getHomepageData } from '@/lib/actions/homepage.actions';
import { getBannerData } from '@/lib/actions/banner.actions';
import { getBannerView } from '@/lib/banner';

const Home = async ({ params: { locale } }: { params: { locale: string } }) => {
  const [homepage, bannerData] = await Promise.all([
    getHomepageData(),
    getBannerData(),
  ]);
  const banner = getBannerView(bannerData, locale);

  return (
    <div className="overflow-hidden">
      <ProgramLanding homepage={homepage} banner={banner} />
      {/* <Projects /> */}
      {/* <AfterMovieSection /> */}
      <DynamicSlider />
      <PartnersSlider edition={CURRENT_EDITION_YEAR} />
      <Contact />
    </div>
  );
};

export default Home;
