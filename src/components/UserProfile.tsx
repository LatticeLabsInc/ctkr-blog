import React from 'react';
import { useCTKR } from '../ctkr/context/CTKRContext';
import { isUserProperties } from '../types/blog';

/**
 * Component displaying the current user's profile information
 */
export const UserProfile: React.FC = () => {
  const { user } = useCTKR();

  if (!user || !isUserProperties(user.properties)) {
    if (import.meta.env.DEV && user && !isUserProperties(user.properties)) {
      console.warn('UserProfile received user without valid properties', user);
    }
    return null;
  }

  const userProps = user.properties;

  return (
    <div className="user-profile">
      <h2>{userProps.displayName || 'User'}</h2>
      <p className="username">@{userProps.username || 'unknown'}</p>
      {userProps.bio && <p className="bio">{userProps.bio}</p>}
      <p className="user-meta">User ID: {user.signature.id.substring(0, 8)}...</p>
    </div>
  );
};
