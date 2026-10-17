import { animate, useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/use-reduced-motion.ts';
import {
  ARC_RADIUS,
  DURATION,
  EASE,
  LABEL_GAP,
  MAX_RADIUS,
  TICK_LENGTH_MAJOR,
} from './constants.ts';
import type { RadialTimelineItem } from './model.ts';
import { computeBaseRadius, getSecondRotation } from './math.ts';
import { useElementSize } from './use-element-size.ts';

/** 管理来源的节点选择、弧形展开与返回动画。
 * @template T 由调用方提供的时间轴节点。
 * @returns 容器、动画值、选中事件与交互处理器。
 */
export const useRadialTimeline = <T extends RadialTimelineItem>() => {
  const { elementRef, width, height } = useElementSize();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wasRotationExpandedRef = useRef(false);
  const pausedRotationRef = useRef<number | null>(null);
  const wasExpandedRef = useRef(false);
  const [selected, setSelected] = useState<T | null>(null);
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const isExpanded = selected !== null;
  const isAutoPaused = isLabelHovered && !isExpanded;
  const isReducedMotion = useReducedMotion();
  const radiusMotionValue = useMotionValue(0);
  const centerYOffsetMotionValue = useMotionValue(0);
  const rotationMotionValue = useMotionValue(0);
  const baseRadius = computeBaseRadius(width, height);
  const arcTop =
    Math.round((TICK_LENGTH_MAJOR * baseRadius) / MAX_RADIUS) +
    LABEL_GAP +
    (width < 480 ? 44 : 56) +
    8;
  const duration = isReducedMotion ? 0 : DURATION;

  useEffect(() => {
    // 初次测量和普通缩放直接定位，只有来源的展开/收回播放动画。
    const geometryDuration = isExpanded || wasExpandedRef.current ? duration : 0;
    wasExpandedRef.current = isExpanded;
    const animationList = [
      animate(radiusMotionValue, isExpanded ? ARC_RADIUS : baseRadius, {
        duration: geometryDuration,
        ease: EASE,
        onComplete: () => {
          // 归位时节点可能暂时移出容器，收回后恢复因此丢失的焦点。
          if (!isExpanded && document.activeElement === document.body)
            triggerRef.current?.focus({ preventScroll: true });
        },
      }),
      animate(centerYOffsetMotionValue, isExpanded ? ARC_RADIUS - height / 2 + arcTop : 0, {
        duration: geometryDuration,
        ease: EASE,
      }),
    ];
    return () => animationList.forEach((animation) => animation.stop());
  }, [
    isExpanded,
    baseRadius,
    height,
    arcTop,
    duration,
    radiusMotionValue,
    centerYOffsetMotionValue,
  ]);

  useEffect(() => {
    if (isExpanded) backButtonRef.current?.focus({ preventScroll: true });
  }, [isExpanded]);

  useEffect(() => {
    const wasExpanded = wasRotationExpandedRef.current;
    wasRotationExpandedRef.current = isExpanded;
    if (isReducedMotion) {
      pausedRotationRef.current = null;
      rotationMotionValue.set(selected ? -selected.angle : 0);
      return;
    }
    if (isAutoPaused) {
      pausedRotationRef.current = rotationMotionValue.get();
      return;
    }
    const startTimestamp = Date.now();
    const startRotation = pausedRotationRef.current ?? getSecondRotation(startTimestamp);
    pausedRotationRef.current = null;
    let frameId = 0;
    const followSeconds = () => {
      rotationMotionValue.set(
        (startRotation + getSecondRotation(Date.now() - startTimestamp)) % 360,
      );
      frameId = requestAnimationFrame(followSeconds);
    };
    if (!selected && !wasExpanded) {
      followSeconds();
      return () => cancelAnimationFrame(frameId);
    }
    const rotation = rotationMotionValue.get();
    // 返回时对齐收回动画结束时的秒数，避免继续转动时跳变。
    const target = selected ? -selected.angle : getSecondRotation(Date.now() + duration * 1000);
    const delta = ((((target - rotation) % 360) + 540) % 360) - 180;
    const animation = animate(rotationMotionValue, rotation + delta, {
      duration: selected ? DURATION + 0.5 : duration,
      ease: EASE,
      onComplete: selected ? undefined : followSeconds,
    });
    return () => {
      animation.stop();
      cancelAnimationFrame(frameId);
    };
  }, [isExpanded, isAutoPaused, isReducedMotion, selected, duration, rotationMotionValue]);

  const handlePause = useCallback(() => setIsLabelHovered(true), []);
  const handleResume = useCallback(() => setIsLabelHovered(false), []);

  /** 暂停秒数转动并展开所选事件。
   * @param event 选中事件。
   * @param trigger 原节点按钮，用于返回后恢复焦点。
   */
  const handleSelect = useCallback((event: T, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelected(event);
  }, []);

  /** 收回弧形、恢复节点焦点，再跟随当前秒数转动。 */
  const handleBack = useCallback(() => {
    setSelected(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  return {
    elementRef,
    backButtonRef,
    width,
    height,
    baseRadius,
    arcTop,
    isReducedMotion,
    isExpanded,
    selected,
    handleSelect,
    handleBack,
    handlePause,
    handleResume,
    radiusMotionValue,
    centerYOffsetMotionValue,
    rotationMotionValue,
  };
};
