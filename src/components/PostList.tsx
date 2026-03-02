import React from 'react';
import { usePosts } from '../ctkr/hooks/usePosts';
import { PostCard } from './PostCard';

/**
 * Component displaying list of all blog posts
 */
export const PostList: React.FC = () => {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="post-list">
        <h2>Blog Posts</h2>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>Blog Posts ({posts.length})</h2>
      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Create your first post above! 👆</p>
        </div>
      ) : (
        <div className="posts-container">
          {posts.map((post) => (
            <PostCard key={post.signature.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
