import { useState } from 'react';
import type { FormEvent } from 'react';
import { isBannedName } from '../lib/bans';
import { makePossibleAccountEmails } from '../lib/accountAuth';
import { supabase } from '../lib/supabase';

type LogInDialogProps = {
  onClose: () => void;
  onLoggedIn: (username: string) => void;
};

export function LogInDialog({ onClose, onLoggedIn }: LogInDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLogIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setMessage('Please write your username.');
      return;
    }
    if (isBannedName(cleanUsername)) {
      setMessage('This username is banned.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    const error = await logInWithUsername(cleanUsername, password);
    setIsSubmitting(false);
    if (error) {
      setMessage('Account not found or password is wrong.');
      return;
    }
    onLoggedIn(cleanUsername);
    window.setTimeout(onClose, 500);
  };

  return (
    <div className="auth-dialog-backdrop">
      <form className="auth-dialog" onSubmit={submitLogIn}>
        <div className="auth-dialog-header">
          <h2>Log In</h2>
          <button type="button" onClick={onClose} aria-label="Close log in form">×</button>
        </div>
        <label htmlFor="log-in-username">Existing username</label>
        <input id="log-in-username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <label htmlFor="log-in-password">Password</label>
        <input
          id="log-in-password"
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in' : 'Log In'}</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

async function logInWithUsername(username: string, password: string) {
  for (const email of makePossibleAccountEmails(username)) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) return null;
  }
  return new Error('Could not log in.');
}
