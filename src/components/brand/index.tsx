import { Link } from 'react-router';
import { profile } from '../../config/site.ts';
import { ShortcutHint } from '../shortcut-hint/index.tsx';

export const Brand = () => (
  <span className="shortcut-anchor brand-anchor">
    <Link className="wordmark" to="/" aria-label={`${profile.siteName} 首页`}>
      {profile.siteName}
    </Link>
    <ShortcutHint side="right">H</ShortcutHint>
  </span>
);
