<script setup lang="ts">
/**
 * PreviewModal.vue — 打印预览弹窗（纯 CSS 实现）
 */
import { useDesignerStore } from "@/stores/designer";
import { inject } from "vue";

const store = useDesignerStore();
const { printPreviewHtml } = inject("kuprint") as any;

function close() {
  store.togglePreview(false);
}

function handlePrint() {
  printPreviewHtml();
}
</script>

<template>
  <div class="demo-modal-overlay" @click.self="close">
    <div class="demo-modal">
      <div class="demo-modal-header">
        <h4 class="demo-modal-title">打印预览</h4>
        <button class="demo-modal-close" @click="close">&times;</button>
      </div>
      <div class="demo-modal-body">
        <div class="demo-mb-10">
          <button class="demo-btn demo-btn-danger" @click="handlePrint">打印</button>
        </div>
        <div class="prevViewDiv" v-html="store.previewHtml"></div>
      </div>
      <div class="demo-modal-footer">
        <button class="demo-btn" @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>
