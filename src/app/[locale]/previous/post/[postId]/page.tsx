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
  const post = await getPostById(postId);
  const artists = await getPostArtists(post);

  return (
    <PostPageBody
      post={post}
      artists={artists}
      edition="2022"
    />
  );
};

export default page;
