import { Brand } from '../../../components/brand/index.tsx';
import { Icon } from '../../../components/icon/index.tsx';
import { ThemeToggle, type Theme } from '../../../features/theme/index.ts';

type SiteHeaderProps = {
  theme: Theme;
  onCycleTheme: () => void;
  menuOpen: boolean;
  onMenuOpen: () => void;
};
export const SiteHeader = ({ theme, onCycleTheme, menuOpen, onMenuOpen }: SiteHeaderProps) => (
  <header className="site-header flex items-center justify-between">
    <Brand />
    <div className="header-controls flex items-center">
      <ThemeToggle theme={theme} onCycle={onCycleTheme} />
      <button
        className="utility-button menu-trigger"
        type="button"
        data-action="menu-open"
        aria-haspopup="dialog"
        aria-controls="site-menu"
        aria-expanded={menuOpen}
        onClick={onMenuOpen}
      >
        <Icon name="menu" />
        <span>Menu</span>
      </button>
    </div>
  </header>
);
