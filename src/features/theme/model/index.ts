export const themeList = [
  { id: 'dawn', name: 'Dawn', color: '#64687f', dark: true },
  { id: 'sunrise', name: 'Sunrise', color: '#afb4c3', dark: false },
  { id: 'day', name: 'Day', color: '#fffdfa', dark: false },
  { id: 'sunset', name: 'Sunset', color: '#f3c692', dark: false },
  { id: 'dusk', name: 'Dusk', color: '#e2893f', dark: true },
  { id: 'night', name: 'Night', color: '#0f131c', dark: true },
] as const;
export type ThemeId = (typeof themeList)[number]['id'];

export const isTheme = (value: unknown): value is ThemeId =>
  themeList.some((theme) => theme.id === value);

/** 用同一个顺序驱动按钮与 T 快捷键，保证六个时段循环后回到起点。 */
export const nextTheme = (theme: ThemeId): ThemeId =>
  themeList[(themeList.findIndex((value) => value.id === theme) + 1) % themeList.length].id;

export type Theme = (typeof themeList)[number];
