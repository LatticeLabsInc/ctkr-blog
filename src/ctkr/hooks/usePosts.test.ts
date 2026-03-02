import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from './usePosts';
import * as CTKRContext from '../context/CTKRContext';

// Mock the CTKR context
vi.mock('../context/CTKRContext', () => ({
  useCTKR: vi.fn(),
}));

describe('usePosts', () => {
  const mockClient = {
    createObject: vi.fn(),
    createMorphism: vi.fn(),
  };

  const mockStore = {};
  const mockBlogCategory = { signature: { id: 'cat-123' } };
  const mockUser = { signature: { id: 'user-123' } };
  const mockRefetchPosts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementation
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      client: mockClient as any,
      store: mockStore as any,
      blogCategory: mockBlogCategory as any,
      user: mockUser as any,
      posts: [],
      postsLoading: false,
      refetchPosts: mockRefetchPosts,
      isInitialized: true,
      error: null,
    });
  });

  it('should return posts and loading state from context', () => {
    const { result } = renderHook(() => usePosts());

    expect(result.current.posts).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should return createPost function', () => {
    const { result } = renderHook(() => usePosts());

    expect(result.current.createPost).toBeDefined();
    expect(typeof result.current.createPost).toBe('function');
  });

  it('should throw error when creating post without initialized CTKR', async () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      client: mockClient as any,
      store: mockStore as any,
      blogCategory: null,
      user: mockUser as any,
      posts: [],
      postsLoading: false,
      refetchPosts: mockRefetchPosts,
      isInitialized: false,
      error: null,
    });

    const { result } = renderHook(() => usePosts());

    await expect(result.current.createPost('Test', 'Content')).rejects.toThrow(
      'CTKR not initialized'
    );
  });

  it('should successfully create a post with valid inputs', async () => {
    const mockPost = {
      signature: { id: 'post-123' },
      properties: { title: 'Test Post', content: 'Test content' },
    };

    const mockMorphism = {
      signature: { id: 'morphism-123' },
    };

    mockClient.createObject.mockResolvedValue(mockPost);
    mockClient.createMorphism.mockResolvedValue(mockMorphism);

    const { result } = renderHook(() => usePosts());

    const post = await result.current.createPost('Test Post', 'Test content');

    expect(mockClient.createObject).toHaveBeenCalledWith(
      mockStore,
      mockBlogCategory,
      expect.objectContaining({
        name: expect.stringContaining('post-'),
        properties: expect.objectContaining({
          type: 'Post',
          title: 'Test Post',
          content: 'Test content',
        }),
      })
    );

    expect(mockClient.createMorphism).toHaveBeenCalledWith(
      mockUser,
      mockPost,
      mockStore,
      mockBlogCategory,
      expect.objectContaining({
        name: expect.stringContaining('authored-'),
        properties: expect.objectContaining({
          type: 'Authorship',
        }),
      })
    );

    expect(mockRefetchPosts).toHaveBeenCalled();
    expect(post).toEqual(mockPost);
  });

  it('should generate slug from title correctly', async () => {
    const mockPost = { signature: { id: 'post-123' } };
    mockClient.createObject.mockResolvedValue(mockPost);
    mockClient.createMorphism.mockResolvedValue({ signature: { id: 'morph-123' } });

    const { result } = renderHook(() => usePosts());

    await result.current.createPost('My Test Post', 'Content');

    expect(mockClient.createObject).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        properties: expect.objectContaining({
          slug: 'my-test-post',
        }),
      })
    );
  });

  it('should include timestamps in created post', async () => {
    const mockPost = { signature: { id: 'post-123' } };
    mockClient.createObject.mockResolvedValue(mockPost);
    mockClient.createMorphism.mockResolvedValue({ signature: { id: 'morph-123' } });

    const { result } = renderHook(() => usePosts());

    await result.current.createPost('Test', 'Content');

    expect(mockClient.createObject).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        properties: expect.objectContaining({
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      })
    );
  });
});
