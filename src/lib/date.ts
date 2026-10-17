import { profile } from '../config/site.ts';

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: profile.timeZone,
  }).format(new Date(`${date}T00:00:00+08:00`));
