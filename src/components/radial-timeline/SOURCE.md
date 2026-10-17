# 来源与接入范围

由用户提供的 `radial-timeline` 项目迁移，源目录日期为 2026-10-18。原项目依赖 React、Tailwind CSS 和 Framer Motion；参考效果为 [Devouring Details — Radial Timeline](https://devouringdetails.com/)。此记录不额外声明来源项目的作者或许可证。

保留来源的 `RadialTimeline.tsx` 中 TickLine、EventLabel、MotionValue 坐标计算、节点展开大弧形/正文；保留 14 条事件、120 个刻度、年份间隔算法、动画曲线与展开时长。`data.ts` 仅做命名和格式适配。按用户后续要求，已删除滚动旋转、循环与吸附；返回时同时恢复初始朝向和圆环大小。

全屏布局改为可测量的局部容器，不锁定 body；不再包含滚动监听、隐藏滚动层、循环计时器或滚动吸附常量。测量与展开动画生命周期拆至同目录 Hook，补充卸载清理、减少动态与返回焦点。半径预留标签宽度，长正文局部滚动，颜色继承博客主题。宽容器保留来源的 15° 最小事件间距；窄于 480px 时同一算法采用 25° 最小间距，避免标签拥挤。原目录未修改。
