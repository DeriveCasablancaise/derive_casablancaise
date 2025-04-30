import React from 'react';

import StatCard from '../shared/StatsCard';
import MainPageStatsCards from './MainPageComp';
import { getArtistsCounts } from '@/lib/actions/artists.actions';
import { getPostCounts } from '@/lib/actions/post.actions';

const MainPage = async () => {
  const postCounts = await getPostCounts();
  const artistCounts = await getArtistsCounts();

  return (
    <MainPageStatsCards
      artistCounts={artistCounts.totalArtists}
      postCounts={postCounts.totalPosts}
    />
  );
};

export default MainPage;
