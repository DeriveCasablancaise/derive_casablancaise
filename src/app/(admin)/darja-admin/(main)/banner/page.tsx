import BannerForm from '@/components/dashboard/banner/banner-form';
import Navbar from '@/components/shared/Navbar';
import { getBannerData } from '@/lib/actions/banner.actions';

import React from 'react';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const page = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  const banner = await getBannerData();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier la bannière" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <BannerForm banner={banner} />
      </main>
    </div>
  );
};

export default page;
