// ============================================================
// elements/text-option.js — 文本元素选项类
// TextPrintElementOption / LongTextPrintElementOption / HtmlPrintElementOption
// ============================================================

import { __extends, TextHelper } from "../core/utils.js";
import { PrintElementOption } from "../core/print-element-option.js";

const _PEO = PrintElementOption as any;

// ============================================================
// Types
// ============================================================
interface TOptionBase {
  title?: string;
  hideTitle?: boolean;
  textType?: string;
  fontSize?: number;
  barcodeMode?: string;
  defaultOptions: {
    hideTitle?: boolean;
    textType?: string;
    fontSize?: number;
    barcodeMode?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// ============================================================
// Concrete Print Element Option classes
// ============================================================
function TextPrintElementOption(this: TOptionBase, opts: any) {
  var self = _PEO.call(this, opts) || this;
  if (self.title) self.title = TextHelper.replaceEnterAndNewlineAndTab(self.title, "");
  return self;
}
__extends(TextPrintElementOption, PrintElementOption);
TextPrintElementOption.prototype.getHideTitle = function () {
  return this.hideTitle == null ? this.defaultOptions.hideTitle : this.hideTitle;
};
TextPrintElementOption.prototype.getTextType = function () {
  return (this.textType == null ? this.defaultOptions.textType : this.textType) || "text";
};
TextPrintElementOption.prototype.getFontSize = function () {
  return (this.fontSize == null ? this.defaultOptions.fontSize : this.fontSize) || 9;
};
TextPrintElementOption.prototype.getBarcodeMode = function () {
  return (
    (this.barcodeMode == null ? this.defaultOptions.barcodeMode : this.barcodeMode) || "CODE128"
  );
};

function LongTextPrintElementOption(this: TOptionBase, opts: any) {
  var self = _PEO.call(this, opts) || this;
  self.leftSpaceRemoved = opts.leftSpaceRemoved;
  return self;
}
__extends(LongTextPrintElementOption, PrintElementOption);
LongTextPrintElementOption.prototype.getHideTitle = function () {
  return this.hideTitle == null ? this.defaultOptions.hideTitle : this.hideTitle;
};

function HtmlPrintElementOption(this: TOptionBase, opts: any) {
  return _PEO.call(this, opts) || this;
}
__extends(HtmlPrintElementOption, PrintElementOption);

export { TextPrintElementOption, LongTextPrintElementOption, HtmlPrintElementOption };
