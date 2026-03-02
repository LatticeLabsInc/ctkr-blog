import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import * as CTKRContext from '../ctkr/context/CTKRContext';

vi.mock('../ctkr/context/CTKRContext');

describe('UserProfile', () => {
  it('should render user display name', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-123' },
        properties: {
          type: 'User',
          username: 'testuser',
          displayName: 'Test User',
          bio: 'Test bio',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should render username with @ prefix', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-123' },
        properties: {
          type: 'User',
          username: 'testuser',
          displayName: 'Test User',
          bio: 'Test bio',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('should render bio when present', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-123' },
        properties: {
          type: 'User',
          username: 'testuser',
          displayName: 'Test User',
          bio: 'This is my test bio',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText('This is my test bio')).toBeInTheDocument();
  });

  it('should render user ID', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-12345678' },
        properties: {
          type: 'User',
          username: 'testuser',
          displayName: 'Test User',
          bio: 'Test bio',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText(/User ID: user-123.../)).toBeInTheDocument();
  });

  it('should render null when user is null', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: null,
    } as any);

    const { container } = render(<UserProfile />);

    expect(container.firstChild).toBeNull();
  });

  it('should handle missing bio gracefully', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-123' },
        properties: {
          type: 'User',
          username: 'testuser',
          displayName: 'Test User',
          bio: '',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.queryByText(/This is/)).not.toBeInTheDocument();
  });

  it('should use fallback for missing display name', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-123' },
        properties: {
          type: 'User',
          username: 'testuser',
          displayName: '',
          bio: 'Test bio',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('should use fallback for missing username', () => {
    vi.mocked(CTKRContext.useCTKR).mockReturnValue({
      user: {
        signature: { id: 'user-123' },
        properties: {
          type: 'User',
          username: '',
          displayName: 'Test User',
          bio: 'Test bio',
          createdAt: '2024-01-01',
        },
      } as any,
    } as any);

    render(<UserProfile />);

    expect(screen.getByText('@unknown')).toBeInTheDocument();
  });
});
