/// <reference types="vite/client" />

// 扩展 JSX 类型以支持 kuprint 的自定义 tid 属性
import "react";

declare module "react" {
  interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    tid?: string;
  }
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

// jQuery 全局声明（由 @types/jquery 提供，此处仅做引用确保被包含）
/// <reference types="jquery" />
