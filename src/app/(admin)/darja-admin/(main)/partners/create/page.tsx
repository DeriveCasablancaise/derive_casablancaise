import PartnerForm from '@/components/dashboard/partners/PartnerForm';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const page = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Créer un nouveau partenaire" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <PartnerForm type="Create" />
      </main>
    </div>
  );
};

export default page;
