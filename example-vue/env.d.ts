/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// kuprint CSS 子路径类型声明（side-effect import）
declare module "@kuki-lib/kuprint/css" {}
declare module "@kuki-lib/kuprint/css/print" {}

// kuprint 全局命名空间
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

// jQuery 全局声明
declare const $: JQueryStatic;
declare const jQuery: JQueryStatic;
