// ============================================================
// elements/lines.js — 线条与形状元素
// VlinePrintElement / HlinePrintElement / RectPrintElement / OvalPrintElement
// ============================================================

import { __extends } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { PrintElementOption } from "../core/print-element-option.js";

// --- VlinePrintElement ---
function VlinePrintElement(pte, opts) {
  var self = BasePrintElement.call(this, pte) || this;
  self.options = new PrintElementOption(opts);
  self.options.setDefault(
    new PrintElementOption(KuPrintConfig.instance.vline.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(VlinePrintElement, BasePrintElement);
VlinePrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
VlinePrintElement.prototype.getConfigOptions = function () {
  return KuPrintConfig.instance.hline;
};
VlinePrintElement.prototype.createTarget = function () {
  return $(
    '<div class="kuprint-printElement kuprint-printElement-vline" style="border-left:1px solid;position:absolute;"></div>',
  );
};
VlinePrintElement.prototype.getReizeableShowPoints = function () {
  return ["s"];
};
VlinePrintElement.prototype.getHtml = function (paper, data, n) {
  return this.getHtml2(paper, data, n);
};

// --- HlinePrintElement ---
function HlinePrintElement(pte, opts) {
  var self = BasePrintElement.call(this, pte) || this;
  self.options = new PrintElementOption(opts);
  self.options.setDefault(
    new PrintElementOption(KuPrintConfig.instance.hline.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(HlinePrintElement, BasePrintElement);
HlinePrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
HlinePrintElement.prototype.getConfigOptions = function () {
  return KuPrintConfig.instance.hline;
};
HlinePrintElement.prototype.createTarget = function () {
  return $(
    '<div class="kuprint-printElement kuprint-printElement-hline" style="border-top:1px solid;position:absolute;"></div>',
  );
};
HlinePrintElement.prototype.getReizeableShowPoints = function () {
  return ["e"];
};

// --- RectPrintElement ---
function RectPrintElement(pte, opts) {
  var self = BasePrintElement.call(this, pte) || this;
  self.options = new PrintElementOption(opts);
  self.options.setDefault(
    new PrintElementOption(KuPrintConfig.instance.rect.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(RectPrintElement, BasePrintElement);
RectPrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
RectPrintElement.prototype.getConfigOptions = function () {
  return KuPrintConfig.instance.hline;
};
RectPrintElement.prototype.createTarget = function () {
  return $(
    '<div class="kuprint-printElement kuprint-printElement-rect" style="border:1px solid;position:absolute;"></div>',
  );
};
RectPrintElement.prototype.getHtml = function (paper, data, n) {
  return this.getHtml2(paper, data, n);
};

// --- OvalPrintElement ---
function OvalPrintElement(pte, opts) {
  var self = BasePrintElement.call(this, pte) || this;
  self.options = new PrintElementOption(opts);
  self.options.setDefault(
    new PrintElementOption(KuPrintConfig.instance.oval.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(OvalPrintElement, BasePrintElement);
OvalPrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
OvalPrintElement.prototype.getConfigOptions = function () {
  return KuPrintConfig.instance.hline;
};
OvalPrintElement.prototype.createTarget = function () {
  return $(
    '<div class="kuprint-printElement kuprint-printElement-oval" style="border:1px solid;position:absolute;border-radius:50%;"></div>',
  );
};
OvalPrintElement.prototype.getHtml = function (paper, data, n) {
  return this.getHtml2(paper, data, n);
};

export { VlinePrintElement, HlinePrintElement, RectPrintElement, OvalPrintElement };
