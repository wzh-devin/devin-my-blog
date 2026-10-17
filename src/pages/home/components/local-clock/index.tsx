import { useEffect, useState } from 'react';
import { profile } from '../../../../config/site.ts';

/** 时钟独立刷新，离开首页后停止计时，避免重绘整个页面。 */
export const LocalClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const label = new Intl.DateTimeFormat('en-US', {
    timeZone: profile.timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
  return (
    <time className="local-clock" aria-live="off" dateTime={now.toISOString()}>
      {label}
    </time>
  );
};
