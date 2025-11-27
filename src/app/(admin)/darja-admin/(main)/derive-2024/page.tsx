import Derive2024Form from '@/components/dashboard/derive-2024/derive2024-form';
import Navbar from '@/components/shared/Navbar';
import { getDerive2024Data } from '@/lib/actions/derive2024.actions';

import React from 'react';

const page = async () => {
  const derive2024 = await getDerive2024Data();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier la page derive 2024" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <Derive2024Form derive2024={derive2024} />
      </main>
    </div>
  );
};

export default page;
