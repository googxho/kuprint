/**
 * App.tsx — 应用根组件
 *
 * 使用 React 19 + React Compiler 优化性能。
 * 状态管理使用 Zustand。
 */

import { ElementPanel } from "@/components/ElementPanel";
import { Toolbar } from "@/components/Toolbar";
import { DesignCanvas } from "@/components/DesignCanvas";
import { PropertyPanel } from "@/components/PropertyPanel";
import { PreviewModal } from "@/components/PreviewModal";
import { useKuprint } from "@/hooks/useKuprint";
import { useDesignerStore } from "@/stores/designer";

export default function App() {
  const kuprintApi = useKuprint();
  const showPreview = useDesignerStore((s) => s.showPreview);

  return (
    <div className="demo-layout">
      {/* 左侧：拖拽元素面板 */}
      <ElementPanel />

      {/* 中间：工具栏 + 设计面板 + 输出 */}
      <div className="demo-layout-content">
        <Toolbar api={kuprintApi} />

        <DesignCanvas>
          {/* kuprint 设计面板挂载到此容器 */}
          <div
            id="kuprint-printTemplate"
            ref={kuprintApi.templateRef}
            className="kuprint-printTemplate"
            style={{ marginTop: 15 }}
          />
        </DesignCanvas>
      </div>

      {/* 右侧：属性编辑面板 */}
      <PropertyPanel>
        {/* kuprint 属性编辑器挂载到此容器 */}
        <div id="PrintElementOptionSetting" ref={kuprintApi.optionsRef}>
          <p
            style={{
              color: "#999",
              fontSize: 13,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            点击设计面板中的元素
            <br />
            在此编辑属性
          </p>
        </div>
      </PropertyPanel>

      {/* 预览弹窗 */}
      {showPreview && <PreviewModal api={kuprintApi} />}
    </div>
  );
}
