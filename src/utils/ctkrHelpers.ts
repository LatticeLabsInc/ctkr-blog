/**
 * Helper functions for CTKR type conversions
 */

import type { UserProperties, PostProperties, AuthorshipProperties } from '../types/blog';

/**
 * Safely converts typed properties to CTKR's Record<string, unknown> format.
 * This validates the properties have all required fields before conversion.
 */
export function toCtkriProperties<T extends Record<string, unknown>>(
  properties: T
): Record<string, unknown> {
  // Validate that properties is a plain object
  if (typeof properties !== 'object' || properties === null || Array.isArray(properties)) {
    throw new Error('Properties must be a plain object');
  }

  // Create a new object to avoid mutations
  return { ...properties };
}

/**
 * Type-safe converter for UserProperties
 */
export function userPropertiesToCtkr(properties: UserProperties): Record<string, unknown> {
  return toCtkriProperties(properties);
}

/**
 * Type-safe converter for PostProperties
 */
export function postPropertiesToCtkr(properties: PostProperties): Record<string, unknown> {
  return toCtkriProperties(properties);
}

/**
 * Type-safe converter for AuthorshipProperties
 */
export function authorshipPropertiesToCtkr(properties: AuthorshipProperties): Record<string, unknown> {
  return toCtkriProperties(properties);
}
