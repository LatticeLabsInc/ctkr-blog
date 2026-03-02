import { useCallback } from 'react';
import { useCTKR } from '../context/CTKRContext';
import { PostProperties, AuthorshipProperties } from '../../types/blog';

/**
 * Hook for managing blog posts using CTKR
 * Uses shared context state so all components see the same posts
 */
export const usePosts = () => {
  const { client, store, blogCategory, user, posts, postsLoading, refetchPosts } = useCTKR();

  /**
   * Create a new post
   */
  const createPost = useCallback(
    async (title: string, content: string) => {
      if (!blogCategory || !user) {
        throw new Error('CTKR not initialized');
      }

      if (import.meta.env.DEV) {
        console.log('[usePosts] Creating post:', { title, content: content.substring(0, 50) + '...' });
      }

      const postId = crypto.randomUUID();
      const slug = title.toLowerCase().replace(/\s+/g, '-');

      // Create post object
      const postProperties: PostProperties = {
        type: 'Post',
        title,
        content,
        slug,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const post = await client.createObject(store, blogCategory, {
        name: `post-${postId}`,
        properties: postProperties as unknown as Record<string, unknown>,
      });

      if (import.meta.env.DEV) {
        console.log('[usePosts] Post object created:', post.signature.id);
      }

      // Create authorship morphism
      const authorshipProperties: AuthorshipProperties = {
        type: 'Authorship',
        createdAt: new Date().toISOString(),
      };

      const morphism = await client.createMorphism(user, post, store, blogCategory, {
        name: `authored-${postId}`,
        properties: authorshipProperties as unknown as Record<string, unknown>,
      });

      if (import.meta.env.DEV) {
        console.log('[usePosts] Authorship morphism created:', morphism.signature.id);
      }

      // Refresh posts from context (this will update all components)
      await refetchPosts();

      return post;
    },
    [client, store, blogCategory, user, refetchPosts]
  );

  return {
    posts,
    loading: postsLoading,
    createPost,
    refreshPosts: refetchPosts,
  };
};
