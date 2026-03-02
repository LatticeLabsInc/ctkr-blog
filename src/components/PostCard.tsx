import React from 'react';
import { RichObject } from '@ctkr/core';
import { isPostProperties } from '../types/blog';
import { formatDate } from '../utils/dateFormatters';

interface PostCardProps {
  post: RichObject;
}

/**
 * Component displaying a single blog post
 */
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  if (!isPostProperties(post.properties)) {
    if (import.meta.env.DEV) {
      console.warn('PostCard received post without valid properties', post);
    }
    return null;
  }

  const postProps = post.properties;

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
