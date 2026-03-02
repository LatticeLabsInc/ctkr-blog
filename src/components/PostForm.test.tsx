import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostForm } from './PostForm';
import * as usePostsHook from '../ctkr/hooks/usePosts';

vi.mock('../ctkr/hooks/usePosts');

describe('PostForm', () => {
  const mockCreatePost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePostsHook.usePosts).mockReturnValue({
      posts: [],
      loading: false,
      createPost: mockCreatePost,
      refreshPosts: vi.fn(),
    });
  });

  it('should render form with title and content inputs', () => {
    render(<PostForm />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Post/i })).toBeInTheDocument();
  });

  it('should render form heading', () => {
    render(<PostForm />);

    expect(screen.getByText('Create New Post')).toBeInTheDocument();
  });

  it('should allow typing in title input', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    await user.type(titleInput, 'My Test Post');

    expect(titleInput.value).toBe('My Test Post');
  });

  it('should allow typing in content textarea', async () => {
    const user = userEvent.setup();
    render(<PostForm />);

    const contentInput = screen.getByLabelText('Content') as HTMLTextAreaElement;
    await user.type(contentInput, 'This is my test content');

    expect(contentInput.value).toBe('This is my test content');
  });

  it('should call createPost with title and content on submit', async () => {
    mockCreatePost.mockResolvedValue({ signature: { id: 'post-123' } });
    const user = userEvent.setup();

    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title');
    const contentInput = screen.getByLabelText('Content');
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith('Test Title', 'Test Content');
    });
  });

  it('should clear form after successful submission', async () => {
    mockCreatePost.mockResolvedValue({ signature: { id: 'post-123' } });
    const user = userEvent.setup();

    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const contentInput = screen.getByLabelText('Content') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(contentInput.value).toBe('');
    });
  });

  it('should show alert when submitting with empty title', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<PostForm />);

    const contentInput = screen.getByLabelText('Content');
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Please fill in both title and content');
    expect(mockCreatePost).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('should show alert when submitting with empty content', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title');
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(titleInput, 'Test Title');
    await user.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith('Please fill in both title and content');
    expect(mockCreatePost).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it('should disable button while submitting', async () => {
    let resolveCreatePost: any;
    mockCreatePost.mockReturnValue(
      new Promise((resolve) => {
        resolveCreatePost = resolve;
      })
    );

    const user = userEvent.setup();
    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title');
    const contentInput = screen.getByLabelText('Content');
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    resolveCreatePost({ signature: { id: 'post-123' } });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText('Create Post')).toBeInTheDocument();
    });
  });

  it('should handle createPost errors gracefully', async () => {
    mockCreatePost.mockRejectedValue(new Error('Failed to create post'));
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title');
    const contentInput = screen.getByLabelText('Content');
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Failed to create post. Check console for details.');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to create post:',
        expect.any(Error)
      );
    });

    alertSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should not submit form when only whitespace is entered', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const user = userEvent.setup();

    render(<PostForm />);

    const titleInput = screen.getByLabelText('Title');
    const contentInput = screen.getByLabelText('Content');
    const submitButton = screen.getByRole('button', { name: /Create Post/i });

    await user.type(titleInput, '   ');
    await user.type(contentInput, '   ');
    await user.click(submitButton);

    expect(alertSpy).toHaveBeenCalled();
    expect(mockCreatePost).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
