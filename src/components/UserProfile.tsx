import React from 'react';
import { useCTKR } from '../ctkr/context/CTKRContext';
import { UserProperties } from '../types/blog';

/**
 * Component displaying the current user's profile information
 */
export const UserProfile: React.FC = () => {
  const { user } = useCTKR();

  if (!user) {
    return null;
  }

  const userProps = user.properties as unknown as UserProperties;

  return (
    <div className="user-profile">
      <h2>{userProps.displayName || 'User'}</h2>
      <p className="username">@{userProps.username || 'unknown'}</p>
      {userProps.bio && <p className="bio">{userProps.bio}</p>}
      <p className="user-meta">User ID: {user.signature.id.substring(0, 8)}...</p>
    </div>
  );
};
