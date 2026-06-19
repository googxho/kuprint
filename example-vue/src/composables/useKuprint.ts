// ============================================================
// useKuprint.ts — kuprint 生命周期封装
// 管理初始化、拖拽绑定、模板创建和清理
// ============================================================

import { onMounted, onUnmounted, type Ref } from "vue";
import { useDesignerStore } from "@/stores/designer";
import { customPrintJson } from "@/data/customPrintJson";
import { customElementTypeProvider } from "@/data/customEtypeProvider";
import { printData } from "@/data/printData";

declare const kuprint: {
  init(options?: { providers?: { addElementTypes: (context: unknown) => void }[] }): void;
  PrintTemplate: new (options: {
    template: unknown;
    settingContainer?: string | HTMLElement;
    paginationContainer?: string;
  }) => {
    design(container: string | HTMLElement): void;
    getHtml(data?: unknown): JQuery<HTMLElement>;
    getJson(): unknown;
    print(data?: unknown): void;
    printByHtml(container: JQuery<HTMLElement>): void;
    setPaper(typeOrWidth: string, height?: string): void;
    rotatePaper(): void;
    clear(): void;
  };
  PrintElementTypeGroup: new (name: string, elements: unknown[]) => unknown;
  PrintElementTypeManager: {
    buildByHtml(elements: JQuery<HTMLElement> | string): void;
  };
};

export function useKuprint(
  templateRef: Ref<HTMLElement | undefined>,
  optionsRef: Ref<HTMLElement | undefined>,
) {
  const store = useDesignerStore();
  let kuprintTemplate: InstanceType<typeof kuprint.PrintTemplate> | null = null;

  onMounted(() => {
    // 1. 初始化 kuprint，注册自定义元素类型
    kuprint.init({
      providers: [customElementTypeProvider() as any],
    });

    // 2. 构建左侧元素拖拽（需要传入 jQuery 对象）
    kuprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));

    // 3. 创建打印模板
    kuprintTemplate = new kuprint.PrintTemplate({
      template: customPrintJson,
      settingContainer: optionsRef.value,
      paginationContainer: ".kuprint-printPagination",
    });

    // 4. 渲染设计面板
    if (templateRef.value) {
      kuprintTemplate.design(templateRef.value);
    }
  });

  onUnmounted(() => {
    kuprintTemplate = null;
  });

  // ---- 公开操作方法 ----
  function setPaper(typeOrWidth: string, height?: string) {
    kuprintTemplate?.setPaper(typeOrWidth, height);
  }

  function rotatePaper() {
    kuprintTemplate?.rotatePaper();
  }

  function clearTemplate() {
    kuprintTemplate?.clear();
  }

  function print() {
    kuprintTemplate?.print(printData);
  }

  function getJson() {
    if (!kuprintTemplate) return;
    store.setJson(JSON.stringify(kuprintTemplate.getJson(), null, 2));
  }

  function getHtml() {
    if (!kuprintTemplate) return;
    const html = kuprintTemplate.getHtml(printData);
    store.setHtml(html?.[0]?.outerHTML ?? "");
  }

  function preview() {
    if (!kuprintTemplate) return;
    const html = kuprintTemplate.getHtml(printData);
    store.setPreview(html?.[0]?.outerHTML ?? "");
    store.togglePreview(true);
  }

  function printPreviewHtml() {
    if (!kuprintTemplate) return;
    const $body = $(store.previewHtml);
    kuprintTemplate.printByHtml($body);
  }

  return {
    setPaper,
    rotatePaper,
    clearTemplate,
    print,
    getJson,
    getHtml,
    preview,
    printPreviewHtml,
  };
}
