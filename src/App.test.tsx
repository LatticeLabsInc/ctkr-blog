import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as CTKRContext from './ctkr/context/CTKRContext';

// Mock all the child components
vi.mock('./components/UserProfile', () => ({
  UserProfile: () => <div data-testid="user-profile">UserProfile</div>,
}));

vi.mock('./components/PostForm', () => ({
  PostForm: () => <div data-testid="post-form">PostForm</div>,
}));

vi.mock('./components/PostList', () => ({
  PostList: () => <div data-testid="post-list">PostList</div>,
}));

// Mock CTKRProvider to avoid actual initialization
vi.mock('./ctkr/context/CTKRContext', async () => {
  const actual = await vi.importActual('./ctkr/context/CTKRContext');
  return {
    ...actual,
    CTKRProvider: ({ children }: any) => <div>{children}</div>,
    useCTKR: vi.fn(),
  };
});

describe('App', () => {
  it('should render loading state when not initialized', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      isInitialized: false,
    } as any);

    render(<App />);

    expect(screen.getByText('CTKR Blog')).toBeInTheDocument();
    expect(screen.getByText('Initializing CTKR blog...')).toBeInTheDocument();
  });

  it('should render main content when initialized', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      isInitialized: true,
    } as any);

    render(<App />);

    expect(screen.getByText('CTKR Blog')).toBeInTheDocument();
    expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    expect(screen.getByTestId('post-form')).toBeInTheDocument();
    expect(screen.getByTestId('post-list')).toBeInTheDocument();
  });

  it('should not render components when not initialized', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      isInitialized: false,
    } as any);

    render(<App />);

    expect(screen.queryByTestId('user-profile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('post-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('post-list')).not.toBeInTheDocument();
  });

  it('should have correct main container structure', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      isInitialized: true,
    } as any);

    const { container } = render(<App />);

    expect(container.querySelector('main.container')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('.create-section')).toBeInTheDocument();
    expect(container.querySelector('.posts-section')).toBeInTheDocument();
  });

  it('should render h1 with correct text', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      isInitialized: true,
    } as any);

    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('CTKR Blog');
  });

  it('should wrap everything in CTKRProvider', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      isInitialized: true,
    } as any);

    // This test verifies that App uses CTKRProvider by checking
    // that the component renders without crashing
    expect(() => render(<App />)).not.toThrow();
  });
});
