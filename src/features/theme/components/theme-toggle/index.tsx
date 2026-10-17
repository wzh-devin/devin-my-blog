import type { Theme } from '../../model/index.ts';
import { Icon } from '../../../../components/icon/index.tsx';
import { ShortcutHint } from '../../../../components/shortcut-hint/index.tsx';

export const ThemeToggle = ({ theme, onCycle }: { theme: Theme; onCycle: () => void }) => (
  <span className="shortcut-anchor">
    <button
      className="utility-button theme-button"
      type="button"
      data-action="theme"
      aria-label={`切换主题，当前 ${theme.name}`}
      title="切换光影主题 (T)"
      onClick={onCycle}
    >
      <span id="theme-icon">
        <Icon name={theme.dark ? 'moon' : 'sun'} />
      </span>
      <span id="theme-label">{theme.name}</span>
    </button>
    <ShortcutHint>T</ShortcutHint>
  </span>
);
