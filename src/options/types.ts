// ============================================================
// options/types.ts — 选项项共享类型
// ============================================================

/** 打印元素配置项的通用接口 */
export interface IOptionItem {
  name: string;
  target: JQuery;
  submit?: () => void;

  /** 将配置值应用到目标 DOM 元素，返回 CSS 字符串 */
  css?(target: JQuery, value: any): string | null;

  /** 创建设置面板 DOM，返回容器 */
  createTarget?(printElement?: any, options?: any, printElementType?: any): JQuery;

  /** 从设置面板读取值 */
  getValue?(): any;

  /** 将值写入设置面板 */
  setValue?(value: any, options?: any, printElementType?: any): void;

  /** 销毁设置面板 DOM */
  destroy?(): void;
}
