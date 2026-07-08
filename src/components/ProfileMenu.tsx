import { useRef, useState } from 'react';

type ProfileMenuProps = {
  avatarUrl: string;
  username: string;
  onAvatarChange: (avatarUrl: string) => void;
  onLogOut: () => void;
};

export function ProfileMenu({ avatarUrl, username, onAvatarChange, onLogOut }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const choosePicture = () => fileInput.current?.click();

  const updatePicture = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onAvatarChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-menu">
      <button className="sign-in-button" type="button" onClick={() => setIsOpen((open) => !open)}>
        <span className="profile-avatar" aria-hidden="true">
          {avatarUrl && <img src={avatarUrl} alt="" />}
        </span>
        <span>{username}</span>
      </button>
      {isOpen && (
        <div className="profile-popover">
          <p>My Profile</p>
          <button type="button" onClick={choosePicture}>Edit picture</button>
          <button type="button" onClick={onLogOut}>Log out</button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={(event) => updatePicture(event.target.files?.[0])}
          />
        </div>
      )}
    </div>
  );
}
