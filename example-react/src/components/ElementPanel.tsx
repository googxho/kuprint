/**
 * ElementPanel.tsx — 左侧拖拽元素面板
 *
 * 渲染可拖拽的元素列表，kuprint 通过 PrintElementTypeManager.buildByHtml()
 * 绑定拖拽事件到 .ep-draggable-item 元素上。
 */

export function ElementPanel() {
  return (
    <div className="demo-layout-sider">
      <div className="demo-ep-container">
        <div className="demo-alert" style={{ margin: "0 0 10px", fontSize: 12 }}>
          <strong>拖拽列表</strong>
          <br />
          拖拽元素到设计面板
        </div>

        <ul className="demo-ep-list">
          {/* 常规 */}
          <li className="demo-ep-category">
            <span className="demo-ep-category-title">常规</span>
            <ul className="demo-ep-items">
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.text">
                  <span className="demo-ep-icon">📝</span>
                  <span>文本</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.image">
                  <span className="demo-ep-icon">🖼️</span>
                  <span>图片</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.longText">
                  <span className="demo-ep-icon">📄</span>
                  <span>长文</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.tableCustom">
                  <span className="demo-ep-icon">📊</span>
                  <span>表格</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.html">
                  <span className="demo-ep-icon">🔧</span>
                  <span>html</span>
                </a>
              </li>
            </ul>
          </li>

          {/* 辅助 */}
          <li className="demo-ep-category">
            <span className="demo-ep-category-title">辅助</span>
            <ul className="demo-ep-items">
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.hline">
                  <span className="demo-ep-icon">➖</span>
                  <span>横线</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.vline">
                  <span className="demo-ep-icon">➖</span>
                  <span>竖线</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.rect">
                  <span className="demo-ep-icon">⬜</span>
                  <span>矩形</span>
                </a>
              </li>
              <li className="demo-ep-item">
                <a className="ep-draggable-item demo-ep-link" tid="testModule.oval">
                  <span className="demo-ep-icon">⭕</span>
                  <span>椭圆</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
