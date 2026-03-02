import React, { createContext, useContext, useState, useEffect, useCallback, PropsWithChildren } from 'react';
import { Client, RichCategory, RichObject, InMemoryStore } from '@ctkr/core';
import { CTKRContextValue } from './types';
import { UserProperties } from '../../types/blog';

/**
 * CTKR Context for managing the blog's category-theoretic data
 */
const CTKRContext = createContext<CTKRContextValue | null>(null);

/**
 * CTKR Provider component that initializes the client, store, and blog category
 */
export const CTKRProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // Singleton instances: useState with lazy initialization ensures these are created once per provider mount
  // and persist across re-renders. The function is only called on initial render.
  const [client] = useState(() => new Client());
  const [store] = useState(() => new InMemoryStore({ id: 'blog-store', name: 'Blog Store' }));

  // State for blog category and user
  const [blogCategory, setBlogCategory] = useState<RichCategory | null>(null);
  const [user, setUser] = useState<RichObject | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // State for posts (shared across all components)
  const [posts, setPosts] = useState<RichObject[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Function to fetch all posts - memoized with proper dependencies
  const refetchPosts = useCallback(async () => {
    if (!blogCategory || !user) {
      return;
    }

    setPostsLoading(true);
    try {
      if (import.meta.env.DEV) {
        console.log('[CTKRContext] Fetching posts for user:', user.signature.id);
      }

      // Get all morphisms from user
      const morphisms = await user.getMorphismsFrom();

      // Filter authorship morphisms
      const authorshipMorphisms = morphisms.filter(
        (m) => m.properties?.type === 'Authorship'
      );

      // Get target objects (posts)
      const postObjects = await Promise.all(
        authorshipMorphisms.map(async (m) => {
          return await m.getTargetObject();
        })
      );

      const validPosts = postObjects.filter(Boolean) as RichObject[];
      setPosts(validPosts);

      if (import.meta.env.DEV) {
        console.log('[CTKRContext] Fetched posts:', validPosts.length);
      }
    } catch (error) {
      console.error('[CTKRContext] Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  }, [blogCategory, user]);

  // Initialize CTKR on mount
  useEffect(() => {
    async function init() {
      try {
        if (import.meta.env.DEV) {
          console.log('[CTKR] Initializing blog...');
        }

        // Attach store to client
        client.attachStore(store);

        // Create blog category
        const category = await client.createCategory(store, { name: 'blog' });
        setBlogCategory(category);

        // Create demo user object
        const userProperties: UserProperties = {
          type: 'User',
          username: 'demo',
          displayName: 'Demo User',
          bio: 'This is a demo account for testing CTKR blog functionality',
          createdAt: new Date().toISOString(),
        };

        const demoUser = await client.createObject(store, category, {
          name: 'demo-user',
          properties: userProperties as unknown as Record<string, unknown>,
        });
        setUser(demoUser);

        setIsInitialized(true);

        if (import.meta.env.DEV) {
          console.log('[CTKR] Initialization complete');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Initialization failed');
        setError(error);
        console.error('[CTKR] Initialization failed:', error);
      }
    }

    init();
  }, [client, store]);

  // Fetch posts when initialized
  useEffect(() => {
    if (isInitialized) {
      refetchPosts();
    }
  }, [isInitialized, refetchPosts]);

  const value: CTKRContextValue = {
    client,
    store,
    blogCategory,
    user,
    isInitialized,
    posts,
    postsLoading,
    refetchPosts,
    error,
  };

  return <CTKRContext.Provider value={value}>{children}</CTKRContext.Provider>;
};

/**
 * Hook to access CTKR context
 * @throws Error if used outside CTKRProvider
 */
export const useCTKR = (): CTKRContextValue => {
  const context = useContext(CTKRContext);
  if (!context) {
    throw new Error('useCTKR must be used within CTKRProvider');
  }
  return context;
};
