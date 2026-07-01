import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';

type SignInDialogProps = {
  onAccountCreated: (username: string) => void;
  onClose: () => void;
};

export function SignInDialog({ onAccountCreated, onClose }: SignInDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signInWithGoogle = async () => {
    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setMessage('Could not open Google sign in.');
  };

  const submitSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setMessage('Please write a username.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    const email = makeAccountEmail(cleanUsername);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    const signUpError = signInError ? await createAccount(email, password, cleanUsername) : null;
    setIsSubmitting(false);
    if (signUpError) {
      setMessage('Could not sign in. Try another username or password.');
      return;
    }
    onAccountCreated(cleanUsername);
    setMessage(`Signed in as ${cleanUsername}!`);
    window.setTimeout(onClose, 700);
  };

  return (
    <div className="auth-dialog-backdrop">
      <form className="auth-dialog" onSubmit={submitSignIn}>
        <div className="auth-dialog-header">
          <h2>Sign In</h2>
          <button type="button" onClick={onClose} aria-label="Close sign in form">×</button>
        </div>
        <button className="google-auth-button" type="button" onClick={signInWithGoogle}>
          <span>G</span>
          Continue with Google
        </button>
        <div className="auth-divider">or</div>
        <label htmlFor="sign-in-username">Username</label>
        <input
          id="sign-in-username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="sign-in-password">Password</label>
        <input
          id="sign-in-password"
          type="password"
          value={password}
          minLength={8}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in' : 'Sign In'}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

function makeAccountEmail(username: string) {
  return `dj-${hashUsername(username)}@iskanderdj.app`;
}

async function createAccount(email: string, password: string, username: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  return error;
}

function hashUsername(username: string) {
  let hash = 0;
  for (const letter of username) {
    hash = (hash * 31 + letter.codePointAt(0)!) >>> 0;
  }
  return hash.toString(16);
}
