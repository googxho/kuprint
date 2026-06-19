/**
 * PropertyPanel.tsx — 右侧属性编辑面板
 *
 * kuprint 会在此容器中自动注入选中元素的属性编辑器。
 * 容器 DOM 由父组件通过 children 传入。
 */

export function PropertyPanel({ children }: { children: React.ReactNode }) {
  return <div className="demo-layout-property">{children}</div>;
}
