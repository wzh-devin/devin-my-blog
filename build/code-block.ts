import hljs from 'highlight.js/lib/common';
import { renderMermaidSVG } from 'beautiful-mermaid';

/**
 * 在构建端准备高亮或图表，未知语言保留原始代码块。
 * @param source 围栏内的源代码。
 * @param language 围栏声明的语言。
 * @returns 渲染结果，未知语言返回 undefined。
 */
export const renderCodeBlock = (source: string, language?: string) => {
  const normalizedLanguage = language?.trim().toLowerCase();
  if (normalizedLanguage === 'mermaid') {
    try {
      const diagramSource = source
        .split('\n')
        .filter((line) => !line.trimStart().startsWith('%%'))
        .join('\n');
      const options = {
        bg: 'transparent',
        surface: 'transparent',
        font: 'Geist',
        transparent: true,
      };
      return {
        kind: 'diagram' as const,
        lightSvg: renderMermaidSVG(diagramSource, {
          ...options,
          fg: '#21201c',
          line: '#63635e',
          border: '#21201c40',
        }),
        darkSvg: renderMermaidSVG(diagramSource, {
          ...options,
          fg: '#eeeeec',
          line: '#c5c3be',
          border: '#eeeeec40',
        }),
      };
    } catch {
      return {
        kind: 'error' as const,
        message: '图表暂未能渲染，请检查 Mermaid 语法或使用已支持的图表类型。',
      };
    }
  }
  if (!normalizedLanguage || !hljs.getLanguage(normalizedLanguage)) return;
  try {
    return {
      kind: 'highlight' as const,
      html: hljs.highlight(source, { language: normalizedLanguage, ignoreIllegals: true }).value,
    };
  } catch {
    return;
  }
};
