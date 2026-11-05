import React, { Suspense } from 'react';
import ArtistsSection from '@/components/shared/ArtistsSection';
import Contact from '@/components/shared/contact';

const Community = () => {
  return (
    <div className="overflow-hidden">
      {/* useSearchParams needs a Suspense boundary at build time */}
      <Suspense fallback={<div className="min-h-screen bg-[#E9EAEB]" />}>
        <ArtistsSection />
      </Suspense>
      <Contact />
    </div>
  );
};

export default Community;
