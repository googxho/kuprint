<script setup lang="ts">
/**
 * DesignCanvas.vue — 中间设计面板 + JSON/HTML 输出
 *
 * 使用 slot 让父组件注入 kuprint 设计面板的 DOM 容器。
 */
import { useDesignerStore } from "@/stores/designer";

const store = useDesignerStore();
</script>

<template>
  <div class="demo-designer-area">
    <!-- 提示 -->
    <div class="demo-alert">
      <strong>kuprint Vue Demo</strong> — 从左侧拖拽元素到面板上，
      选中元素后在右侧属性面板编辑属性。<br />
      此 Demo 使用 <code>@kuki-lib/kuprint</code> 构建产物（ESM）。
    </div>

    <!-- slot：父组件注入 kuprint 设计面板容器 -->
    <slot></slot>

    <!-- JSON 输出 -->
    <div class="demo-output demo-mt-15">
      <div class="demo-output-group">
        <div class="demo-output-label">模板 JSON 数据</div>
        <textarea
          class="demo-textarea"
          :value="store.jsonOutput"
          rows="6"
          readonly
          placeholder="点击「导出 JSON」查看模板 JSON 数据"
        ></textarea>
      </div>

      <div class="demo-output-group">
        <div class="demo-output-label">打印 HTML</div>
        <textarea
          class="demo-textarea"
          :value="store.htmlOutput"
          rows="6"
          readonly
          placeholder="点击「生成 HTML」查看打印 HTML"
        ></textarea>
      </div>
    </div>
  </div>
</template>
