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
import type { TimelineEvent } from './data.ts';
import { computeBaseRadius, compactTimelineGeometry, timelineGeometry } from './math.ts';
import { useElementSize } from './use-element-size.ts';

/** 管理来源的节点选择、弧形展开与返回动画。
 * @returns 容器、动画值、选中事件与交互处理器。
 */
export const useRadialTimeline = () => {
  const { elementRef, width, height } = useElementSize();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const rotationAnimationRef = useRef<{ stop: () => void } | null>(null);
  const wasExpandedRef = useRef(false);
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const isExpanded = selected !== null;
  const isReducedMotion = useReducedMotion();
  const radiusMotionValue = useMotionValue(0);
  const centerYOffsetMotionValue = useMotionValue(0);
  const rotationMotionValue = useMotionValue(0);
  const baseRadius = computeBaseRadius(width, height);
  const geometry = width < 480 ? compactTimelineGeometry : timelineGeometry;
  const arcTop =
    Math.round((TICK_LENGTH_MAJOR * baseRadius) / MAX_RADIUS) +
    LABEL_GAP +
    (width < 480 ? 44 : 56) +
    8;
  const duration = isReducedMotion ? 0 : DURATION;

  useEffect(() => () => rotationAnimationRef.current?.stop(), []);

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
    if (!isReducedMotion) return;
    rotationAnimationRef.current?.stop();
    if (selected) {
      const rotation = rotationMotionValue.get();
      const visual = (((geometry.getEventAngle(selected) + rotation) % 360) + 360) % 360;
      rotationMotionValue.set(rotation + (visual <= 180 ? -visual : 360 - visual));
    } else rotationMotionValue.set(0);
  }, [isReducedMotion, selected, geometry, rotationMotionValue]);

  /** 用来源的最短旋转路径，将选择的事件对齐十二点方向。
   * @param event 选中事件。
   * @param trigger 原节点按钮，用于返回后恢复焦点。
   */
  const handleSelect = useCallback(
    (event: TimelineEvent, trigger: HTMLButtonElement) => {
      rotationAnimationRef.current?.stop();
      const rotation = rotationMotionValue.get();
      const visual = (((geometry.getEventAngle(event) + rotation) % 360) + 360) % 360;
      triggerRef.current = trigger;
      setSelected(event);
      rotationAnimationRef.current = animate(
        rotationMotionValue,
        rotation + (visual <= 180 ? -visual : 360 - visual),
        {
          duration: isReducedMotion ? 0 : DURATION + 0.5,
          ease: EASE,
        },
      );
    },
    [rotationMotionValue, isReducedMotion, geometry],
  );

  /** 收回弧形并恢复初始朝向与节点焦点。 */
  const handleBack = useCallback(() => {
    rotationAnimationRef.current?.stop();
    rotationAnimationRef.current = animate(rotationMotionValue, 0, {
      duration,
      ease: EASE,
    });
    setSelected(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, [rotationMotionValue, duration]);

  return {
    elementRef,
    backButtonRef,
    width,
    height,
    baseRadius,
    arcTop,
    geometry,
    isReducedMotion,
    isExpanded,
    selected,
    handleSelect,
    handleBack,
    radiusMotionValue,
    centerYOffsetMotionValue,
    rotationMotionValue,
  };
};
