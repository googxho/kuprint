// ============================================================
// elements/html.js — HTML 片段元素
// HtmlPrintElement 通过 formatter 动态生成 HTML
// ============================================================

import { __extends } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { HtmlPrintElementOption } from "./text-option.js";

const _BasePE = BasePrintElement as any;
const KCFG = KuPrintConfig as any;

// ============================================================
// Types
// ============================================================
interface THtmlPrintElement {
  printElementType: any;
  options: { content?: string; [key: string]: any };
  designTarget: JQuery | undefined;
  _currenttemplateData: any;
  getData(data?: Record<string, any>): any;
  getFormatter(): any;
  getConfigOptions(): any;
  css($el: JQuery, data?: any): void;
  updateTargetHtml(): void;
  updateDesignViewFromOptions(): void;
  getHtml2(paper: any, data?: any, n?: number): any[];
}

// --- HtmlPrintElement ---
function HtmlPrintElement(this: THtmlPrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (HtmlPrintElementOption as any)(opts);
  self.options.setDefault(
    new (HtmlPrintElementOption as any)(KCFG.instance.html.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(HtmlPrintElement, BasePrintElement);
HtmlPrintElement.prototype.updateDesignViewFromOptions = function (this: THtmlPrintElement) {
  if (this.designTarget) {
    this.css(this.designTarget, this.getData());
    this.updateTargetHtml();
  }
};
HtmlPrintElement.prototype.updateTargetHtml = function (this: THtmlPrintElement) {
  var formatter = this.getFormatter();
  if (formatter) {
    var html = formatter(this.getData(), this.options, this._currenttemplateData);
    this.designTarget!.find(".kuprint-printElement-html-content").html(html);
  }
};
HtmlPrintElement.prototype.getConfigOptions = function (this: THtmlPrintElement) {
  return KCFG.instance.html;
};
HtmlPrintElement.prototype.createTarget = function (
  this: THtmlPrintElement,
  title: string,
  data: any,
) {
  var $el = $(
    '<div class="kuprint-printElement kuprint-printElement-html" style="position:absolute;">' +
      '<div class="kuprint-printElement-html-content" style="height:100%;width:100%"></div></div>',
  );
  var formatter = this.getFormatter();
  if (formatter) {
    $el
      .find(".kuprint-printElement-html-content")
      .append(formatter(this.getData(), this.options, this._currenttemplateData));
  } else if (this.options.content) {
    $el.find(".kuprint-printElement-html-content").append(this.options.content);
  }
  return $el;
};
HtmlPrintElement.prototype.getHtml = function (
  this: THtmlPrintElement,
  paper: any,
  data?: any,
  n?: number,
) {
  return this.getHtml2(paper, data, n);
};

export { HtmlPrintElement };
