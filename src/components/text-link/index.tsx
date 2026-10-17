import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { Icon } from '../icon/index.tsx';

export const TextLink = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link className="text-link" to={to}>
    {children}
    <Icon name="external" />
  </Link>
);
