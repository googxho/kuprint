// ============================================================
// designer.ts — 设计器状态管理（Zustand）
// ============================================================

import { create } from "zustand";

interface DesignerState {
  jsonOutput: string;
  htmlOutput: string;
  previewHtml: string;
  showPreview: boolean;

  setJson: (val: string) => void;
  setHtml: (val: string) => void;
  setPreview: (val: string) => void;
  togglePreview: (show: boolean) => void;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  // ---- 状态 ----
  jsonOutput: "",
  htmlOutput: "",
  previewHtml: "",
  showPreview: false,

  // ---- 操作 ----
  setJson: (val) => set({ jsonOutput: val }),
  setHtml: (val) => set({ htmlOutput: val }),
  setPreview: (val) => set({ previewHtml: val }),
  togglePreview: (show) => set({ showPreview: show }),
}));
