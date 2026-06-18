// ============================================================
// elements/longtext.js — 长文本元素
// LongTextPrintElement 自动换行+分页（二分查找算法）
// ============================================================

import { __extends, hinnn } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { PrintElementOption } from "../core/print-element-option.js";
import { LongTextPrintElementOption } from "./text-option.js";
import { PaperHtmlResult, PrintReferenceElement } from "../table/row.js";
import { Paper } from "../paper/paper.js";

const _BasePE = BasePrintElement as any;
const KCFG = KuPrintConfig as any;

// ============================================================
// Types
// ============================================================
interface TLongTextPrintElement {
  printElementType: { title?: string; getText(forProxy?: boolean): string };
  options: {
    title?: string;
    field?: string;
    testData?: string;
    longTextIndent?: number;
    leftSpaceRemoved?: boolean;
    lHeight?: number;
    getHideTitle(): boolean;
    getTop(): number;
    getLeft(): number;
    getHeight(): number;
    getWidth(): number;
    displayLeft(): string;
    displayTop(): string;
    [key: string]: any;
  };
  designTarget: JQuery | undefined;
  designPaper: any;
  _currenttemplateData: any;
  getField(): string | undefined;
  getTitle(): string;
  getData(data?: Record<string, any>): any;
  getFormatter(): any;
  getHtml(paper: any, data?: Record<string, any>): any;
  createTarget(title: string, data: any): JQuery;
  updateTargetWidth($el: JQuery): void;
  updateTargetSize($el: JQuery): void;
  updateTargetText($el: JQuery, title: string, data: any): void;
  css($el: JQuery, data?: any): void;
  SetProxyTargetOption(override: any): void;
  getConfigOptions(): any;
  setCurrenttemplateData(data: any): void;
  createTempContainer(): void;
  removeTempContainer(): void;
  getTempContainer(): JQuery;
  isHeaderOrFooter(): boolean;
  isFixed(): boolean;
  getPaperHtmlResult(paper: any, data?: any, n?: any): any[];
  getBeginPrintTopInPaperByReferenceElement(paper: any): number;
  updateDesignViewFromOptions(): void;
}

// --- LongTextPrintElement ---
function LongTextPrintElement(this: TLongTextPrintElement, pte: any, opts: any) {
  var self = _BasePE.call(this, pte) || this;
  self.options = new (LongTextPrintElementOption as any)(opts);
  self.options.setDefault(
    new (LongTextPrintElementOption as any)(
      KCFG.instance.longText.default,
    ).getPrintElementOptionEntity(),
  );
  return self;
}
__extends(LongTextPrintElement, BasePrintElement);
LongTextPrintElement.prototype.getDesignTarget = function (paper) {
  var target = BasePrintElement.prototype.getDesignTarget.call(this, paper);
  target.find(".kuprint-printElement-longText-content").css("border", "1px dashed #cebcbc");
  return target;
};
LongTextPrintElement.prototype.getProxyTarget = function (override) {
  if (override) this.SetProxyTargetOption(override);
  var data = this.getData();
  var target = this.createTarget(this.printElementType.getText(true), data);
  this.updateTargetSize(target);
  this.css(target, data);
  return target;
};
LongTextPrintElement.prototype.updateDesignViewFromOptions = function () {
  if (this.designTarget) {
    var data = this.getData();
    var html = this.getHtml(this.designPaper)[0].target;
    this.designTarget
      .find(".kuprint-printElement-longText-content")
      .html(html.find(".kuprint-printElement-longText-content").html());
    this.css(this.designTarget, data);
  }
};
LongTextPrintElement.prototype.getConfigOptions = function (this: any) {
  return KCFG.instance.longText;
};
LongTextPrintElement.prototype.getTitle = function () {
  return this.options.title || this.printElementType.title;
};
LongTextPrintElement.prototype.getData = function (data) {
  return data
    ? data[this.getField()] || ""
    : this.options.testData || this.printElementType.getData() || "";
};
LongTextPrintElement.prototype.updateTargetText = function ($el, title, data) {
  var content = $el.find(".kuprint-printElement-longText-content");
  content.html(this.getText(title, data));
};
LongTextPrintElement.prototype.createTarget = function (title, data) {
  var $el = $(
    '<div class="kuprint-printElement kuprint-printElement-longText" style="position:absolute;">' +
      '<div class="kuprint-printElement-longText-content kuprint-printElement-content" style="height:100%;width:100%"></div></div>',
  );
  this.updateTargetText($el, title, data);
  return $el;
};
LongTextPrintElement.prototype.getText = function (title, data) {
  var formatter = this.getFormatter();
  if (data)
    data = this.options.leftSpaceRemoved !== false ? data.toString().replace(/^\s*/, "") : data;
  var result = "";
  if (this.getField()) {
    result =
      (this.options.getHideTitle() ? "" : title ? title + "：" : "") +
      (formatter ? formatter(title, data, this.options, this._currenttemplateData) : data);
  } else {
    result = formatter
      ? formatter(title, title, this.options, this._currenttemplateData)
      : title || "";
  }
  return result || "";
};
LongTextPrintElement.prototype.getHtml = function (paper, data) {
  this.setCurrenttemplateData(data);
  this.createTempContainer();
  var result = this.getPaperHtmlResult(paper, data);
  this.removeTempContainer();
  return result;
};
LongTextPrintElement.prototype.getHeightByData = function (data) {
  this.createTempContainer();
  var dummyPaper = new Paper("", 1000, 1000, 0, 25000, 0, 0, true, undefined, 0, undefined);
  var result = this.getPaperHtmlResult(dummyPaper, {}, data);
  this.removeTempContainer();
  return result[0].referenceElement.bottomInLastPaper - result[0].referenceElement.printTopInPaper;
};
LongTextPrintElement.prototype.getLongTextIndent = function () {
  return this.options.longTextIndent
    ? '<span class="long-text-indent" style="margin-left:' +
        this.options.longTextIndent +
        'pt"></span>'
    : '<span class="long-text-indent"></span>';
};
LongTextPrintElement.prototype.getPaperHtmlResult = function (paper, data, n) {
  var self = this;
  var results = [];
  var pageIdx = 0;
  var val = n || this.getData(data);
  var text = this.getText(this.getTitle(), val);
  var dummyTarget = this.createTarget(this.getTitle(), this.options.testData || "");
  this.css(dummyTarget, val);
  if (data) this.updateTargetWidth(dummyTarget);
  else this.updateTargetSize(dummyTarget);
  this.getTempContainer().html("");
  this.getTempContainer().append(dummyTarget);
  var chars = [this.getLongTextIndent()];
  var lines = text.split(/\r|\n/);
  lines.forEach(function (line, i) {
    var cleaned =
      self.options.leftSpaceRemoved !== false ? (line || "").toString().replace(/^\s*/, "") : line;
    chars = chars.concat(cleaned.split(""));
    if (i < lines.length - 1) chars.push("<br/>" + self.getLongTextIndent());
  });
  if (chars.length === 0) chars = [""];
  if (this.isHeaderOrFooter() || this.isFixed() || !data) {
    var singleResult = this.getStringBySpecificHeight(chars, 25000, dummyTarget);
    singleResult.target.css("left", this.options.displayLeft());
    singleResult.target.css("top", this.options.displayTop());
    singleResult.target[0].height = "";
    results.push(
      new PaperHtmlResult({
        target: singleResult.target,
        printLine: this.options.displayTop() + singleResult.height,
        referenceElement: new PrintReferenceElement({
          top: this.options.getTop(),
          left: this.options.getLeft(),
          height: this.options.getHeight(),
          width: this.options.getWidth(),
          beginPrintPaperIndex: paper.index,
          bottomInLastPaper: this.options.getTop() + singleResult.height,
          printTopInPaper: this.options.getTop(),
        }),
      }),
    );
    return results;
  }
  var printTop = this.getBeginPrintTopInPaperByReferenceElement(paper);
  while (chars.length > 0) {
    var extraHeight = 0;
    var footer = paper.getPaperFooter(pageIdx);
    if (pageIdx === 0 && printTop > footer) {
      printTop = printTop - footer + paper.paperHeader;
      results.push(new PaperHtmlResult({ target: undefined, printLine: undefined }));
      pageIdx++;
      extraHeight = paper.getContentHeight(pageIdx) - (printTop - paper.paperHeader);
      footer = paper.getPaperFooter(pageIdx);
    }
    var h =
      extraHeight > 0
        ? extraHeight
        : pageIdx === 0
          ? footer - printTop
          : paper.getContentHeight(pageIdx);
    var chunk = this.getStringBySpecificHeight(chars, h, dummyTarget);
    chars.splice(0, chunk.length);
    var printLine, anchorTop;
    chunk.target.css("left", this.options.displayLeft());
    chunk.target[0].height = "";
    if (pageIdx === 0 || extraHeight > 0) {
      anchorTop = printTop;
      chunk.target.css("top", anchorTop + "pt");
      printLine =
        chars.length > 0
          ? printTop + chunk.height
          : this.options.lHeight != null
            ? printTop + (chunk.height > this.options.lHeight ? chunk.height : this.options.lHeight)
            : printTop + chunk.height;
    } else {
      anchorTop = paper.paperHeader;
      chunk.target.css("top", anchorTop + "pt");
      printLine = anchorTop + chunk.height;
    }
    results.push(
      new PaperHtmlResult({
        target: chunk.target,
        printLine: printLine,
        referenceElement: new PrintReferenceElement({
          top: this.options.getTop(),
          left: this.options.getLeft(),
          height: this.options.getHeight(),
          width: this.options.getWidth(),
          beginPrintPaperIndex: paper.index,
          bottomInLastPaper: printLine,
          printTopInPaper: anchorTop,
        }),
      }),
    );
    pageIdx++;
  }
  return results;
};
LongTextPrintElement.prototype.getStringBySpecificHeight = function (
  chars,
  availHeight,
  dummyTarget,
) {
  var availPx = hinnn.pt.toPx(availHeight);
  var result = this.IsPaginationIndex(chars, chars.length - 1, availPx, dummyTarget);
  return result.IsPagination
    ? result
    : this.BinarySearch(chars, 0, chars.length - 1, availPx, dummyTarget);
};
LongTextPrintElement.prototype.BinarySearch = function (chars, lo, hi, availPx, dummyTarget) {
  var mid = Math.floor((lo + hi) / 2);
  if (lo > hi) {
    dummyTarget.find(".kuprint-printElement-longText-content").html("");
    return { IsPagination: true, height: 0, length: 0, target: dummyTarget.clone() };
  }
  var result = this.IsPaginationIndex(chars, mid, availPx, dummyTarget);
  if (result.IsPagination) return result;
  return result.move === "l"
    ? this.BinarySearch(chars, lo, mid - 1, availPx, dummyTarget)
    : this.BinarySearch(chars, mid + 1, hi, availPx, dummyTarget);
};
LongTextPrintElement.prototype.IsPaginationIndex = function (chars, idx, availPx, dummyTarget) {
  dummyTarget.find(".kuprint-printElement-longText-content").html(chars.slice(0, idx + 2).join(""));
  var h2 = dummyTarget.height();
  dummyTarget.find(".kuprint-printElement-longText-content").html(chars.slice(0, idx + 1).join(""));
  var h1 = dummyTarget.height();
  if (idx >= chars.length - 1 && h1 < availPx) {
    return {
      IsPagination: true,
      height: hinnn.px.toPt(h1),
      length: chars.length,
      target: dummyTarget.clone(),
    };
  }
  if (h1 <= availPx && h2 >= availPx) {
    return { IsPagination: true, height: h1, length: idx + 1, target: dummyTarget.clone() };
  }
  if (h1 >= availPx) return { IsPagination: false, move: "l" };
  if (h2 <= availPx) return { IsPagination: false, move: "r" };
  return { IsPagination: true, result: 1 };
};

export { LongTextPrintElement };
