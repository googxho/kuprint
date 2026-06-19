// ============================================================
// designer.ts — 设计器状态管理（Pinia 3 Composition API）
// ============================================================

import { defineStore } from "pinia";
import { ref } from "vue";

export const useDesignerStore = defineStore("designer", () => {
  // ---- 状态 ----
  const jsonOutput = ref("");
  const htmlOutput = ref("");
  const previewHtml = ref("");
  const showPreview = ref(false);

  // ---- 操作 ----
  function setJson(val: string) {
    jsonOutput.value = val;
  }

  function setHtml(val: string) {
    htmlOutput.value = val;
  }

  function setPreview(val: string) {
    previewHtml.value = val;
  }

  function togglePreview(show: boolean) {
    showPreview.value = show;
  }

  return {
    jsonOutput,
    htmlOutput,
    previewHtml,
    showPreview,
    setJson,
    setHtml,
    setPreview,
    togglePreview,
  };
});
