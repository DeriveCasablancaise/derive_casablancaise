import Ar2dForm from '@/components/dashboard/ar2d/ar2d-form';
import Navbar from '@/components/shared/Navbar';
import { getAr2dData } from '@/lib/actions/ar2d.actions';
import React from 'react';

const page = async () => {
  const ar2d = await getAr2dData();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier la page AR2D" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <Ar2dForm ar2d={ar2d} />
      </main>
    </div>
  );
};

export default page;
