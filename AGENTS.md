# 项目规则

1. 如果没有明确要求，严禁开启使用多智能体。
2. 严禁主动提交 Git；用户审查并明确授权后才可提交。
3. 不得自行新增 Git 工作树。
4. 后续开发统一沿用当前 Tomasz Gil 参考风格，以 [DESIGN.md](DESIGN.md) 为视觉基准；新增页面和组件复用现有排版、主题、光影及交互。
5. 采用 React 组件化开发，先查找并复用已有实现；组件和页面按目录组织，通过各自 `index.tsx` 公开入口，业务模块通过 `index.ts` 导出。页面专用组件就近放置，跨页面组件归入公共或业务模块，避免重复实现。
6. 页面路由与站内跳转统一使用 React Router。
7. 代码格式统一使用 Prettier，静态检查统一使用 Oxlint，遵循根目录配置；交付前运行格式检查、静态检查、测试和构建。

## 代码风格

8. 函数优先使用 `const` 配合箭头函数。非平凡函数使用简短 JSDoc，说明作用及必要的参数、泛型和返回值；简单函数可只写一行注释。避免冗长说明或重复描述代码。使用标准标签 `@param`、`@template`、`@returns`。
9. 函数名与变量名应准确表达数据含义及返回值形态。例如返回或保存 `Set` 的名称使用 `xxxSet`，`Map` 使用 `xxxMap`，列表使用 `xxxList`；布尔值使用 `isXxx`、`hasXxx` 等语义明确的名称。
10. 组件及其导入引用、别名统一采用大驼峰（PascalCase），例如 `ArticleList`、`ThemeToggle`，符合 React JSX 的组件识别要求。
11. 新增动效优先复用现有组件、关键帧和时序，保持整体一致；未经用户明确要求，不替换、禁用或改变原有入场与返回动画。

```tsx
/**
 * 将列表转换为去重集合。
 * @template T 元素类型。
 * @param itemList 原始元素列表。
 * @returns 去重后的元素集合。
 */
const createItemSet = <T,>(itemList: readonly T[]): Set<T> => {
  return new Set(itemList);
};

// 判断集合是否为空。
const isSetEmpty = (itemSet: ReadonlySet<unknown>): boolean => itemSet.size === 0;
```
