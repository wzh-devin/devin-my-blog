import { AnimatePresence, motion, useTransform, type MotionValue } from 'framer-motion';
import { useId, useMemo, type ReactNode } from 'react';
import { Icon } from '../icon/index.tsx';
import {
  DURATION,
  LABEL_GAP,
  MAX_RADIUS,
  TICK_LENGTH_MAJOR,
  TICK_LENGTH_MINOR,
} from './constants.ts';
import type { RadialTimelineItem } from './model.ts';
import { getLabelWidth, pointOnCircle, radialDirection, tickSlotList } from './math.ts';
import { useRadialTimeline } from './use-radial-timeline.ts';

export type { RadialTimelineItem } from './model.ts';

interface AnimationMotionValues {
  radiusMotionValue: MotionValue<number>;
  centerYOffsetMotionValue: MotionValue<number>;
  rotationMotionValue: MotionValue<number>;
  viewportCenterX: number;
  viewportCenterY: number;
}

interface TickLineProps extends AnimationMotionValues {
  slotAngle: number;
  tickLength: number;
  isHighlighted: boolean;
}

/** 保留来源逐帧极坐标计算，让圆环展开为弧形时刻度保持径向。 */
const TickLine = ({
  slotAngle,
  tickLength,
  isHighlighted,
  radiusMotionValue,
  centerYOffsetMotionValue,
  rotationMotionValue,
  viewportCenterX,
  viewportCenterY,
}: TickLineProps) => {
  const coordinates = useTransform(
    [radiusMotionValue, centerYOffsetMotionValue, rotationMotionValue] as const,
    ([radius, offset, rotation]) => {
      const angle = slotAngle + (rotation as number);
      const inner = pointOnCircle(
        viewportCenterX,
        viewportCenterY + (offset as number),
        radius as number,
        angle,
      );
      const direction = radialDirection(angle);
      return {
        x1: inner.x,
        y1: inner.y,
        x2: inner.x + direction.x * tickLength,
        y2: inner.y + direction.y * tickLength,
      };
    },
  );
  const x1 = useTransform(coordinates, (value) => value.x1);
  const y1 = useTransform(coordinates, (value) => value.y1);
  const x2 = useTransform(coordinates, (value) => value.x2);
  const y2 = useTransform(coordinates, (value) => value.y2);
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      strokeWidth={isHighlighted ? 1.25 : 1}
      opacity={isHighlighted ? 1 : 0.2}
      className="radial-tick"
    />
  );
};

interface EventLabelProps<T extends RadialTimelineItem> extends AnimationMotionValues {
  event: T;
  baseAngle: number;
  scaledTickMajor: number;
  isSelected: boolean;
  detailId: string;
  onSelect: (event: T, trigger: HTMLButtonElement) => void;
  onPause: () => void;
  onResume: () => void;
}

/** 沿用来源的径向锚点，旋转时标签保持正向且贴合事件长刻度。 */
const EventLabel = <T extends RadialTimelineItem>({
  event,
  baseAngle,
  scaledTickMajor,
  isSelected,
  detailId,
  onSelect,
  onPause,
  onResume,
  radiusMotionValue,
  centerYOffsetMotionValue,
  rotationMotionValue,
  viewportCenterX,
  viewportCenterY,
}: EventLabelProps<T>) => {
  const position = useTransform(
    [radiusMotionValue, centerYOffsetMotionValue, rotationMotionValue] as const,
    ([radius, offset, rotation]) => {
      const angle = baseAngle + (rotation as number);
      const point = pointOnCircle(
        viewportCenterX,
        viewportCenterY + (offset as number),
        (radius as number) + scaledTickMajor + LABEL_GAP,
        angle,
      );
      const direction = radialDirection(angle);
      return {
        left: point.x,
        top: point.y,
        transform: `translate(${-50 + 50 * direction.x}%, ${-50 + 50 * direction.y}%)`,
      };
    },
  );
  const left = useTransform(position, (value) => value.left);
  const top = useTransform(position, (value) => value.top);
  const transform = useTransform(position, (value) => value.transform);
  const visibility = useTransform(position, (value) =>
    value.left >= 0 &&
    value.left <= viewportCenterX * 2 &&
    value.top >= 0 &&
    value.top <= viewportCenterY * 2
      ? 'visible'
      : 'hidden',
  );
  return (
    <motion.button
      type="button"
      className="radial-event"
      data-event-id={event.id}
      aria-label={`${event.title}，${event.subtitle}`}
      aria-pressed={isSelected}
      aria-controls={isSelected ? detailId : undefined}
      onClick={(eventClick) => onSelect(event, eventClick.currentTarget)}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') onPause();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') onResume();
      }}
      style={{
        left,
        top,
        transform,
        visibility,
        maxWidth: getLabelWidth(viewportCenterX * 2),
        fontSize: viewportCenterX * 2 >= 480 ? 12 : 10,
      }}
    >
      <span>{event.title}</span>
      <span className="radial-event-subtitle">{event.subtitle}</span>
    </motion.button>
  );
};

interface RadialTimelineProps<T extends RadialTimelineItem> {
  itemList: T[];
  children: ReactNode;
  renderDetails: (item: T) => ReactNode;
}

/** 复用来源的圆环与展开动画，由调用方提供节点和详情。
 * @template T 时间轴节点及其详情数据。
 */
export const RadialTimeline = <T extends RadialTimelineItem>({
  itemList,
  children,
  renderDetails,
}: RadialTimelineProps<T>) => {
  const {
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
  } = useRadialTimeline<T>();
  const detailId = useId();
  const itemAngleSet = useMemo(() => new Set(itemList.map((item) => item.angle)), [itemList]);
  const radiusScale = baseRadius / MAX_RADIUS;
  const scaledTickMajor = Math.round(TICK_LENGTH_MAJOR * radiusScale);
  const scaledTickMinor = Math.round(TICK_LENGTH_MINOR * radiusScale);
  const animationMotionValues: AnimationMotionValues = {
    radiusMotionValue,
    centerYOffsetMotionValue,
    rotationMotionValue,
    viewportCenterX: width / 2,
    viewportCenterY: height / 2,
  };
  return (
    <section
      ref={elementRef}
      className="radial-timeline"
      aria-label="精选文章时间索引"
      data-expanded={isExpanded}
    >
      <svg className="radial-ticks" aria-hidden="true">
        {tickSlotList.map(({ angle }) => (
          <TickLine
            key={angle}
            slotAngle={angle}
            tickLength={itemAngleSet.has(angle) ? scaledTickMajor : scaledTickMinor}
            isHighlighted={itemAngleSet.has(angle)}
            {...animationMotionValues}
          />
        ))}
      </svg>
      <div className="radial-labels">
        {itemList.map((event) => (
          <EventLabel
            key={event.id}
            event={event}
            baseAngle={event.angle}
            scaledTickMajor={scaledTickMajor}
            isSelected={selected?.id === event.id}
            detailId={`${detailId}-${event.id}`}
            onSelect={handleSelect}
            onPause={handlePause}
            onResume={handleResume}
            {...animationMotionValues}
          />
        ))}
      </div>
      {children && (
        <div
          className="radial-center"
          hidden={isExpanded || baseRadius === 0}
          style={{ width: baseRadius * 1.7 }}
        >
          {children}
        </div>
      )}
      <AnimatePresence>
        {selected && (
          <motion.section
            key={selected.id}
            id={`${detailId}-${selected.id}`}
            className="radial-details"
            aria-label={selected.detailTitle}
            initial={isReducedMotion ? false : { opacity: 0, filter: 'blur(20px)' }}
            animate={{
              opacity: 1,
              filter: 'blur(0px)',
              transition: { delay: isReducedMotion ? 0 : DURATION },
            }}
            exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: isReducedMotion ? 0 : 0.5 }}
            style={{
              top: arcTop + scaledTickMajor,
              left: 16,
              width: Math.max(0, width - 32),
              maxHeight: Math.max(0, height - arcTop - scaledTickMajor - 16),
            }}
          >
            <div className="radial-details-header">
              <h2>{selected.detailTitle}</h2>
              <button
                ref={backButtonRef}
                type="button"
                className="radial-back utility-button"
                onClick={handleBack}
                aria-label="返回时间轴"
              >
                <Icon name="back" />
                <span>返回</span>
              </button>
            </div>
            {renderDetails(selected)}
          </motion.section>
        )}
      </AnimatePresence>
    </section>
  );
};
