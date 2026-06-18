// ============================================================
// core/config.js — 全局配置（KuPrintConfig）
// ============================================================
// 【KuPrintConfig — 打印配置单例】
// 定义所有元素类型（text/image/longText/table/...）的默认值和
// 可配置项列表（supportOptions）。通过 KuPrintConfig.instance 访问。
// ============================================================

import PrintElementOptionItemManager from "../options/manager.js";

// ============================================================
// Module 1: KuPrintConfig - Configuration
// ============================================================
function KuPrintConfig() {
  this.providers = [];
  this.movingDistance = 1.5;
  this.paperHeightTrim = 1;
  this.text = {
    supportOptions: [
      { name: "title", hidden: false, title: "" },
      { name: "field", hidden: false },
      { name: "testData", hidden: false },
      { name: "dataType", hidden: false },
      { name: "fontFamily", hidden: false },
      { name: "fontSize", hidden: false },
      { name: "fontWeight", hidden: false },
      { name: "letterSpacing", hidden: false },
      { name: "color", hidden: false },
      { name: "textDecoration", hidden: false },
      { name: "textAlign", hidden: false },
      { name: "textContentVerticalAlign", hidden: false },
      { name: "lineHeight", hidden: false },
      { name: "textType", hidden: false },
      { name: "barcodeMode", hidden: false },
      { name: "hideTitle", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "unShowInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "transform", hidden: false },
      { name: "optionsGroup", hidden: false },
      { name: "borderLeft", hidden: false },
      { name: "borderTop", hidden: false },
      { name: "borderRight", hidden: false },
      { name: "borderBottom", hidden: false },
      { name: "borderWidth", hidden: false },
      { name: "borderColor", hidden: false },
      { name: "contentPaddingLeft", hidden: false },
      { name: "contentPaddingTop", hidden: false },
      { name: "contentPaddingRight", hidden: false },
      { name: "contentPaddingBottom", hidden: false },
      { name: "backgroundColor", hidden: false },
      { name: "formatter", hidden: false },
      { name: "styler", hidden: false },
    ],
    default: {
      fontFamily: undefined,
      fontSize: undefined,
      fontWeight: "",
      letterSpacing: undefined,
      textAlign: undefined,
      textType: "text",
      hideTitle: false,
      height: 9.75,
      lineHeight: undefined,
      width: 120,
    },
  };
  this.image = {
    supportOptions: [
      { name: "field", hidden: false },
      { name: "src", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "transform", hidden: false },
      { name: "formatter", hidden: false },
      { name: "styler", hidden: false },
    ],
    default: {},
  };
  this.longText = {
    supportOptions: [
      { name: "title", hidden: false },
      { name: "field", hidden: false },
      { name: "testData", hidden: false },
      { name: "fontFamily", hidden: false },
      { name: "fontSize", hidden: false },
      { name: "fontWeight", hidden: false },
      { name: "letterSpacing", hidden: false },
      { name: "textAlign", hidden: false },
      { name: "lineHeight", hidden: false },
      { name: "color", hidden: false },
      { name: "hideTitle", hidden: false },
      { name: "longTextIndent", hidden: false },
      { name: "leftSpaceRemoved", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "unShowInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "lHeight", hidden: false },
      { name: "transform", hidden: false },
      { name: "optionsGroup", hidden: false },
      { name: "borderLeft", hidden: false },
      { name: "borderTop", hidden: false },
      { name: "borderRight", hidden: false },
      { name: "borderBottom", hidden: false },
      { name: "borderWidth", hidden: false },
      { name: "borderColor", hidden: false },
      { name: "contentPaddingLeft", hidden: false },
      { name: "contentPaddingTop", hidden: false },
      { name: "contentPaddingRight", hidden: false },
      { name: "contentPaddingBottom", hidden: false },
      { name: "backgroundColor", hidden: false },
      { name: "formatter", hidden: false },
      { name: "styler", hidden: false },
    ],
    default: {
      fontFamily: undefined,
      fontSize: undefined,
      fontWeight: "",
      letterSpacing: undefined,
      textAlign: undefined,
      hideTitle: false,
      height: 42,
      lineHeight: undefined,
      width: 550,
    },
  };
  this.table = {
    supportOptions: [
      { name: "field", hidden: false },
      { name: "fontFamily", hidden: false },
      { name: "fontSize", hidden: false },
      { name: "lineHeight", hidden: false },
      { name: "textAlign", hidden: false },
      { name: "gridColumns", hidden: false },
      { name: "gridColumnsGutter", hidden: false },
      { name: "tableBorder", hidden: false },
      { name: "tableHeaderBorder", hidden: false },
      { name: "tableHeaderCellBorder", hidden: false },
      { name: "tableHeaderRowHeight", hidden: false },
      { name: "tableHeaderBackground", hidden: false },
      { name: "tableHeaderFontSize", hidden: false },
      { name: "tableHeaderFontWeight", hidden: false },
      { name: "tableBodyRowHeight", hidden: false },
      { name: "tableBodyRowBorder", hidden: false },
      { name: "tableBodyCellBorder", hidden: false },
      { name: "axis", hidden: false },
      { name: "lHeight", hidden: false },
      { name: "autoCompletion", hidden: false },
      { name: "columns", hidden: false },
      { name: "styler", hidden: false },
      { name: "rowStyler", hidden: false },
      { name: "tableFooterRepeat", hidden: false },
      { name: "footerFormatter", hidden: false },
      { name: "gridColumnsFooterFormatter", hidden: false },
    ],
    default: {
      fontFamily: undefined,
      fontSize: undefined,
      fontWeight: "",
      textAlign: undefined,
      tableBorder: undefined,
      tableHeaderBorder: undefined,
      tableHeaderCellBorder: undefined,
      tableHeaderBackground: undefined,
      tableHeaderRowHeight: undefined,
      tableHeaderFontWeight: undefined,
      tableBodyCellBorder: undefined,
      tableBodyRowHeight: undefined,
      letterSpacing: "",
      lineHeight: undefined,
      width: 550,
    },
  };
  this.tableCustom = {
    supportOptions: [
      { name: "field", hidden: false },
      { name: "fontFamily", hidden: false },
      { name: "fontSize", hidden: false },
      { name: "textAlign", hidden: false },
      { name: "tableBorder", hidden: false },
      { name: "tableHeaderBorder", hidden: false },
      { name: "tableHeaderCellBorder", hidden: false },
      { name: "tableHeaderRowHeight", hidden: false },
      { name: "tableHeaderFontSize", hidden: false },
      { name: "tableHeaderFontWeight", hidden: false },
      { name: "tableHeaderBackground", hidden: false },
      { name: "tableBodyRowHeight", hidden: false },
      { name: "tableBodyRowBorder", hidden: false },
      { name: "tableBodyCellBorder", hidden: false },
      { name: "axis", hidden: false },
      { name: "lHeight", hidden: false },
      { name: "autoCompletion", hidden: false },
      { name: "tableFooterRepeat", hidden: false },
    ],
    default: {
      fontFamily: undefined,
      fontSize: undefined,
      fontWeight: "",
      textAlign: undefined,
      tableBorder: undefined,
      tableHeaderBorder: undefined,
      tableHeaderCellBorder: undefined,
      tableHeaderBackground: undefined,
      tableHeaderRowHeight: undefined,
      tableHeaderFontWeight: undefined,
      tableBodyCellBorder: undefined,
      tableBodyRowHeight: undefined,
      letterSpacing: "",
      lineHeight: undefined,
      width: 550,
    },
  };
  this.hline = {
    supportOptions: [
      { name: "borderColor", hidden: false },
      { name: "borderWidth", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "transform", hidden: false },
      { name: "borderStyle", hidden: false },
    ],
    default: { borderWidth: 0.75, height: 9, width: 90 },
  };
  this.vline = {
    supportOptions: [
      { name: "borderColor", hidden: false },
      { name: "borderWidth", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "transform", hidden: false },
      { name: "borderStyle", hidden: false },
    ],
    default: { borderWidth: undefined, height: 90, width: 9 },
  };
  this.rect = {
    supportOptions: [
      { name: "borderColor", hidden: false },
      { name: "borderWidth", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "transform", hidden: false },
      { name: "borderStyle", hidden: false },
    ],
    default: { borderWidth: undefined, height: 90, width: 90 },
  };
  this.oval = {
    supportOptions: [
      { name: "borderColor", hidden: false },
      { name: "borderWidth", hidden: false },
      { name: "showInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "transform", hidden: false },
      { name: "borderStyle", hidden: false },
    ],
    default: { borderWidth: undefined, height: 90, width: 90 },
  };
  this.html = {
    supportOptions: [
      { name: "showInPage", hidden: false },
      { name: "unShowInPage", hidden: false },
      { name: "fixed", hidden: false },
      { name: "axis", hidden: false },
      { name: "formatter", hidden: false },
    ],
    default: { height: 90, width: 90 },
  };
  this.tableColumn = {
    supportOptions: [
      { name: "title", hidden: false },
      { name: "align", hidden: false },
      { name: "halign", hidden: false },
      { name: "vAlign", hidden: false },
      { name: "paddingLeft", hidden: false },
      { name: "paddingRight", hidden: false },
      { name: "formatter2", hidden: false },
      { name: "styler2", hidden: false },
    ],
    default: { height: 90, width: 90 },
  };
}

KuPrintConfig.prototype.init = function (cfg) {
  if (cfg) $.extend(this, cfg);
};

Object.defineProperty(KuPrintConfig, "instance", {
  get: function () {
    if (!KuPrintConfig._instance) {
      KuPrintConfig._instance = new KuPrintConfig();
      if (window.KUPRINT_CONFIG) $.extend(KuPrintConfig._instance, KUPRINT_CONFIG);
      if (KuPrintConfig._instance.optionItems) {
        KuPrintConfig._instance.optionItems.forEach(function (item) {
          PrintElementOptionItemManager.registerItem(item);
        });
      }
    }
    return KuPrintConfig._instance;
  },
  enumerable: true,
  configurable: true,
});

export { KuPrintConfig };

// ============================================================
// Module 2: KuPrintlib - Core library
// ============================================================
