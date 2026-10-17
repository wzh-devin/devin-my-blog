import { Link } from 'react-router';
import { profile } from '../../config/site.ts';

export const Brand = () => (
  <Link className="wordmark" to="/" aria-label={`${profile.siteName} 首页`}>
    {profile.siteName}
  </Link>
);
