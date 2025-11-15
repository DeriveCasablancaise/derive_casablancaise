import HomepageForm from '@/components/dashboard/homepage/homepage-form';
import Navbar from '@/components/shared/Navbar';
import { getHomepageData } from '@/lib/actions/homepage.actions';
import React from 'react';

const page = async () => {
  const homepage = await getHomepageData();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier la page d'accueil" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <HomepageForm homepage={homepage} />
      </main>
    </div>
  );
};

export default page;
