// ============================================================
// elements/text.js — 文本/条形码/二维码元素
// TextPrintElement 继承 BasePrintElement
// ============================================================

import { __extends, hinnn, TextHelper } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { TextPrintElementOption } from "./text-option.js";

const _BasePE = BasePrintElement as any;
const KCFG = KuPrintConfig as any;

// ============================================================
// Types
// ============================================================
interface TTextPrintElement {
  printElementType: { title?: string; getText(forProxy?: boolean): string; getData(): any };
  options: {
    title?: string;
    field?: string;
    testData?: string;
    format?: string;
    dataType?: string;
    color?: string;
    hideTitle?: boolean;
    textType?: string;
    barcodeMode?: string;
    getHideTitle(): boolean;
    getTextType(): string;
    getFontSize(): number;
    getBarcodeMode(): string;
    getHeight(): number;
    getWidth(): number;
    [key: string]: any;
  };
  id: string;
  templateId: string;
  designTarget: JQuery | undefined;
  designPaper: any;
  _currenttemplateData: any;

  getField(): string | undefined;
  getTitle(): string;
  getData(data?: Record<string, any>): any;
  getFormatter(): ((...args: any[]) => any) | undefined;
  getConfigOptions(): any;
  getHtml(paper: any, data?: Record<string, any>, n?: number): any[];
  getHtml2(paper: any, data?: Record<string, any>, n?: number): any[];
  createTarget(title: string, data: any, n?: number): JQuery;
  updateTargetText($el: JQuery, title: string, data: any, n?: number): void;
  updateTargetSize($el: JQuery): void;
  css($el: JQuery, data?: any): void;
  SetProxyTargetOption(override: any): void;
  updateDesignViewFromOptions(): void;
}

// ============================================================
// Concrete Print Element classes
// ============================================================

// --- TextPrintElement ---
function TextPrintElement(this: TTextPrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (TextPrintElementOption as any)(opts);
  self.options.setDefault(
    new (TextPrintElementOption as any)(KCFG.instance.text.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(TextPrintElement, BasePrintElement);
TextPrintElement.prototype.getDesignTarget = function (this: TTextPrintElement, paper: any) {
  return BasePrintElement.prototype.getDesignTarget.call(this, paper);
};
TextPrintElement.prototype.getProxyTarget = function (this: TTextPrintElement, override?: any) {
  if (override) this.SetProxyTargetOption(override);
  var data = this.getData();
  var target = this.createTarget(this.printElementType.getText(true), data);
  this.updateTargetSize(target);
  this.css(target, data);
  return target;
};
TextPrintElement.prototype.updateDesignViewFromOptions = function (this: TTextPrintElement) {
  if (this.designTarget) {
    var data = this.getData();
    this.css(this.designTarget, data);
    this.updateTargetText(this.designTarget, this.getTitle(), data);
  }
};
TextPrintElement.prototype.getConfigOptions = function (this: TTextPrintElement) {
  return KCFG.instance.text;
};
TextPrintElement.prototype.getTitle = function (this: TTextPrintElement) {
  var t = this.options.title || this.printElementType.title || "";
  if (t) t = TextHelper.replaceEnterAndNewlineAndTab(t, "");
  return t;
};
TextPrintElement.prototype.getData = function (
  this: TTextPrintElement,
  data?: Record<string, any>,
) {
  var val: any = data
    ? data[this.getField()!] || ""
    : this.options.testData || this.printElementType.getData() || "";
  if (this.options.format) {
    if (this.options.dataType === "datetime") return hinnn.dateFormat(val, this.options.format);
    if (this.options.dataType === "boolean") {
      var parts = this.options.format.split(":");
      if (parts.length > 0) return val === true || val === "true" ? parts[0] : parts[1];
    }
  }
  return val;
};
TextPrintElement.prototype.updateTargetText = function (
  this: TTextPrintElement,
  $el: JQuery,
  title: string,
  data: any,
  n?: number,
) {
  var formatter = this.getFormatter();
  var content = $el.find(".kuprint-printElement-text-content");
  var text = "";
  if (this.getField()) {
    text =
      (this.options.getHideTitle() ? "" : title ? title + "：" : "") +
      (formatter ? formatter(title, data, this.options, this._currenttemplateData, $el) : data);
  } else {
    text = formatter
      ? formatter(title, title, this.options, this._currenttemplateData, $el)
      : title;
  }
  var textType = this.options.getTextType();
  if (textType === "text") {
    content.html(text as string);
  } else if (textType === "barcode") {
    // 当未配置 field/testData 时，使用 text（即 title）作为条形码数据源
    var barcodeData = data || text;
    content.html(
      '<svg width="100%" display="block" height="100%" class="hibarcode_imgcode" preserveAspectRatio="none slice"></svg><div class="hibarcode_displayValue"></div>',
    );
    try {
      if (barcodeData) {
        (window as any).JsBarcode(content.find(".hibarcode_imgcode")[0], barcodeData, {
          format: this.options.getBarcodeMode(),
          width: 1,
          textMargin: -1,
          lineColor: this.options.color || "#000000",
          margin: 0,
          height: parseInt(hinnn.pt.toPx(this.options.getHeight() || 10).toString()),
          displayValue: false,
        });
        content.find(".hibarcode_imgcode").attr("height", "100%").attr("width", "100%");
        if (!this.options.hideTitle) content.find(".hibarcode_displayValue").html(barcodeData);
      } else {
        content.html("");
      }
    } catch (e) {
      console.log(e);
      content.html("此格式不支持该文本");
    }
  } else if (textType === "qrcode") {
    // 当未配置 field/testData 时，使用 text（即 title）作为二维码数据源
    var qrcodeData = data || text;
    content.html("");
    try {
      if (qrcodeData) {
        var w = parseInt(hinnn.pt.toPx(this.options.getWidth() || 20));
        var h = parseInt(hinnn.pt.toPx(this.options.getHeight() || 20));
        new (window as any).QRCode(content[0], {
          width: w,
          height: h,
          colorDark: this.options.color || "#000000",
          useSVG: true,
        }).makeCode(qrcodeData);
      }
    } catch (e) {
      console.log(e);
      content.html("二维码生成失败");
    }
  }
};
TextPrintElement.prototype.onResize = function (
  this: TTextPrintElement,
  e: any,
  h: number,
  w: number,
  t: number,
  l: number,
) {
  BasePrintElement.prototype.onResize.call(this, e, h, w, t, l);
  if (this.options.getTextType() === "barcode" || this.options.getTextType() === "qrcode") {
    this.updateTargetText(this.designTarget!, this.getTitle(), this.getData());
  }
};
TextPrintElement.prototype.createTarget = function (
  this: TTextPrintElement,
  title: string,
  data: any,
  n?: number,
) {
  var $el = $(
    '<div tabindex="1" class="kuprint-printElement kuprint-printElement-text" style="position:absolute;">' +
      '<div class="kuprint-printElement-text-content kuprint-printElement-content" style="height:100%;width:100%"></div></div>',
  );
  this.updateTargetText($el, title, data, n);
  return $el;
};
TextPrintElement.prototype.getHtml = function (
  this: TTextPrintElement,
  paper: any,
  data?: Record<string, any>,
  n?: number,
) {
  return this.getHtml2(paper, data, n);
};

export { TextPrintElement };
