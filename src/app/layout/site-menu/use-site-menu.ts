import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
  type SyntheticEvent,
} from 'react';
import { useReducedMotion } from '../../../hooks/use-reduced-motion.ts';

/** 原生 dialog 管理隔离与焦点，退出动画完成后关闭；切页立即收尾。 */
export const useSiteMenu = (routeKey: object) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openedRouteKey, setOpenedRouteKey] = useState<object | null>(null);
  const isOpen = openedRouteKey === routeKey;
  const reduceMotion = useReducedMotion();
  /** 切页与卸载共用收尾，避免残留模态隔离或滚动锁。 */
  const finishClose = useCallback(() => {
    const dialog = dialogRef.current;
    dialog?.classList.remove('is-closing');
    if (dialog?.open) dialog.close();
    document.body.classList.remove('menu-is-open');
  }, []);
  useLayoutEffect(() => {
    finishClose();
  }, [routeKey, finishClose]);
  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    if (isOpen) {
      dialog.classList.remove('is-closing');
      if (!dialog.open) dialog.showModal();
      document.body.classList.add('menu-is-open');
    } else if (dialog.open) {
      if (reduceMotion) finishClose();
      else dialog.classList.add('is-closing');
    }
  }, [isOpen, reduceMotion, finishClose]);
  useLayoutEffect(() => () => finishClose(), [finishClose]);
  const openMenu = useCallback(() => setOpenedRouteKey(routeKey), [routeKey]);
  const closeMenu = useCallback(() => setOpenedRouteKey(null), []);
  const toggleMenu = useCallback(
    () => setOpenedRouteKey(dialogRef.current?.open ? null : routeKey),
    [routeKey],
  );
  /** 接管原生取消，保留菜单的退出动画。 */
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    closeMenu();
  };
  /** 忽略子元素动画，防止提前解除模态隔离。 */
  const handleAnimationEnd = (event: AnimationEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current && event.animationName === 'menu-collapse')
      finishClose();
  };
  return {
    dialogRef,
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    handleCancel,
    handleAnimationEnd,
  };
};
