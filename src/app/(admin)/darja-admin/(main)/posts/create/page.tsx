import PostForm from '@/components/dashboard/posts/PostForm';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const page = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Créer un nouveau poste" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <PostForm type="Create" />
      </main>
    </div>
  );
};

export default page;
