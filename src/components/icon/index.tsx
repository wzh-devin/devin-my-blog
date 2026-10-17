import type { ReactNode } from 'react';

type IconName = 'sun' | 'moon' | 'menu' | 'close' | 'external' | 'back' | 'search';
const pathMap: Record<IconName, ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  moon: (
    <>
      <path d="M19.8 14.2A8 8 0 0 1 9.8 4.1a8 8 0 1 0 10 10.1Z" />
      <path d="M17 3v4m-2-2h4" />
    </>
  ),
  menu: (
    <>
      <path d="M5 7h14M5 12h14M5 17h14" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M6 18 18 6" />
    </>
  ),
  external: (
    <>
      <path d="M6 18 18 6M6 6h12v12" />
    </>
  ),
  back: (
    <>
      <path d="M20 12H4m6-6-6 6 6 6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
};

export const Icon = ({ name }: { name: IconName }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {pathMap[name]}
  </svg>
);
