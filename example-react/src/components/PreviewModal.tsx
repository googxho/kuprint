/**
 * PreviewModal.tsx — 打印预览弹窗（纯 CSS 实现）
 */

import { useDesignerStore } from "@/stores/designer";

interface KuprintApi {
  printPreviewHtml: () => void;
}

export function PreviewModal({ api }: { api: KuprintApi }) {
  const previewHtml = useDesignerStore((s) => s.previewHtml);
  const togglePreview = useDesignerStore((s) => s.togglePreview);

  function close() {
    togglePreview(false);
  }

  function handlePrint() {
    api.printPreviewHtml();
  }

  return (
    <div className="demo-modal-overlay" onClick={close}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
        <div className="demo-modal-header">
          <h4 className="demo-modal-title">打印预览</h4>
          <button className="demo-modal-close" onClick={close}>
            &times;
          </button>
        </div>
        <div className="demo-modal-body">
          <div className="demo-mb-10">
            <button className="demo-btn demo-btn-danger" onClick={handlePrint}>
              打印
            </button>
          </div>
          <div className="prevViewDiv" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
        <div className="demo-modal-footer">
          <button className="demo-btn" onClick={close}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
