import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
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
  // Create singleton instances of client and store
  const [client] = useState(() => new Client());
  const [store] = useState(() => new InMemoryStore({ id: 'blog-store', name: 'Blog Store' }));

  // State for blog category and user
  const [blogCategory, setBlogCategory] = useState<RichCategory | null>(null);
  const [user, setUser] = useState<RichObject | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // State for posts (shared across all components)
  const [posts, setPosts] = useState<RichObject[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Function to fetch all posts
  const refetchPosts = async () => {
    if (!blogCategory || !user) {
      console.log('[CTKRContext] Cannot fetch posts - not initialized');
      return;
    }

    setPostsLoading(true);
    try {
      console.log('[CTKRContext] Fetching posts for user:', user.signature.id);

      // Get all morphisms from user
      const morphisms = await user.getMorphismsFrom();
      console.log('[CTKRContext] Found morphisms:', morphisms.length);

      // Filter authorship morphisms
      const authorshipMorphisms = morphisms.filter(
        (m) => m.properties?.type === 'Authorship'
      );
      console.log('[CTKRContext] Authorship morphisms:', authorshipMorphisms.length);

      // Get target objects (posts)
      const postObjects = await Promise.all(
        authorshipMorphisms.map(async (m) => {
          return await m.getTargetObject();
        })
      );

      const validPosts = postObjects.filter(Boolean) as RichObject[];
      console.log('[CTKRContext] Fetched posts:', validPosts.length);
      setPosts(validPosts);
    } catch (error) {
      console.error('[CTKRContext] Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  // Initialize CTKR on mount
  useEffect(() => {
    async function init() {
      try {
        console.log('[CTKR] Initializing blog...');

        // Attach store to client
        client.attachStore(store);
        console.log('[CTKR] Store attached');

        // Create blog category
        const category = await client.createCategory(store, { name: 'blog' });
        setBlogCategory(category);
        console.log('[CTKR] Category created:', category.signature.id);

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
        console.log('[CTKR] User created:', demoUser.signature.id);

        setIsInitialized(true);
        console.log('[CTKR] Initialization complete');
      } catch (error) {
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
  }, [isInitialized]);

  const value: CTKRContextValue = {
    client,
    store,
    blogCategory,
    user,
    isInitialized,
    posts,
    postsLoading,
    refetchPosts,
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
