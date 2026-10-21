import Derive2026Form from '@/components/dashboard/derive-2026/derive2026-form';
import Navbar from '@/components/shared/Navbar';
import { getDerive2026Data } from '@/lib/actions/derive2026.actions';

import React from 'react';
import { getAdminOrRedirect } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

const page = async () => {
  const { isAdmin } = await getAdminOrRedirect();
  if (!isAdmin) redirect('/darja-admin');

  const derive2026 = await getDerive2026Data();

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier la page derive 2026" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <Derive2026Form derive2026={derive2026} />
      </main>
    </div>
  );
};

export default page;
