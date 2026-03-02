import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PostList } from './PostList';
import * as usePostsHook from '../ctkr/hooks/usePosts';

vi.mock('../ctkr/hooks/usePosts');
vi.mock('./PostCard', () => ({
  PostCard: ({ post }: any) => <div data-testid="post-card">{post.properties.title}</div>,
}));

describe('PostList', () => {
  it('should render loading state', () => {
    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: [],
      loading: true,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    render(<PostList />);

    expect(screen.getByText('Blog Posts')).toBeInTheDocument();
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('should render empty state when no posts', () => {
    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: [],
      loading: false,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    render(<PostList />);

    expect(screen.getByText('Blog Posts (0)')).toBeInTheDocument();
    expect(screen.getByText(/No posts yet/)).toBeInTheDocument();
  });

  it('should render posts when available', () => {
    const mockPosts = [
      {
        signature: { id: 'post-1' },
        properties: {
          title: 'First Post',
          content: 'Content 1',
        },
      },
      {
        signature: { id: 'post-2' },
        properties: {
          title: 'Second Post',
          content: 'Content 2',
        },
      },
    ];

    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: mockPosts as any,
      loading: false,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    render(<PostList />);

    expect(screen.getByText('Blog Posts (2)')).toBeInTheDocument();
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('should render correct number of PostCard components', () => {
    const mockPosts = [
      {
        signature: { id: 'post-1' },
        properties: { title: 'Post 1' },
      },
      {
        signature: { id: 'post-2' },
        properties: { title: 'Post 2' },
      },
      {
        signature: { id: 'post-3' },
        properties: { title: 'Post 3' },
      },
    ];

    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: mockPosts as any,
      loading: false,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    render(<PostList />);

    const postCards = screen.getAllByTestId('post-card');
    expect(postCards).toHaveLength(3);
  });

  it('should display correct post count in header', () => {
    const mockPosts = Array(5)
      .fill(null)
      .map((_, i) => ({
        signature: { id: `post-${i}` },
        properties: { title: `Post ${i}` },
      }));

    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: mockPosts as any,
      loading: false,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    render(<PostList />);

    expect(screen.getByText('Blog Posts (5)')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: [],
      loading: false,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    const { container } = render(<PostList />);

    expect(container.querySelector('.post-list')).toBeInTheDocument();
    expect(container.querySelector('.empty-state')).toBeInTheDocument();
  });

  it('should render posts-container when posts exist', () => {
    const mockPosts = [
      {
        signature: { id: 'post-1' },
        properties: { title: 'Test Post' },
      },
    ];

    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: mockPosts as any,
      loading: false,
      createPost: vi.fn(),
      refreshPosts: vi.fn(),
    });

    const { container } = render(<PostList />);

    expect(container.querySelector('.posts-container')).toBeInTheDocument();
  });
});
