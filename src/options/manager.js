// ============================================================
// options/manager.js — 配置项注册管理器
// ============================================================

import textOptions from "./text-options.js";
import tableOptions from "./table-options.js";
import borderLayoutOptions from "./border-layout-options.js";
import dataFormatOptions from "./data-format-options.js";
import paperOptions from "./paper-options.js";

// 从各分类文件收集的配置项实例
var _printElementOptionItems = [].concat(
  textOptions,
  tableOptions,
  borderLayoutOptions,
  dataFormatOptions,
  paperOptions,
);

var PrintElementOptionItemManager = {
  init: function () {
    if (!this.printElementOptionItems) {
      this.printElementOptionItems = {};
      for (var i = 0; i < _printElementOptionItems.length; i++) {
        this.printElementOptionItems[_printElementOptionItems[i].name] =
          _printElementOptionItems[i];
      }
    }
  },
  registerItem: function (item) {
    if (!item.name) throw new Error("styleItem must have name");
    this.init();
    this.printElementOptionItems[item.name] = item;
  },
  getItem: function (name) {
    this.init();
    return this.printElementOptionItems[name];
  },
};

export default PrintElementOptionItemManager;
