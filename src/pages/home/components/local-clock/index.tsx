import { useEffect, useState } from 'react';

/** 时钟独立刷新，离开首页后停止计时，避免重绘整个页面。 */
export const LocalClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timeoutId = 0;
    // 按整秒边界更新，让数字时钟与圆环使用相同的真实秒数。
    const scheduleTick = () => {
      timeoutId = window.setTimeout(
        () => {
          setNow(new Date());
          scheduleTick();
        },
        1000 - (Date.now() % 1000),
      );
    };
    scheduleTick();
    return () => clearTimeout(timeoutId);
  }, []);
  const label = new Intl.DateTimeFormat('en-US', {
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
