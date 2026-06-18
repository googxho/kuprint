// ============================================================
// options/manager.js — 配置项注册管理器
// ============================================================

import type { IOptionItem } from "./types.js";
import textOptions from "./text-options.js";
import tableOptions from "./table-options.js";
import borderLayoutOptions from "./border-layout-options.js";
import dataFormatOptions from "./data-format-options.js";
import paperOptions from "./paper-options.js";

// 从各分类文件收集的配置项实例
var _printElementOptionItems: IOptionItem[] = [].concat(
  textOptions as any,
  tableOptions as any,
  borderLayoutOptions as any,
  dataFormatOptions as any,
  paperOptions as any,
);

interface IManager {
  printElementOptionItems?: Record<string, IOptionItem>;
  init(): void;
  registerItem(item: IOptionItem): void;
  getItem(name: string): IOptionItem | undefined;
}

var PrintElementOptionItemManager: IManager = {
  init: function (this: IManager) {
    if (!this.printElementOptionItems) {
      this.printElementOptionItems = {};
      for (var i = 0; i < _printElementOptionItems.length; i++) {
        this.printElementOptionItems[_printElementOptionItems[i].name] =
          _printElementOptionItems[i];
      }
    }
  },
  registerItem: function (this: IManager, item: IOptionItem) {
    if (!item.name) throw new Error("styleItem must have name");
    this.init();
    this.printElementOptionItems![item.name] = item;
  },
  getItem: function (this: IManager, name: string) {
    this.init();
    return this.printElementOptionItems[name];
  },
};

export default PrintElementOptionItemManager;
