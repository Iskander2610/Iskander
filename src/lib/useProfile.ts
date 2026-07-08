import { useEffect, useState } from 'react';
import { isBannedUser } from './bans';
import { supabase } from './supabase';

export function useProfile() {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && isBannedUser(data.user)) {
        setIsBlocked(true);
        void supabase.auth.signOut();
        return;
      }
      const metadata = data.user?.user_metadata;
      const username = metadata?.username ?? metadata?.name ?? metadata?.full_name ?? data.user?.email?.split('@')[0];
      if (typeof username === 'string') setProfileName(username);
    }).finally(() => {
      setIsLoading(false);
    });
    setProfileAvatar(localStorage.getItem('profile-avatar') ?? '');
  }, []);

  const updateProfileAvatar = (avatarUrl: string) => {
    setProfileAvatar(avatarUrl);
    localStorage.setItem('profile-avatar', avatarUrl);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setProfileName('');
    setIsLogInOpen(false);
    setIsSignInOpen(false);
  };

  return {
    isBlocked,
    isLoading,
    isLogInOpen,
    isSignInOpen,
    profileAvatar,
    profileName,
    setIsLogInOpen,
    setIsSignInOpen,
    setProfileName,
    logOut,
    updateProfileAvatar,
  };
}
