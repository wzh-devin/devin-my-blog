import type { Theme } from '../../model/index.ts';
import { Icon } from '../../../../components/icon/index.tsx';

export const ThemeToggle = ({ theme, onCycle }: { theme: Theme; onCycle: () => void }) => (
  <button
    className="utility-button theme-button"
    type="button"
    data-action="theme"
    aria-label={`切换主题，当前 ${theme.name}`}
    title="切换光影主题"
    onClick={onCycle}
  >
    <span id="theme-icon">
      <Icon name={theme.dark ? 'moon' : 'sun'} />
    </span>
    <span id="theme-label">{theme.name}</span>
  </button>
);
