/**
 * Toolbar.tsx — 纸张切换与操作工具栏
 */

interface KuprintApi {
  setPaper: (typeOrWidth: string, height?: string) => void;
  rotatePaper: () => void;
  clearTemplate: () => void;
  print: () => void;
  getJson: () => void;
  getHtml: () => void;
  preview: () => void;
}

const PAPER_SIZES = ["A3", "A4", "A5", "B3", "B4", "B5"];

export function Toolbar({ api }: { api: KuprintApi }) {
  function handleCustomPaper() {
    const w = (document.getElementById("customWidth") as HTMLInputElement)?.value;
    const h = (document.getElementById("customHeight") as HTMLInputElement)?.value;
    if (w && h) api.setPaper(w, h);
  }

  return (
    <div className="demo-toolbar">
      {/* 纸张尺寸 */}
      {PAPER_SIZES.map((size) => (
        <button key={size} className="demo-btn" onClick={() => api.setPaper(size)}>
          {size}
        </button>
      ))}

      {/* 自定义纸张 */}
      <input id="customWidth" className="demo-input" type="text" placeholder="宽/mm" />
      <span className="demo-label">×</span>
      <input id="customHeight" className="demo-input" type="text" placeholder="高/mm" />
      <button className="demo-btn" onClick={handleCustomPaper}>
        自定义
      </button>

      {/* 分隔 */}
      <span style={{ color: "#ddd", margin: "0 2px" }}>|</span>

      {/* 操作 */}
      <button className="demo-btn" onClick={api.rotatePaper}>
        旋转
      </button>
      <button className="demo-btn" onClick={api.clearTemplate}>
        清空
      </button>

      <span style={{ color: "#ddd", margin: "0 2px" }}>|</span>

      {/* 预览与打印 */}
      <button className="demo-btn demo-btn-danger" onClick={api.preview}>
        快速预览
      </button>
      <button className="demo-btn demo-btn-danger" onClick={api.print}>
        打印
      </button>

      <span style={{ color: "#ddd", margin: "0 2px" }}>|</span>

      {/* JSON / HTML */}
      <button className="demo-btn demo-btn-primary" onClick={api.getJson}>
        导出 JSON
      </button>
      <button className="demo-btn demo-btn-success" onClick={api.getHtml}>
        生成 HTML
      </button>
    </div>
  );
}
