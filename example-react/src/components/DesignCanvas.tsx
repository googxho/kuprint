/**
 * DesignCanvas.tsx — 中间设计面板 + JSON/HTML 输出
 *
 * 使用 children 让父组件注入 kuprint 设计面板的 DOM 容器。
 */

import { useDesignerStore } from "@/stores/designer";

export function DesignCanvas({ children }: { children: React.ReactNode }) {
  const jsonOutput = useDesignerStore((s) => s.jsonOutput);
  const htmlOutput = useDesignerStore((s) => s.htmlOutput);

  return (
    <div className="demo-designer-area">
      {/* 提示 */}
      <div className="demo-alert">
        <strong>kuprint React Demo</strong> — 从左侧拖拽元素到面板上，
        选中元素后在右侧属性面板编辑属性。
        <br />
        此 Demo 使用 <code>@kuki-lib/kuprint</code> 构建产物（ESM） 以及{" "}
        <strong>React 19 + React Compiler + Zustand</strong>。
      </div>

      {/* children：父组件注入 kuprint 设计面板容器 */}
      {children}

      {/* JSON 输出 */}
      <div className="demo-output demo-mt-15">
        <div className="demo-output-group">
          <div className="demo-output-label">模板 JSON 数据</div>
          <textarea
            className="demo-textarea"
            value={jsonOutput}
            rows={6}
            readOnly
            placeholder="点击「导出 JSON」查看模板 JSON 数据"
          />
        </div>

        <div className="demo-output-group">
          <div className="demo-output-label">打印 HTML</div>
          <textarea
            className="demo-textarea"
            value={htmlOutput}
            rows={6}
            readOnly
            placeholder="点击「生成 HTML」查看打印 HTML"
          />
        </div>
      </div>
    </div>
  );
}
