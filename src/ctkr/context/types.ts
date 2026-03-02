import { Client, RichCategory, RichObject, InMemoryStore } from '@ctkr/core';

/**
 * CTKR Context value provided to all components
 */
export interface CTKRContextValue {
  /** CTKR client instance */
  client: Client;

  /** In-memory store for blog data */
  store: InMemoryStore;

  /** Blog category containing all objects and morphisms */
  blogCategory: RichCategory | null;

  /** Current user object (demo user) */
  user: RichObject | null;

  /** Whether CTKR has been initialized */
  isInitialized: boolean;

  /** All posts (shared state) */
  posts: RichObject[];

  /** Whether posts are being loaded */
  postsLoading: boolean;

  /** Refetch posts from CTKR */
  refetchPosts: () => Promise<void>;

  /** Initialization error, if any */
  error: Error | null;
}
