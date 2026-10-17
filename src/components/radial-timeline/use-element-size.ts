import { useLayoutEffect, useRef, useState } from 'react';

/** 用容器尺寸替代来源的全局视口，离开页面后释放观察器。
 * @returns 容器引用与实际尺寸。
 */
export const useElementSize = () => {
  const elementRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { elementRef, ...size };
};
