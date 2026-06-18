// ============================================================
// elements/image.js — 图片元素
// ImagePrintElement 继承 BasePrintElement
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
interface TImgPrintElement {
  printElementType: any;
  options: {
    src?: string;
    getLeft?(): number;
    getTop?(): number;
    getHeight?(): number;
    getWidth?(): number;
    displayLeft(): string;
    [key: string]: any;
  };
  id: string;
  designTarget: JQuery | undefined;
  _currenttemplateData: any;
  getField(): string | undefined;
  getTitle(): string;
  getData(data?: Record<string, any>): any;
  getFormatter(): any;
  getHtml2(paper: any, data?: Record<string, any>, n?: number): any[];
  css($el: JQuery, data?: any): void;
  getConfigOptions(): any;
  updateTargetImage($el: JQuery, title: string, src: string): void;
  updateDesignViewFromOptions(): void;
}

// --- ImagePrintElement ---
function ImagePrintElement(this: TImgPrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (PrintElementOption as any)(opts);
  self.options.setDefault(
    new (PrintElementOption as any)(KCFG.instance.image.default).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(ImagePrintElement, BasePrintElement);
ImagePrintElement.prototype.getReizeableShowPoints = function (this: TImgPrintElement) {
  return ["se"];
};
ImagePrintElement.prototype.getData = function (
  this: TImgPrintElement,
  data?: Record<string, any>,
) {
  var src = "";
  if (data) {
    src = this.getField()
      ? data[this.getField()!] || ""
      : this.options.src || this.printElementType.getData();
  } else {
    src = this.options.src || this.printElementType.getData();
  }
  var formatter = this.getFormatter();
  if (formatter) src = formatter(src, this.options, this._currenttemplateData);
  return src || "";
};
ImagePrintElement.prototype.createTarget = function (
  this: TImgPrintElement,
  title: string,
  data: any,
) {
  var $el = $(
    '<div class="kuprint-printElement kuprint-printElement-image" style="position:absolute;">' +
      '<div class="kuprint-printElement-image-content" style="height:100%;width:100%"></div></div>',
  );
  this.updateTargetImage($el, title, data);
  return $el;
};
ImagePrintElement.prototype.initSizeByHtml = function (this: TImgPrintElement, $el: JQuery) {
  BasePrintElement.prototype.initSizeByHtml.call(this, $el);
  this.css($el, this.getData());
};
ImagePrintElement.prototype.getConfigOptions = function (this: TImgPrintElement) {
  return KCFG.instance.image;
};
ImagePrintElement.prototype.updateDesignViewFromOptions = function (this: TImgPrintElement) {
  if (this.designTarget) {
    this.css(this.designTarget, this.getData());
    this.updateTargetImage(this.designTarget, this.getTitle(), this.getData());
  }
};
ImagePrintElement.prototype.updateTargetImage = function (
  this: TImgPrintElement,
  $el: JQuery,
  title: string,
  src: string,
) {
  var content = $el.find(".kuprint-printElement-image-content");
  if (content.find("img").length) {
    content.find("img").attr("src", src);
  } else {
    content.html('<img style="width:100%;height:100%;" src="' + src + '">');
  }
};
ImagePrintElement.prototype.getHtml = function (
  this: TImgPrintElement,
  paper: any,
  data?: Record<string, any>,
  n?: number,
) {
  return this.getHtml2(paper, data, n);
};

export { ImagePrintElement };
