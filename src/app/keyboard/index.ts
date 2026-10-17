import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { navigationList } from '../../config/navigation.ts';

type KeyboardActions = {
  toggleMenu: () => void;
  closeMenu: () => void;
  cycleTheme: () => void;
  toggleShortcuts: () => void;
};

/** 输入和组合键保持原生行为；全局键盘操作复用按钮对应的动作。 */
export const useKeyboardShortcuts = ({
  toggleMenu,
  closeMenu,
  cycleTheme,
  toggleShortcuts,
}: KeyboardActions) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.isComposing)
        return;
      if (event.key === 'Escape') {
        closeMenu();
        return;
      }
      if (
        event.target instanceof HTMLElement &&
        (event.target.matches('input, textarea, select') || event.target.isContentEditable)
      )
        return;
      const key = event.key.toLowerCase();
      const navigation = navigationList.find((entry) => entry.key.toLowerCase() === key);
      if (navigation || ['m', 't', 'c', '/'].includes(key)) event.preventDefault();
      if (navigation) navigate(navigation.href);
      if (key === 'm') toggleMenu();
      if (key === 't') cycleTheme();
      if (key === 'c') toggleShortcuts();
      if (key === '/') {
        if (location.pathname === '/archive')
          document.querySelector<HTMLInputElement>('#article-search')?.focus();
        else void navigate('/archive', { state: { focusSearch: true } });
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [navigate, location.pathname, toggleMenu, closeMenu, cycleTheme, toggleShortcuts]);
};
