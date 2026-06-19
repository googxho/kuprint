// ============================================================
// useKuprint.ts — kuprint 生命周期封装（React Hook）
// 管理初始化、拖拽绑定、模板创建和清理
// ============================================================

import { useEffect, useRef } from "react";
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

export function useKuprint() {
  const store = useDesignerStore();
  const kuprintTemplateRef = useRef<InstanceType<typeof kuprint.PrintTemplate> | null>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // 防止 StrictMode 下重复执行
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 1. 初始化 kuprint，注册自定义元素类型
    kuprint.init({
      providers: [customElementTypeProvider() as any],
    });

    // 2. 构建左侧元素拖拽（需要传入 jQuery 对象）
    kuprint.PrintElementTypeManager.buildByHtml($(".ep-draggable-item"));

    // 3. 创建打印模板
    const instance = new kuprint.PrintTemplate({
      template: customPrintJson,
      settingContainer: optionsRef.current ?? undefined,
      paginationContainer: ".kuprint-printPagination",
    });

    // 4. 渲染设计面板
    if (templateRef.current) {
      instance.design(templateRef.current);
    }

    kuprintTemplateRef.current = instance;

    // 注意：不要清理 kuprintTemplateRef.current，否则 StrictMode 下
    // 第二次 mount 会因 initializedRef 跳过初始化，ref 将永远为 null
    return () => {
      /* intentional no-op for StrictMode compatibility */
    };
  }, []);

  // ---- 公开操作方法 ----
  // 使用普通函数而非 useCallback，确保始终访问最新的 ref.current
  function setPaper(typeOrWidth: string, height?: string) {
    kuprintTemplateRef.current?.setPaper(typeOrWidth, height);
  }

  function rotatePaper() {
    kuprintTemplateRef.current?.rotatePaper();
  }

  function clearTemplate() {
    kuprintTemplateRef.current?.clear();
  }

  function print() {
    kuprintTemplateRef.current?.print(printData);
  }

  function getJson() {
    const tpl = kuprintTemplateRef.current;
    if (!tpl) return;
    store.setJson(JSON.stringify(tpl.getJson(), null, 2));
  }

  function getHtml() {
    const tpl = kuprintTemplateRef.current;
    if (!tpl) return;
    const html = tpl.getHtml(printData);
    store.setHtml(html?.[0]?.outerHTML ?? "");
  }

  function preview() {
    const tpl = kuprintTemplateRef.current;
    if (!tpl) return;
    const html = tpl.getHtml(printData);
    store.setPreview(html?.[0]?.outerHTML ?? "");
    store.togglePreview(true);
  }

  function printPreviewHtml() {
    const tpl = kuprintTemplateRef.current;
    if (!tpl) return;
    const $body = $(store.previewHtml);
    tpl.printByHtml($body);
  }

  return {
    templateRef,
    optionsRef,
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
