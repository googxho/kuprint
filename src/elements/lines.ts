// ============================================================
// elements/lines.js — 线条与形状元素
// VlinePrintElement / HlinePrintElement / RectPrintElement / OvalPrintElement
// ============================================================

import { __extends } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { PrintElementOption } from "../core/print-element-option.js";

const _BasePE = BasePrintElement as any;
const KCFG = KuPrintConfig as any;

// ============================================================
// Types
// ============================================================
interface TLinePrintElement {
  options: any;
  designTarget: JQuery | undefined;
  getData(data?: Record<string, any>): any;
  getConfigOptions(): any;
  getHtml2(paper: any, data?: Record<string, any>, n?: number): any[];
  css($el: JQuery, data?: any): void;
}

// --- VlinePrintElement ---
function VlinePrintElement(this: TLinePrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (PrintElementOption as any)(opts);
  self.options.setDefault(
    new (PrintElementOption as any)(KCFG.instance.vline.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(VlinePrintElement, BasePrintElement);
VlinePrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
VlinePrintElement.prototype.getConfigOptions = function (this: any) {
  return KCFG.instance.hline;
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
function HlinePrintElement(this: TLinePrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (PrintElementOption as any)(opts);
  self.options.setDefault(
    new (PrintElementOption as any)(KCFG.instance.hline.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(HlinePrintElement, BasePrintElement);
HlinePrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
HlinePrintElement.prototype.getConfigOptions = function (this: any) {
  return KCFG.instance.hline;
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
function RectPrintElement(this: TLinePrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (PrintElementOption as any)(opts);
  self.options.setDefault(
    new (PrintElementOption as any)(KCFG.instance.rect.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(RectPrintElement, BasePrintElement);
RectPrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
RectPrintElement.prototype.getConfigOptions = function (this: any) {
  return KCFG.instance.hline;
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
function OvalPrintElement(this: TLinePrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (PrintElementOption as any)(opts);
  self.options.setDefault(
    new (PrintElementOption as any)(KCFG.instance.oval.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(OvalPrintElement, BasePrintElement);
OvalPrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) this.css(this.designTarget, this.getData());
};
OvalPrintElement.prototype.getConfigOptions = function (this: any) {
  return KCFG.instance.hline;
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
