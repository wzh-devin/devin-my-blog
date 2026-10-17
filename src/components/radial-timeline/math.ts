import { LABEL_GAP, MAX_RADIUS, TICK_COUNT, TICK_LENGTH_MAJOR } from './constants.ts';

// 标签宽度同时用于排版和半径计算，避免嵌入后越过容器边缘。
export const getLabelWidth = (width: number) => (width >= 480 ? 96 : 56);

/** 将当前分钟内的秒数映射为顺时针角度，含毫秒以保持匀速。
 * @param timestamp 当前时间的毫秒时间戳。
 * @returns 零到三百六十度之间的角度。
 */
export const getSecondRotation = (timestamp: number) => ((timestamp % 60_000) / 60_000) * 360;

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

// 来源的 120 个细刻度保持固定，节点角度对齐到实际刻度。
export const tickSlotList = Array.from({ length: TICK_COUNT }, (_, index) => ({
  angle: (index / TICK_COUNT) * 360,
}));
