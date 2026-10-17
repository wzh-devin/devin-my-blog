import { useSyncExternalStore } from 'react';

/** 固定订阅入口，避免组件重绘时反复注册媒体监听。 */
const subscribe = (onChange: () => void) => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getSnapshot = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 菜单与光影共享系统动态偏好，并在卸载时释放媒体监听。 */
export const useReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot, () => false);
