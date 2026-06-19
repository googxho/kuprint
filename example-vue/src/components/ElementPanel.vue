<script setup lang="ts">
 /**
 * ElementPanel.vue — 左侧拖拽元素面板
 *
 * 渲染可拖拽的元素列表，kuprint 通过 PrintElementTypeManager.buildByHtml()
 * 绑定拖拽事件到 .ep-draggable-item 元素上。
 */
</script>

<template>
  <div class="demo-layout-sider">
    <div class="demo-ep-container">
      <div class="demo-alert" style="margin: 0 0 10px; font-size: 12px">
        <strong>拖拽列表</strong><br />
        拖拽元素到设计面板
      </div>

      <ul class="demo-ep-list">
        <!-- 常规 -->
        <li class="demo-ep-category">
          <span class="demo-ep-category-title">常规</span>
          <ul class="demo-ep-items">
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.text">
                <span class="demo-ep-icon">📝</span>
                <span>文本</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.image">
                <span class="demo-ep-icon">🖼️</span>
                <span>图片</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.longText">
                <span class="demo-ep-icon">📄</span>
                <span>长文</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.tableCustom">
                <span class="demo-ep-icon">📊</span>
                <span>表格</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.html">
                <span class="demo-ep-icon">🔧</span>
                <span>html</span>
              </a>
            </li>
          </ul>
        </li>

        <!-- 辅助 -->
        <li class="demo-ep-category">
          <span class="demo-ep-category-title">辅助</span>
          <ul class="demo-ep-items">
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.hline">
                <span class="demo-ep-icon">➖</span>
                <span>横线</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.vline">
                <span class="demo-ep-icon">➖</span>
                <span>竖线</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.rect">
                <span class="demo-ep-icon">⬜</span>
                <span>矩形</span>
              </a>
            </li>
            <li class="demo-ep-item">
              <a class="ep-draggable-item demo-ep-link" tid="testModule.oval">
                <span class="demo-ep-icon">⭕</span>
                <span>椭圆</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
