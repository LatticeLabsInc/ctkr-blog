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
