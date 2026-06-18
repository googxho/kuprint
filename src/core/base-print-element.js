// ============================================================
// core/base-print-element.js — 打印元素基类
// ============================================================
// 【BasePrintElement — 所有打印元素的抽象基类】
//
// 这是 kuprint 最核心的类之一。定义了所有打印元素的通用能力：
//   - 位置管理（left/top）和尺寸管理（width/height）
//   - 标题、字段绑定、数据获取
//   - 拖拽（hidraggable）、缩放（hireizeable）交互
//   - 键盘方向键微调移动
//   - 对齐辅助线（createLineOfPosition）
//   - 分页渲染（getHtml / getHtml2）
//   - 选项面板联动（getPrintElementOptionItems）
//   - 格式化函数（formatter）和样式函数（styler）
//   - 固定元素（fixed）、显示规则（showInPage）
//
// 子类包括：TextPrintElement、ImagePrintElement、
// LongTextPrintElement、HtmlPrintElement、HlinePrintElement、
// VlinePrintElement、RectPrintElement、OvalPrintElement、
// TablePrintElement、TableCustomPrintElement
// ============================================================

import { hinnn } from "./utils.js";
import { KuPrintlib } from "./lib.js";
import { KuPrintConfig } from "./config.js";
import PrintElementOptionItemManager from "../options/manager.js";
import { PrintReferenceElement, PaperHtmlResult } from "../table/row.js";

function BasePrintElement(printElementType) {
  this.printElementType = printElementType;
  this.id = KuPrintlib.instance.guid();
}

BasePrintElement.prototype.getConfigOptionsByName = function (name) {
  return KuPrintConfig.instance[name];
};
BasePrintElement.prototype.getProxyTarget = function (overrideOpts) {
  if (overrideOpts) this.SetProxyTargetOption(overrideOpts);
  var data = this.getData();
  var target = this.createTarget(this.getTitle(), data);
  this.updateTargetSize(target);
  this.css(target, data);
  return target;
};
BasePrintElement.prototype.SetProxyTargetOption = function (opts) {
  this.options.getPrintElementOptionEntity();
  $.extend(this.options, opts);
};
BasePrintElement.prototype.showInPage = function (pageIdx, totalPages) {
  var show = this.options.showInPage;
  var hide = this.options.unShowInPage;
  if (show) {
    if (show === "first") return pageIdx === 0;
    if (pageIdx === totalPages - 1 && hide === "last") return false;
    if (show === "odd") return (pageIdx !== 0 || hide !== "first") && pageIdx % 2 === 0;
    if (show === "even") return pageIdx % 2 === 1;
    if (show === "last") return pageIdx === totalPages - 1;
  }
  return (pageIdx !== 0 || hide !== "first") && (pageIdx !== totalPages - 1 || hide !== "last");
};
BasePrintElement.prototype.setTemplateId = function (id) {
  this.templateId = id;
};
BasePrintElement.prototype.setPanel = function (panel) {
  this.panel = panel;
};
BasePrintElement.prototype.getField = function () {
  return this.options.field || this.printElementType.field;
};
BasePrintElement.prototype.getTitle = function () {
  return this.printElementType.title;
};
BasePrintElement.prototype.updateSizeAndPositionOptions = function (left, top, width, height) {
  this.options.setLeft(left);
  this.options.setTop(top);
  this.options.copyDesignTopFromTop();
  this.options.setWidth(width);
  this.options.setHeight(height);
  hinnn.event.trigger("kuprintTemplateDataChanged_" + this.templateId);
};
BasePrintElement.prototype.initSizeByHtml = function ($el) {
  if ($el && $el.length) {
    this.createTempContainer();
    var clone = $el.clone();
    this.getTempContainer().append(clone);
    this.options.initSizeByHtml(
      parseInt(hinnn.px.toPt(clone.width()).toString()),
      parseInt(hinnn.px.toPt(clone.height()).toString()),
    );
    this.removeTempContainer();
  }
};
BasePrintElement.prototype.updateTargetSize = function ($el) {
  $el.css("width", this.options.displayWidth());
  $el.css("height", this.options.displayHeight());
};
BasePrintElement.prototype.updateTargetWidth = function ($el) {
  $el.css("width", this.options.displayWidth());
};
BasePrintElement.prototype.getDesignTarget = function (paper) {
  var self = this;
  this.designTarget = this.getHtml(paper)[0].target;
  this.designPaper = paper;
  this.designTarget.click(function () {
    hinnn.event.trigger(self.getPrintElementSelectEventKey(), { printElement: self });
  });
  return this.designTarget;
};
BasePrintElement.prototype.getPrintElementSelectEventKey = function () {
  return "PrintElementSelectEventKey_" + this.templateId;
};
BasePrintElement.prototype.design = function (opts, paper) {
  var self = this;
  this.designTarget.hidraggable({
    axis: self.options.axis && opts && opts.axisEnabled ? self.options.axis : undefined,
    onDrag: function (e, left, top) {
      self.updateSizeAndPositionOptions(left, top);
      self.createLineOfPosition(paper);
    },
    moveUnit: "pt",
    minMove: KuPrintConfig.instance.movingDistance,
    onBeforeDrag: function () {
      KuPrintlib.instance.draging = true;
      self.designTarget.focus();
      self.createLineOfPosition(paper);
    },
    onStopDrag: function () {
      KuPrintlib.instance.draging = false;
      self.removeLineOfPosition();
    },
  });
  this.designTarget.hireizeable({
    showPoints: self.getReizeableShowPoints(),
    onBeforeResize: function () {
      KuPrintlib.instance.draging = true;
    },
    onResize: function (e, h, w, t, l) {
      self.onResize(e, h, w, t, l);
      self.createLineOfPosition(paper);
    },
    onStopResize: function () {
      KuPrintlib.instance.draging = false;
      self.removeLineOfPosition();
    },
  });
  this.bingCopyEvent(this.designTarget);
  this.bingKeyboardMoveEvent(this.designTarget, paper);
};
BasePrintElement.prototype.getPrintElementEntity = function (withTid) {
  if (withTid) {
    return new PrintElementEntity(
      undefined,
      this.options.getPrintElementOptionEntity(),
      this.printElementType.getPrintElementTypeEntity(),
    );
  }
  return new PrintElementEntity(
    this.printElementType.tid,
    this.options.getPrintElementOptionEntity(),
  );
};
BasePrintElement.prototype.submitOption = function () {
  var self = this;
  this.getPrintElementOptionItems().forEach(function (item) {
    var val = item.getValue();
    if (val && typeof val === "object") {
      Object.keys(val).forEach(function (k) {
        self.options[k] = val[k];
      });
    } else {
      self.options[item.name] = val;
    }
  });
  this.updateDesignViewFromOptions();
  hinnn.event.trigger("kuprintTemplateDataChanged_" + this.templateId);
};
BasePrintElement.prototype.getReizeableShowPoints = function () {
  return ["s", "e"];
};
BasePrintElement.prototype.onResize = function (e, h, w, t, l) {
  this.updateSizeAndPositionOptions(l, t, w, h);
};
BasePrintElement.prototype.getOrderIndex = function () {
  return this.options.getTop();
};
BasePrintElement.prototype.getHtml = function (paper, data, n) {
  var pageIdx = 0;
  this.setCurrenttemplateData(data);
  var results = [];
  var printTop = this.getBeginPrintTopInPaperByReferenceElement(paper);
  var footer = paper.getPaperFooter(pageIdx);
  if (!this.isHeaderOrFooter() && !this.isFixed() && printTop > footer) {
    results.push(new PaperHtmlResult({ target: undefined, printLine: undefined }));
    printTop = printTop - footer + paper.paperHeader;
    pageIdx++;
    footer = paper.getPaperFooter(pageIdx);
  }
  var val = this.getData(data);
  var target = this.createTarget(this.getTitle(), val, n);
  this.updateTargetSize(target);
  this.css(target, val);
  target.css("position", "absolute");
  target.css("left", this.options.displayLeft());
  target.css("top", printTop + "pt");
  results.push(
    new PaperHtmlResult({
      target: target,
      printLine: printTop + this.options.getHeight(),
    }),
  );
  return results;
};
BasePrintElement.prototype.getHtml2 = function (paper, data, n) {
  var pageIdx = 0;
  this.setCurrenttemplateData(data);
  var results = [];
  var printTop = this.getBeginPrintTopInPaperByReferenceElement(paper);
  var footer = paper.getPaperFooter(pageIdx);
  if (!this.isHeaderOrFooter() && !this.isFixed()) {
    if (printTop > footer) {
      results.push(new PaperHtmlResult({ target: undefined, printLine: undefined }));
      printTop = printTop - footer + paper.paperHeader;
      pageIdx++;
      footer = paper.getPaperFooter(pageIdx);
    }
    if (printTop <= footer && printTop + this.options.getHeight() > footer) {
      results.push(new PaperHtmlResult({ target: undefined, printLine: undefined }));
      printTop = paper.paperHeader;
      pageIdx++;
      footer = paper.getPaperFooter(pageIdx);
    }
  }
  var val = this.getData(data);
  var target = this.createTarget(this.getTitle(), val);
  this.updateTargetSize(target);
  this.css(target, val);
  target.css("position", "absolute");
  target.css("left", this.options.displayLeft());
  target.css("top", printTop + "pt");
  results.push(
    new PaperHtmlResult({
      target: target,
      printLine: printTop + this.options.getHeight(),
      referenceElement: new PrintReferenceElement({
        top: this.options.getTop(),
        left: this.options.getLeft(),
        height: this.options.getHeight(),
        width: this.options.getWidth(),
        beginPrintPaperIndex: paper.index,
        bottomInLastPaper: printTop + this.options.getHeight(),
        printTopInPaper: printTop,
      }),
    }),
  );
  return results;
};
BasePrintElement.prototype.getBeginPrintTopInPaperByReferenceElement = function (paper) {
  var top = this.options.getTop();
  if (this.isHeaderOrFooter() || this.isFixed()) return top;
  var ref = paper.referenceElement;
  if (ref.isPositionLeftOrRight(top)) {
    return ref.printTopInPaper + (top - ref.top);
  }
  return ref.bottomInLastPaper + (top - (ref.top + ref.height));
};
BasePrintElement.prototype.css = function ($el, data) {
  var self = this;
  var results = [];
  var configOpts = this.getConfigOptions();
  if (configOpts) {
    var supportOpts = configOpts.supportOptions;
    if (supportOpts) {
      supportOpts.forEach(function (opt) {
        var item = PrintElementOptionItemManager.getItem(opt.name);
        if (item && item.css) {
          var r = item.css($el, self.options.getValueFromOptionsOrDefault(opt.name));
          if (r) results.push(r);
        }
      });
    }
  }
  this.stylerCss($el, data);
};
BasePrintElement.prototype.stylerCss = function ($el, data) {
  var styler = this.getStyler();
  if (styler) {
    var style = styler(data, this.options, $el, this._currenttemplateData);
    if (style) {
      Object.keys(style).forEach(function (k) {
        $el.css(k, style[k]);
      });
    }
  }
};
BasePrintElement.prototype.getData = function (data) {
  return data ? data[this.getField()] || "" : this.printElementType.getData();
};
BasePrintElement.prototype.getPrintElementOptionItems = function () {
  if (this._printElementOptionItems) return this._printElementOptionItems;
  var items = [];
  var configOpts = this.getConfigOptions();
  if (configOpts) {
    var supportOpts = configOpts.supportOptions;
    if (supportOpts) {
      supportOpts
        .filter(function (o) {
          return !o.hidden;
        })
        .forEach(function (o) {
          var item = PrintElementOptionItemManager.getItem(o.name);
          items.push(item);
        });
    }
  }
  this._printElementOptionItems = this.filterOptionItems(items.concat());
  return this._printElementOptionItems;
};
BasePrintElement.prototype.getPrintElementOptionItemsByName = function (name) {
  var items = [];
  var configOpts = this.getConfigOptionsByName(name);
  if (configOpts) {
    var supportOpts = configOpts.supportOptions;
    if (supportOpts) {
      supportOpts
        .filter(function (o) {
          return !o.hidden;
        })
        .forEach(function (o) {
          items.push(PrintElementOptionItemManager.getItem(o.name));
        });
    }
  }
  return items.concat();
};
BasePrintElement.prototype.filterOptionItems = function (items) {
  if (this.printElementType.field) {
    return items.filter(function (item) {
      return item.name !== "field";
    });
  }
  return items;
};
BasePrintElement.prototype.createTempContainer = function () {
  this.removeTempContainer();
  $("body").append(
    $(
      '<div class="kuprint_temp_Container kuprint-printPaper" style="overflow:hidden;height:0px;box-sizing:border-box;"></div>',
    ),
  );
};
BasePrintElement.prototype.removeTempContainer = function () {
  $(".kuprint_temp_Container").remove();
};
BasePrintElement.prototype.getTempContainer = function () {
  return $(".kuprint_temp_Container");
};
BasePrintElement.prototype.isHeaderOrFooter = function () {
  return (
    this.options.getTopInDesign() < this.panel.paperHeader ||
    this.options.getTopInDesign() >= this.panel.paperFooter
  );
};
BasePrintElement.prototype.delete = function () {
  if (this.designTarget) this.designTarget.remove();
};
BasePrintElement.prototype.setCurrenttemplateData = function (data) {
  this._currenttemplateData = data;
};
BasePrintElement.prototype.isFixed = function () {
  return this.options.fixed;
};
BasePrintElement.prototype.onRendered = function (paper, target) {
  if (this.printElementType && this.printElementType.onRendered) {
    this.printElementType.onRendered(target, this.options, paper.getTarget());
  }
};
BasePrintElement.prototype.createLineOfPosition = function (paper) {
  var topLine = $(".toplineOfPosition" + this.id);
  var leftLine = $(".leftlineOfPosition" + this.id);
  var rightLine = $(".rightlineOfPosition" + this.id);
  var bottomLine = $(".bottomlineOfPosition" + this.id);
  if (!topLine.length) {
    topLine = $(
      '<div class="toplineOfPosition' +
        this.id +
        '" style="border:0;border-top:1px dashed rgb(169,169,169);position:absolute;width:100%;"></div>',
    );
    topLine.css("top", this.options.displayTop());
    topLine.css("width", paper.displayWidth());
    this.designTarget.parents(".kuprint-printPaper-content").append(topLine);
  } else {
    topLine.css("top", this.options.displayTop());
  }
  if (!leftLine.length) {
    leftLine = $(
      '<div class="leftlineOfPosition' +
        this.id +
        '" style="border:0;border-left:1px dashed rgb(169,169,169);position:absolute;height:100%;"></div>',
    );
    leftLine.css("left", this.options.displayLeft());
    leftLine.css("height", paper.displayHeight());
    this.designTarget.parents(".kuprint-printPaper-content").append(leftLine);
  } else {
    leftLine.css("left", this.options.displayLeft());
  }
  if (!rightLine.length) {
    rightLine = $(
      '<div class="rightlineOfPosition' +
        this.id +
        '" style="border:0;border-left:1px dashed rgb(169,169,169);position:absolute;height:100%;"></div>',
    );
    rightLine.css("left", this.options.getLeft() + this.options.getWidth() + "pt");
    rightLine.css("height", paper.displayHeight());
    this.designTarget.parents(".kuprint-printPaper-content").append(rightLine);
  } else {
    rightLine.css("left", this.options.getLeft() + this.options.getWidth() + "pt");
  }
  if (!bottomLine.length) {
    bottomLine = $(
      '<div class="bottomlineOfPosition' +
        this.id +
        '" style="border:0;border-top:1px dashed rgb(169,169,169);position:absolute;width:100%;"></div>',
    );
    bottomLine.css("top", this.options.getTop() + this.options.getHeight() + "pt");
    bottomLine.css("width", paper.displayWidth());
    this.designTarget.parents(".kuprint-printPaper-content").append(bottomLine);
  } else {
    bottomLine.css("top", this.options.getTop() + this.options.getHeight() + "pt");
  }
};
BasePrintElement.prototype.removeLineOfPosition = function () {
  $(".toplineOfPosition" + this.id).remove();
  $(".leftlineOfPosition" + this.id).remove();
  $(".rightlineOfPosition" + this.id).remove();
  $(".bottomlineOfPosition" + this.id).remove();
};
BasePrintElement.prototype.getFields = function () {
  var fields = this.printElementType.getFields();
  if (!fields) {
    fields = KuPrintlib.instance.getPrintTemplateById(this.templateId).getFields();
  }
  return fields;
};
BasePrintElement.prototype.bingCopyEvent = function () {};
BasePrintElement.prototype.getFormatter = function () {
  var fn;
  if (this.printElementType.formatter) fn = this.printElementType.formatter;
  if (this.options.formatter) {
    try {
      fn = new Function("return (" + this.options.formatter + ")")();
    } catch (e) {
      console.log(e);
    }
  }
  return fn;
};
BasePrintElement.prototype.getStyler = function () {
  var fn;
  if (this.printElementType.styler) fn = this.printElementType.styler;
  if (this.options.styler) {
    try {
      fn = new Function("return (" + this.options.styler + ")")();
    } catch (e) {
      console.log(e);
    }
  }
  return fn;
};
BasePrintElement.prototype.bingKeyboardMoveEvent = function ($el, paper) {
  var self = this;
  $el.attr("tabindex", "1");
  $el.keydown(function (e) {
    var left, top;
    switch (e.keyCode) {
      case 37:
        left = self.options.getLeft();
        self.updateSizeAndPositionOptions(left - KuPrintConfig.instance.movingDistance);
        $el.css("left", self.options.displayLeft());
        self.createLineOfPosition(paper);
        e.preventDefault();
        break;
      case 38:
        top = self.options.getTop();
        self.updateSizeAndPositionOptions(undefined, top - KuPrintConfig.instance.movingDistance);
        $el.css("top", self.options.displayTop());
        self.createLineOfPosition(paper);
        e.preventDefault();
        break;
      case 39:
        left = self.options.getLeft();
        self.updateSizeAndPositionOptions(left + KuPrintConfig.instance.movingDistance);
        $el.css("left", self.options.displayLeft());
        self.createLineOfPosition(paper);
        e.preventDefault();
        break;
      case 40:
        top = self.options.getTop();
        self.updateSizeAndPositionOptions(undefined, top + KuPrintConfig.instance.movingDistance);
        $el.css("top", self.options.displayTop());
        self.createLineOfPosition(paper);
        e.preventDefault();
        break;
    }
  });
};
BasePrintElement.prototype.inRect = function (rect) {
  var off = this.designTarget.offset();
  return rect.minX < off.left && rect.minY < off.top && rect.maxX > off.left && rect.maxY > off.top;
};
BasePrintElement.prototype.multipleSelect = function (on) {
  if (on) this.designTarget.addClass("multipleSelect");
  else this.designTarget.removeClass("multipleSelect");
};
BasePrintElement.prototype.updatePositionByMultipleSelect = function (dx, dy) {
  this.updateSizeAndPositionOptions(dx + this.options.getLeft(), dy + this.options.getTop());
  this.designTarget.css("left", this.options.displayLeft());
  this.designTarget.css("top", this.options.displayTop());
};

// ============================================================
// PrintElementEntity
// ============================================================
var PrintElementEntity = function (tid, options, printElementType) {
  this.tid = tid;
  this.options = options;
  this.printElementType = printElementType;
};

export { BasePrintElement, PrintElementEntity };
