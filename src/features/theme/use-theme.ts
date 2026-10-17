import { useCallback, useLayoutEffect, useState } from 'react';
import { isTheme, nextTheme, themeList, type ThemeId } from './model/index.ts';

/** 单份主题状态同时驱动按钮、全局颜色与持久化。 */
export const useTheme = () => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const initial = document.documentElement.dataset.theme;
    return isTheme(initial) ? initial : 'day';
  });
  const theme = themeList.find((value) => value.id === themeId)!;
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme.id;
    document.documentElement.classList.toggle('dark', theme.dark);
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = theme.color;
    try {
      localStorage.setItem('blog-theme', theme.id);
    } catch {
      /* 禁用存储时仍保持当前会话可用。 */
    }
  }, [theme]);
  const cycleTheme = useCallback(() => setThemeId(nextTheme), []);
  return { theme, cycleTheme };
};
