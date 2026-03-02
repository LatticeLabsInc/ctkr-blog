/**
 * Type definitions for the CTKR blog application
 */

/**
 * User object properties stored in CTKR
 */
export interface UserProperties {
  type: "User";
  username: string;
  displayName: string;
  bio: string;
  createdAt: string; // ISO8601 timestamp
}

/**
 * Post object properties stored in CTKR
 */
export interface PostProperties {
  type: "Post";
  title: string;
  content: string;
  slug: string;
  tags: string[];
  createdAt: string; // ISO8601 timestamp
  updatedAt: string; // ISO8601 timestamp
}

/**
 * Authorship morphism properties stored in CTKR
 */
export interface AuthorshipProperties {
  type: "Authorship";
  createdAt: string; // ISO8601 timestamp
}

/**
 * Type guard to check if unknown value is UserProperties
 */
export function isUserProperties(value: unknown): value is UserProperties {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as any).type === 'User' &&
    'username' in value &&
    typeof (value as any).username === 'string' &&
    'displayName' in value &&
    typeof (value as any).displayName === 'string' &&
    'bio' in value &&
    typeof (value as any).bio === 'string' &&
    'createdAt' in value &&
    typeof (value as any).createdAt === 'string'
  );
}

/**
 * Type guard to check if unknown value is PostProperties
 */
export function isPostProperties(value: unknown): value is PostProperties {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as any).type === 'Post' &&
    'title' in value &&
    typeof (value as any).title === 'string' &&
    'content' in value &&
    typeof (value as any).content === 'string' &&
    'slug' in value &&
    typeof (value as any).slug === 'string' &&
    'tags' in value &&
    Array.isArray((value as any).tags) &&
    'createdAt' in value &&
    typeof (value as any).createdAt === 'string' &&
    'updatedAt' in value &&
    typeof (value as any).updatedAt === 'string'
  );
}

/**
 * Type guard to check if unknown value is AuthorshipProperties
 */
export function isAuthorshipProperties(value: unknown): value is AuthorshipProperties {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as any).type === 'Authorship' &&
    'createdAt' in value &&
    typeof (value as any).createdAt === 'string'
  );
}
