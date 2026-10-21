import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/actions/post.actions';
import PostPageBody, {
  getPostArtists,
} from '@/components/shared/Derive2024/PostPageBody';

type PostProps = {
  params: {
    postId: string;
  };
};

const page = async ({ params: { postId } }: PostProps) => {
  const post = await getPostById(postId, '2024');
  if (!post) notFound();
  const artists = await getPostArtists(post);

  return (
    <PostPageBody
      post={post}
      artists={artists}
      edition="2024"
      topSpacing
    />
  );
};

export default page;
