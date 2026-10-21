import React from 'react';
import Contact from '../../components/shared/contact';
import ProgramLanding from '@/components/shared/ProgramLanding';
import DynamicSlider from '@/components/shared/DynamicSlider';
import Banner from '@/components/shared/Banner';
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
      <Banner view={banner} />
      {/* with a banner, the landing title anchors under it instead of the page top */}
      <div className={banner ? 'relative' : undefined}>
        <ProgramLanding homepage={homepage} />
      </div>
      {/* <Projects /> */}
      {/* <AfterMovieSection /> */}
      <DynamicSlider />
      <Contact />
    </div>
  );
};

export default Home;
