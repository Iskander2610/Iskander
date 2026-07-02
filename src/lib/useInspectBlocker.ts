import { useEffect } from 'react';

export function useInspectBlocker() {
  useEffect(() => {
    const blockContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const blockInspectShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isInspectShortcut =
        event.key === 'F12' ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && ['u', 's'].includes(key));

      if (isInspectShortcut) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('contextmenu', blockContextMenu);
    window.addEventListener('keydown', blockInspectShortcuts, true);

    return () => {
      window.removeEventListener('contextmenu', blockContextMenu);
      window.removeEventListener('keydown', blockInspectShortcuts, true);
    };
  }, []);
}
