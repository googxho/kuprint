// ============================================================
// elements/html.js — HTML 片段元素
// HtmlPrintElement 通过 formatter 动态生成 HTML
// ============================================================

import { __extends } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { HtmlPrintElementOption } from "./text-option.js";

// --- HtmlPrintElement ---
function HtmlPrintElement(pte, opts) {
  var self = BasePrintElement.call(this, pte) || this;
  self.options = new HtmlPrintElementOption(opts);
  self.options.setDefault(
    new HtmlPrintElementOption(KuPrintConfig.instance.html.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(HtmlPrintElement, BasePrintElement);
HtmlPrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) {
    this.css(this.designTarget, this.getData());
    this.updateTargetHtml();
  }
};
HtmlPrintElement.prototype.updateTargetHtml = function () {
  var formatter = this.getFormatter();
  if (formatter) {
    var html = formatter(this.getData(), this.options, this._currenttemplateData);
    this.designTarget.find(".kuprint-printElement-html-content").html(html);
  }
};
HtmlPrintElement.prototype.getConfigOptions = function () {
  return KuPrintConfig.instance.html;
};
HtmlPrintElement.prototype.createTarget = function (title, data) {
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
HtmlPrintElement.prototype.getHtml = function (paper, data, n) {
  return this.getHtml2(paper, data, n);
};

export { HtmlPrintElement };
