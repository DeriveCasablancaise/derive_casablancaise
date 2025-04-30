import PostForm from '@/components/dashboard/posts/PostForm';
import Navbar from '@/components/shared/Navbar';
import { getPostById } from '@/lib/actions/post.actions';
import React from 'react';

type UpdatePostProps = {
  params: {
    postId: string;
  };
};

const page = async ({ params: { postId } }: UpdatePostProps) => {
  const post = await getPostById(postId);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Navbar title="Modifier ce poste" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <PostForm type="Update" post={post} postId={post._id} />
      </main>
    </div>
  );
};

export default page;
