import { ProfileMenu } from './ProfileMenu';
import { SignInDialog } from './SignInDialog';

type AuthControlsProps = {
  avatarUrl: string;
  isSignInOpen: boolean;
  onAvatarChange: (avatarUrl: string) => void;
  onCloseSignIn: () => void;
  onOpenSignIn: () => void;
  onProfileCreated: (username: string) => void;
  username: string;
};

export function AuthControls({
  avatarUrl,
  isSignInOpen,
  onAvatarChange,
  onCloseSignIn,
  onOpenSignIn,
  onProfileCreated,
  username,
}: AuthControlsProps) {
  return (
    <>
      <div className="auth-buttons">
        {username ? (
          <ProfileMenu avatarUrl={avatarUrl} username={username} onAvatarChange={onAvatarChange} />
        ) : (
          <button className="sign-in-button" type="button" onClick={onOpenSignIn}>Sign In</button>
        )}
        <button className="sign-in-button" type="button">Log In</button>
      </div>
      {isSignInOpen && (
        <SignInDialog onAccountCreated={onProfileCreated} onClose={onCloseSignIn} />
      )}
    </>
  );
}
