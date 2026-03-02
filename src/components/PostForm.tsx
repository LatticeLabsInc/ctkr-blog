import React, { useState } from 'react';
import { usePosts } from '../ctkr/hooks/usePosts';

/**
 * Form component for creating new blog posts
 */
export const PostForm: React.FC = () => {
  const { createPost } = usePosts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim() || !content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost(title, content);
      // Clear form on success
      setTitle('');
      setContent('');
      setSuccess(true);
      if (import.meta.env.DEV) {
        console.log('Post created successfully!');
      }
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to create post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h3>Create New Post</h3>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Post created successfully!</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title..."
            disabled={isSubmitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content..."
            rows={6}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};
