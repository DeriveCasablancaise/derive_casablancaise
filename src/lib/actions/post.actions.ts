'use server';

import { CreatePostParams, UpdatePostParams } from '@/types';
import { connectToDatabase } from '../database';
import Post, { IPost } from '../database/models/post.model';
import { handleError } from '../utils';
import { revalidatePath } from 'next/cache';
import { Types } from 'mongoose';

const validCategories = [
  'mercredi 04.12',
  'jeudi 05.12',
  'vendredi 06.12',
  'samedi 07.12',
  'dimanche 08.12',
] as const;

type ValidCategory = (typeof validCategories)[number];

// Populate post (remains unchanged)
const populatePost = async (query: any) => {
  return query; // No longer populating from another model
};

// Create Post
export async function createPost(post: CreatePostParams) {
  try {
    await connectToDatabase();

    const newPost = await Post.create({
      ...post,
      images: post.images, // Explicitly set the images array
      postCategory: post.postCategory,
    });

    return JSON.parse(JSON.stringify(newPost));
  } catch (error) {
    handleError(error);
  }
}

// Update Post
export async function updatePost({ post }: UpdatePostParams) {
  try {
    await connectToDatabase();

    const postToUpdate = await Post.findById(post._id);

    if (!postToUpdate) {
      throw new Error('Post Not Found!');
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      {
        ...post,
        images: post.images, // Explicitly update the images array
        postCategory: post.postCategory,
      },
      { new: true }
    );

    revalidatePath('/darja-admin/posts');
    return JSON.parse(JSON.stringify(updatedPost));
  } catch (error) {
    console.error('Error updating the post', error);
    handleError(error);
  }
}

// Delete post
export async function deletePost({
  postId,
  path,
}: {
  postId: string;
  path: string;
}) {
  try {
    await connectToDatabase();

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (deletedPost) revalidatePath(path);
  } catch (error) {
    console.error('Error deleting post', error);
    handleError(error);
  }
}

// Get Post By Id
export async function getPostById(postId: string) {
  try {
    await connectToDatabase();

    const post = await Post.findById(new Types.ObjectId(postId));

    if (!post) throw new Error('Error getting post by its Id');

    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error('Error fetching the post', error);
    handleError(error);
  }
}

// Get All Posts
export async function getAllPosts(category?: ValidCategory) {
  try {
    await connectToDatabase();

    const condition = category ? { postCategory: category } : {};

    const postsQuery = Post.find(condition).sort({ createdAt: 'desc' });

    const posts = await populatePost(postsQuery);

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error Getting All Posts', error);
    handleError(error);
  }
}

// Get Posts By Start Date
export async function getPostsByStartDate() {
  try {
    await connectToDatabase();

    // Query posts sorted by startDateTime in ascending order
    const postsQuery = Post.find().sort({ startDateTime: 1 });

    const posts = await postsQuery;

    // Convert the posts to JSON and return them
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching posts by start date:', error);
    handleError(error);
    return [];
  }
}

// Get Related Posts
export async function getRelatedPosts({
  postCategory,
  postId,
}: {
  postCategory: string;
  postId: string;
}): Promise<IPost[]> {
  try {
    await connectToDatabase();

    const conditions = {
      $and: [{ postCategory }, { _id: { $ne: new Types.ObjectId(postId) } }],
    };

    const relatedPosts = await Post.find(conditions)
      .sort({ startDateTime: 'desc' })
      .limit(3)
      .lean();

    return JSON.parse(JSON.stringify(relatedPosts));
  } catch (error) {
    console.error('Error Getting Related Posts', error);
    handleError(error);
    return [];
  }
}

export async function getPostCounts() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all posts and post categories
    const posts = await Post.find();

    // Return the total counts for both
    return {
      totalPosts: posts.length, // Total posts count
    };
  } catch (error) {
    console.error('Failed to fetch post statistics:', error);
    handleError(error);
    throw new Error('Failed to fetch post statistics');
  }
}

export async function getHomepagePosts() {
  try {
    await connectToDatabase();

    // Find posts where isInHomepage is true
    const postsQuery = Post.find({ isInHomepage: true }).sort({
      createdAt: 'desc',
    });

    const posts = await populatePost(postsQuery); // Populating postCategory if needed

    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching homepage posts:', error);
    handleError(error);
  }
}
