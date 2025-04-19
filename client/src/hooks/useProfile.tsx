import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

export function useProfile() {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already selected a profile
    const savedProfile = localStorage.getItem('token') as UserProfile | null;
    if (savedProfile) {
      setUserProfileState(savedProfile);
    }
    setIsLoading(false);
  }, []);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    localStorage.setItem('airInfoUserProfile', profile);
  };

  const toggleProfile = () => {
    const newProfile = userProfile === 'sensible' ? 'public' : 'sensible';
    setUserProfile(newProfile);
  };

  return {
    userProfile,
    setUserProfile,
    toggleProfile,
    isLoading
  };
}
