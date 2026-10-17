import {
  LABEL_GAP,
  MAX_RADIUS,
  MIN_ANGLE_GAP,
  TICK_COUNT,
  TICK_LENGTH_MAJOR,
} from './constants.ts';
import { timelineEventList, type TimelineEvent } from './data.ts';

// 标签宽度同时用于排版和半径计算，避免嵌入后越过容器边缘。
export const getLabelWidth = (width: number) => (width >= 480 ? 96 : 48);

/** 根据局部容器与标签占位缩放来源圆环。
 * @param width 容器宽度。
 * @param height 容器高度。
 * @returns 不小于零的圆环半径。
 */
export const computeBaseRadius = (width: number, height: number) =>
  Math.max(
    0,
    Math.floor(
      Math.min(
        (width / 2 - getLabelWidth(width) - LABEL_GAP - 4) / (1 + TICK_LENGTH_MAJOR / MAX_RADIUS),
        (height / 2 - 44 - LABEL_GAP) / (1 + TICK_LENGTH_MAJOR / MAX_RADIUS),
        MAX_RADIUS,
      ),
    ),
  );

/** 来源坐标约定：零度在十二点方向，正角度顺时针。
 * @param angleDeg 角度。
 * @returns 单位圆方向向量。
 */
export const radialDirection = (angleDeg: number) => {
  const angle = ((angleDeg - 90) * Math.PI) / 180;
  return { x: Math.cos(angle), y: Math.sin(angle) };
};

/** 将来源的极坐标转换为容器内坐标。
 * @returns 刻度或标签的位置。
 */
export const pointOnCircle = (
  centerX: number,
  centerY: number,
  radius: number,
  angleDeg: number,
) => {
  const direction = radialDirection(angleDeg);
  return { x: centerX + radius * direction.x, y: centerY + radius * direction.y };
};

/** 保留来源按年份间隔分配角度的算法，同年或单节点时使用等距兜底。
 * @param eventList 时间轴事件。
 * @param minAngleGap 标签间最小夹角，窄容器增加间隔以免碰撞。
 * @returns 事件标识到角度的映射。
 */
export const computeEventAngleMap = (eventList: TimelineEvent[], minAngleGap = MIN_ANGLE_GAP) => {
  const sortedEventList = [...eventList].sort((a, b) => a.year - b.year);
  const count = sortedEventList.length;
  if (count <= 1) return new Map(sortedEventList.map((event) => [event.id, 0]));
  const yearGapList = sortedEventList
    .slice(1)
    .map((event, index) => event.year - sortedEventList[index].year);
  yearGapList.push(yearGapList.reduce((sum, gap) => sum + gap, 0) / yearGapList.length);
  const totalYearGap = yearGapList.reduce((sum, gap) => sum + gap, 0);
  const available = 360 - count * minAngleGap;
  let angle = 0;
  return new Map(
    sortedEventList.map((event, index) => {
      const entry: [string, number] = [event.id, angle];
      angle +=
        minAngleGap + (totalYearGap ? yearGapList[index] / totalYearGap : 1 / count) * available;
      return entry;
    }),
  );
};

/** 为宽、窄容器分别预计算来源刻度与标签共用的几何，动画时不重新分配。
 * @param minAngleGap 标签间最小夹角。
 * @returns 事件角度、刻度列表和标签角度查询。
 */
const createTimelineGeometry = (minAngleGap: number) => {
  const eventAngleMap = computeEventAngleMap(timelineEventList, minAngleGap);
  const tickSlotList = Array.from({ length: TICK_COUNT }, (_, index) => {
    const angle = (index / TICK_COUNT) * 360;
    const halfSlot = 360 / TICK_COUNT / 2 + 0.01;
    const event = timelineEventList.find((event) => {
      const eventAngle = eventAngleMap.get(event.id) ?? 0;
      return Math.abs(((angle - eventAngle + 540) % 360) - 180) < halfSlot;
    });
    return { angle, event: event ?? null };
  });
  const eventSlotAngleMap = new Map(
    tickSlotList.flatMap(({ angle, event }) => (event ? [[event.id, angle] as const] : [])),
  );

  // 标签与已吸附到实际刻度的事件线共用角度。
  const getEventAngle = (event: TimelineEvent) =>
    eventSlotAngleMap.get(event.id) ?? eventAngleMap.get(event.id) ?? 0;
  return { eventAngleMap, tickSlotList, getEventAngle };
};

export const timelineGeometry = createTimelineGeometry(MIN_ANGLE_GAP);
export const compactTimelineGeometry = createTimelineGeometry(25);
export const { eventAngleMap, tickSlotList, getEventAngle } = timelineGeometry;
