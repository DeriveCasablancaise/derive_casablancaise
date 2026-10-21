import Derive2022Form from '@/components/dashboard/derive-2022/derive2022-form';
import Navbar from '@/components/shared/Navbar';
import { getDerive2022Data } from '@/lib/actions/derive2022.actions';

import React from 'react';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const page = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  const derive2022 = await getDerive2022Data();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier la page derive 2022" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <Derive2022Form derive2022={derive2022} />
      </main>
    </div>
  );
};

export default page;
