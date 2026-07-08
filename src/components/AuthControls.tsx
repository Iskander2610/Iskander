import { LogInDialog } from './LogInDialog';
import { ProfileMenu } from './ProfileMenu';
import { SignInDialog } from './SignInDialog';

type AuthControlsProps = {
  avatarUrl: string;
  isLogInOpen: boolean;
  isSignInOpen: boolean;
  onAvatarChange: (avatarUrl: string) => void;
  onCloseLogIn: () => void;
  onCloseSignIn: () => void;
  onLogIn: (username: string) => void;
  onLogOut: () => void;
  onOpenLogIn: () => void;
  onOpenSignIn: () => void;
  onProfileCreated: (username: string) => void;
  username: string;
};

export function AuthControls({
  avatarUrl,
  isLogInOpen,
  isSignInOpen,
  onAvatarChange,
  onCloseLogIn,
  onCloseSignIn,
  onLogIn,
  onLogOut,
  onOpenLogIn,
  onOpenSignIn,
  onProfileCreated,
  username,
}: AuthControlsProps) {
  return (
    <>
      <div className="auth-buttons">
        {username ? (
          <ProfileMenu avatarUrl={avatarUrl} username={username} onAvatarChange={onAvatarChange} onLogOut={onLogOut} />
        ) : (
          <>
            <button className="sign-in-button" type="button" onClick={onOpenSignIn}>Sign In</button>
            <button className="sign-in-button" type="button" onClick={onOpenLogIn}>Log In</button>
          </>
        )}
      </div>
      {isSignInOpen && (
        <SignInDialog onAccountCreated={onProfileCreated} onClose={onCloseSignIn} />
      )}
      {isLogInOpen && (
        <LogInDialog onClose={onCloseLogIn} onLoggedIn={onLogIn} />
      )}
    </>
  );
}
