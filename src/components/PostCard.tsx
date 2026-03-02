import React from 'react';
import { RichObject } from '@ctkr/core';
import { PostProperties } from '../types/blog';

interface PostCardProps {
  post: RichObject;
}

/**
 * Component displaying a single blog post
 */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postProps = post.properties as unknown as PostProperties;

  console.log('[PostCard] Rendering post:', {
    postId: post.signature.id,
    properties: post.properties,
    postProps
  });

  if (!postProps) {
    console.log('[PostCard] No properties, returning null');
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="post-card">
      <h3>{postProps.title}</h3>
      <div className="post-content">{postProps.content}</div>
      <div className="post-meta">
        <span className="post-date">{formatDate(postProps.createdAt)}</span>
        <span className="post-id">ID: {post.signature.id.substring(0, 8)}...</span>
      </div>
      {postProps.tags && postProps.tags.length > 0 && (
        <div className="post-tags">
          {postProps.tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
