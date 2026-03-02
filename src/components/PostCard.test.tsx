import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostCard } from './PostCard';
import * as CTKRContext from '../ctkr/context/CTKRContext';

vi.mock('../ctkr/context/CTKRContext');

describe('PostCard', () => {
  const mockPost = {
    signature: { id: 'post-123' },
    properties: {
      type: 'Post',
      title: 'Test Post Title',
      content: 'This is the test post content',
      slug: 'test-post-title',
      tags: ['test', 'blog'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
  };

  const mockUser = {
    signature: { id: 'user-123' },
    metadata: {
      properties: {
        displayName: 'Test User',
      },
    },
  };

  beforeEach(() => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: mockUser,
    } as any);
  });

  it('should render post title', () => {
    render(<PostCard post={mockPost as any} />);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render post content', () => {
    render(<PostCard post={mockPost as any} />);

    expect(screen.getByText('This is the test post content')).toBeInTheDocument();
  });

  it('should render formatted date', () => {
    render(<PostCard post={mockPost as any} />);

    // The exact format depends on locale, but it should contain the date parts
    const dateElement = screen.getByText(/Jan/);
    expect(dateElement).toBeInTheDocument();
  });

  it('should render post ID', () => {
    render(<PostCard post={mockPost as any} />);

    expect(screen.getByText(/ID: post-123.../)).toBeInTheDocument();
  });

  it('should render tags when present', () => {
    render(<PostCard post={mockPost as any} />);

    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#blog')).toBeInTheDocument();
  });

  it('should not render tags section when tags array is empty', () => {
    const postWithoutTags = {
      ...mockPost,
      properties: {
        ...mockPost.properties,
        tags: [],
      },
    };

    render(<PostCard post={postWithoutTags as any} />);

    expect(screen.queryByText(/#/)).not.toBeInTheDocument();
  });

  it('should return null when post properties are missing', () => {
    const postWithoutProperties = {
      signature: { id: 'post-123' },
      properties: null,
    };

    const { container } = render(<PostCard post={postWithoutProperties as any} />);

    expect(container.firstChild).toBeNull();
  });

  it('should handle date formatting errors gracefully', () => {
    const postWithInvalidDate = {
      ...mockPost,
      properties: {
        ...mockPost.properties,
        createdAt: 'invalid-date',
      },
    };

    render(<PostCard post={postWithInvalidDate as any} />);

    // When date is invalid, JavaScript's Date API returns "Invalid Date"
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });

  it('should render with article semantic element', () => {
    const { container } = render(<PostCard post={mockPost as any} />);

    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('should apply correct CSS class', () => {
    const { container } = render(<PostCard post={mockPost as any} />);

    expect(container.querySelector('.post-card')).toBeInTheDocument();
  });
});
