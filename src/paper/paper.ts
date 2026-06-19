// ============================================================
// paper/paper.js — 纸张（一页打印纸）
// ============================================================

import { hinnn } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { KuPrintlib } from "../core/lib.js";
import { PrintReferenceElement } from "../table/row.js";
import { PanelEntity } from "../manager/element-type-manager.js";
import PrintElementOptionItemManager from "../options/manager.js";

var Paper = (function () {
  function Paper(
    templateId,
    mmwidth,
    mmheight,
    paperHeader,
    paperFooter,
    paperNumberLeft,
    paperNumberTop,
    paperNumberDisabled,
    paperNumberFormat,
    index,
    referenceElement,
  ) {
    this.defaultPaperNumberFormat = "paperNo-paperCount";
    this.printLine = 0;
    this.templateId = templateId;
    this.width = hinnn.mm.toPt(mmwidth);
    this.height = hinnn.mm.toPt(mmheight);
    this.mmwidth = mmwidth;
    this.mmheight = mmheight;
    this.paperHeader = paperHeader;
    this.paperFooter = paperFooter;
    this.contentHeight = paperFooter - paperHeader;
    this.createTarget();
    this.index = index;
    this.paperNumberLeft = paperNumberLeft || parseInt((this.width - 30).toString());
    this.paperNumberTop = paperNumberTop || parseInt((this.height - 22).toString());
    this.paperNumberDisabled = paperNumberDisabled;
    this.paperNumberFormat = paperNumberFormat;
    this.referenceElement = referenceElement
      ? $.extend({}, referenceElement)
      : new PrintReferenceElement({
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          bottomInLastPaper: 0,
          beginPrintPaperIndex: 0,
          printTopInPaper: 0,
          endPrintPaperIndex: 0,
        });
  }
  Paper.prototype.subscribePaperBaseInfoChanged = function (fn) {
    this.onPaperBaseInfoChanged = fn;
  };
  Paper.prototype.triggerOnPaperBaseInfoChanged = function () {
    if (this.onPaperBaseInfoChanged) {
      this.onPaperBaseInfoChanged({
        paperHeader: this.paperHeader,
        paperFooter: this.paperFooter,
        paperNumberLeft: this.paperNumberLeft,
        paperNumberTop: this.paperNumberTop,
        paperNumberDisabled: this.paperNumberDisabled,
        paperNumberFormat: this.paperNumberFormat,
      });
    }
  };
  Paper.prototype.setFooter = function (first, even, odd, last) {
    this.firstPaperFooter = first;
    this.evenPaperFooter = even;
    this.oddPaperFooter = odd;
    this.lastPaperFooter = last;
  };
  Paper.prototype.setOffset = function (left, top) {
    this.setLeftOffset(left);
    this.setTopOffset(top);
  };
  Paper.prototype.setLeftOffset = function (v) {
    if (v) this.paperContentTarget.css("left", v + "pt");
    else this.paperContentTarget[0].style.left = "";
  };
  Paper.prototype.setTopOffset = function (v) {
    if (v) this.paperContentTarget.css("top", v + "pt");
    else this.paperContentTarget[0].style.top = "";
  };
  Paper.prototype.createTarget = function () {
    this.target = $(
      '<div class="kuprint-printPaper"><div class="kuprint-printPaper-content"></div></div>',
    );
    this.paperContentTarget = this.target.find(".kuprint-printPaper-content");
    this.target.css("width", this.mmwidth + "mm");
    this.target.css(
      "height",
      this.mmheight - (KuPrintConfig as any).instance.paperHeightTrim + "mm",
    );
    this.target.attr("original-height", this.mmheight);
  };
  Paper.prototype.createHeaderLine = function () {
    var self = this;
    this.headerLineTarget = $(
      '<div class="kuprint-headerLine" style="position:absolute;width:100%;border-top:1px dashed #c9bebe;height:7pt;"></div>',
    );
    this.headerLineTarget.css("top", (this.paperHeader || -1) + "pt");
    if (this.paperHeader === 0) this.headerLineTarget.addClass("hideheaderLinetarget");
    this.paperContentTarget.append(this.headerLineTarget);
    this.dragHeadLineOrFootLine(this.headerLineTarget, function (x, y) {
      self.paperHeader = y;
      self.triggerOnPaperBaseInfoChanged();
    });
  };
  Paper.prototype.createFooterLine = function () {
    var self = this;
    this.footerLineTarget = $(
      '<div class="kuprint-footerLine" style="position:absolute;width:100%;border-top:1px dashed #c9bebe;height:7pt;"></div>',
    );
    this.footerLineTarget.css("top", parseInt(this.paperFooter.toString()) + "pt");
    if (this.paperFooter === this.height) {
      this.footerLineTarget.css(
        "top",
        this.mmheight - (KuPrintConfig as any).instance.paperHeightTrim + "mm",
      );
      this.footerLineTarget.addClass("hidefooterLinetarget");
    }
    this.paperContentTarget.append(this.footerLineTarget);
    this.dragHeadLineOrFootLine(this.footerLineTarget, function (x, y) {
      self.paperFooter = y;
      self.triggerOnPaperBaseInfoChanged();
    });
  };
  Paper.prototype.createPaperNumber = function (text) {
    var self = this;
    var existing = this.target.find(".kuprint-paperNumber");
    if (existing.length) {
      existing.html(text);
      return existing;
    }
    var $num = $('<span class="kuprint-paperNumber" style="position:absolute">' + text + "</span>");
    $num.css("top", this.paperNumberTop + "pt");
    $num.css("left", this.paperNumberLeft + "pt");
    this.paperContentTarget.append($num);
    this.dragHeadLineOrFootLine(
      $num,
      function (x, y) {
        self.paperNumberTop = y;
        self.paperNumberLeft = x;
        self.triggerOnPaperBaseInfoChanged();
      },
      true,
    );
    return $num;
  };
  Paper.prototype.getTarget = function () {
    return this.target;
  };
  Paper.prototype.append = function (el) {
    this.paperContentTarget.append(el);
  };
  Paper.prototype.updateReferenceElement = function (ref) {
    if (ref) this.referenceElement = ref;
  };
  Paper.prototype.updatePrintLine = function (line) {
    if (line >= this.printLine) this.printLine = line;
  };
  Paper.prototype.design = function (opts) {
    var self = this;
    this.createHeaderLine();
    this.createFooterLine();
    this.target.addClass("design");
    this.paperNumberTarget = this.createPaperNumber(this.formatPaperNumber(1, 1));
    this.createRuler();
    this.resetPaperNumber(this.paperNumberTarget);
    $(this.paperNumberTarget).bind("dblclick.kuprint", function () {
      if (self.paperNumberDisabled == null) self.paperNumberDisabled = false;
      self.paperNumberDisabled = !self.paperNumberDisabled;
      self.resetPaperNumber(self.paperNumberTarget);
      self.triggerOnPaperBaseInfoChanged();
    });
    $(this.paperNumberTarget).bind("click.kuprint", function () {
      hinnn.event.trigger("BuildCustomOptionSettingEventKey_" + self.templateId, {
        options: {
          paperNumberFormat: self.paperNumberFormat,
          paperNumberDisabled: self.paperNumberDisabled,
        },
        callback: function (v) {
          self.paperNumberDisabled = !!v.paperNumberDisabled || undefined;
          self.paperNumberFormat = v.paperNumberFormat || undefined;
          self.createPaperNumber(self.formatPaperNumber(1, 1));
          self.resetPaperNumber(self.paperNumberTarget);
          self.triggerOnPaperBaseInfoChanged();
        },
      });
    });
  };
  Paper.prototype.resetPaperNumber = function ($el) {
    if (this.paperNumberDisabled) $el.addClass("kuprint-paperNumber-disabled");
    else $el.removeClass("kuprint-paperNumber-disabled");
  };
  Paper.prototype.updatePaperNumber = function (current, total, toggle) {
    var $num = this.createPaperNumber(this.formatPaperNumber(current, total));
    if (this.paperNumberDisabled) $num.hide();
    else if (toggle && this.index % 2 === 1) {
      $num[0].style.left = "";
      $num.css("right", this.paperNumberLeft + "pt");
    }
  };
  Paper.prototype.formatPaperNumber = function (current, total) {
    var fmt = this.paperNumberFormat || this.defaultPaperNumberFormat;
    return fmt.replace("paperNo", current.toString()).replace("paperCount", total.toString());
  };
  Paper.prototype.dragHeadLineOrFootLine = function ($el, cb, bothAxis) {
    var self = this;
    $el.hidraggable({
      axis: bothAxis ? undefined : "v",
      onDrag: function (e, x, y) {
        cb(x, y);
      },
      moveUnit: "pt",
      minMove: (KuPrintConfig as any).instance.movingDistance,
      onBeforeDrag: function () {
        (KuPrintlib as any).instance.draging = true;
      },
      onStopDrag: function () {
        (KuPrintlib as any).instance.draging = false;
        self.footerLineTarget.removeClass("hidefooterLinetarget");
        self.headerLineTarget.removeClass("hideheaderLinetarget");
      },
    });
  };
  Paper.prototype.resize = function (w, h) {
    this.width = hinnn.mm.toPt(w);
    this.height = hinnn.mm.toPt(h);
    this.mmwidth = w;
    this.mmheight = h;
    this.target.css("width", w + "mm");
    this.target.css("height", h - (KuPrintConfig as any).instance.paperHeightTrim + "mm");
    this.target.attr("original-height", this.mmheight);
    this.paperFooter = this.height;
    this.footerLineTarget.css("top", this.height + "pt");
    this.contentHeight = this.paperFooter - this.paperHeader;
    this.paperNumberLeft = parseInt((this.width - 30).toString());
    this.paperNumberTop = parseInt((this.height - 22).toString());
    this.paperNumberTarget.css("top", this.paperNumberTop + "pt");
    this.paperNumberTarget.css("left", this.paperNumberLeft + "pt");
    this.triggerOnPaperBaseInfoChanged();
  };
  Paper.prototype.getPaperFooter = function (pageOffset) {
    var idx = this.index + pageOffset;
    if (idx === 0) return this.firstPaperFooter || this.oddPaperFooter || this.paperFooter;
    if (idx % 2 === 0) return this.oddPaperFooter || this.paperFooter;
    if (idx % 2 === 1) return this.evenPaperFooter || this.paperFooter;
  };
  Paper.prototype.getContentHeight = function (pageOffset) {
    return this.getPaperFooter(pageOffset) - this.paperHeader;
  };
  Paper.prototype.createRuler = function () {
    this.target.append(
      '<div class="kuprint_rul_wrapper">' +
        '<img class="h_img" src="data:image/png;base64,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" />' +
        '<img class="v_img" src="data:image/png;base64,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9X6eqmP080QdMz9Prcfo56n1GP08UcfMzxN1bN1vT1sfvAtmztM+TPh2MsUAI9/g+OqMOgj2ybUbWok6GHTtD/C3BZFUHdyAa2MMEnW0NpE8rjjx5WdA0nXQd9pE+1mTRB0E++TajepEHf3n1arjatbHUQdwjHxjNR3Q5nH/kz70uemC1XXM6sE2rR7HxhXR+p6qo+030nT07fRxhUek66Df9J820XwvsR5safefw4k66C/tvXzuNh39WGuvSdBBv5kXHINUHWxpp9ejjSuC/WQdbR8SdfTt9HE1+nmijr7PBJpS68GWdvPzVB178cFRR/8atrQTdND33s9TdbClnV6P0c+TdbR9SNTRt9PH1ejniTrod/MKon1upekAtrSbn6fq2IsPznS088XGajr+Z/YiRB1roY61UMdaqGMt1LEW6lgLdayFOtZCHWuhjrVQx1qoYy3UsRbqWAt1rIU61kIda6GOtVDHWtzxb6CLiIiIiIiIiIiIiIiIiIgU9x22e+CPh2066lgLdayFOtZCHWuhjrVQx1qoYy3UsRbqWAt1rIU61kIda6GOtVDHWqhjLdSxFupYC3WshTqW4dat/wKB2hwSL8nDjQAAAABJRU5ErkJggg==" />' +
        "</div>",
    );
  };
  Paper.prototype.displayHeight = function () {
    return this.mmheight - (KuPrintConfig as any).instance.paperHeightTrim + "mm";
  };
  Paper.prototype.displayWidth = function () {
    return this.mmwidth + "mm";
  };
  Paper.prototype.getPanelTarget = function () {
    return this.target.parent(".kuprint-printPanel");
  };
  return Paper;
})();

// ============================================================
// TemplateEntity (DTO)
// ============================================================
var TemplateEntity = function (t) {
  if (t) {
    if (t.panels) {
      this.panels = [];
      for (var i = 0; i < t.panels.length; i++) {
        this.panels.push(new PanelEntity(t.panels[i]));
      }
    } else {
      this.panels = [];
    }
  }
};

// ============================================================
// OptionSettingPanel
// ============================================================
var OptionSettingPanel = (function () {
  function OptionSettingPanel(template, container) {
    var self = this;
    this.printElementOptionSettingPanel = {};
    this.printTemplate = template;
    this.settingContainer = $(container);
    hinnn.event.on(template.getPrintElementSelectEventKey(), function (e) {
      self.buildSetting(e);
    });
    hinnn.event.on(template.getBuildCustomOptionSettingEventKey(), function (e) {
      self.buildSettingByCustomOptions(e);
    });
  }
  OptionSettingPanel.prototype.init = function () {};
  OptionSettingPanel.prototype.buildSetting = function (opts) {
    var self = this;
    var printElement = opts.printElement;
    var customOpts = opts.customOptionsInput;
    if (this.lastPrintElement) {
      this.lastPrintElement.getPrintElementOptionItems().forEach(function (item) {
        item.destroy();
      });
    }
    this.lastPrintElement = undefined;
    this.settingContainer.html("");
    var $container = $('<div class="kuprint-option-items"></div>');
    printElement.getPrintElementOptionItems().forEach(function (item) {
      item.submit = function () {
        printElement.submitOption();
      };
      var target = item.createTarget(
        printElement,
        printElement.options,
        printElement.printElementType,
      );
      self.printElementOptionSettingPanel[item.name] = target;
      $container.append(target);
      item.setValue(
        printElement.options[item.name],
        printElement.options,
        printElement.printElementType,
      );
    });
    var $submit = $(
      '<button class="kuprint-option-item-settingBtn kuprint-option-item-submitBtn" type="button">确定</button>',
    );
    var $delete = $(
      '<button class="kuprint-option-item-settingBtn kuprint-option-item-deleteBtn" type="button">删除</button>',
    );
    $container.append($submit).append($delete);
    $submit.bind("click.submitOption", function () {
      printElement.submitOption();
    });
    $delete.bind("click.deleteBtn", function () {
      self.printTemplate.deletePrintElement(printElement);
    });
    $container.find(".auto-submit").change(function () {
      printElement.submitOption();
    });
    $container.find(".auto-submit:input").bind("keydown.submitOption", function (e) {
      if (e.keyCode === 13) printElement.submitOption();
    });
    this.settingContainer.append($container);
    if (customOpts) {
      customOpts.forEach(function (custOpt) {
        var origCb = custOpt.callback;
        custOpt.callback = function (v) {
          if (origCb) {
            origCb(v);
            printElement.submitOption();
          }
        };
        self.buildSettingByCustomOptions(custOpt, self.settingContainer);
      });
    }
    this.lastPrintElement = printElement;
  };
  OptionSettingPanel.prototype.buildSettingByCustomOptions = function (opts, container) {
    var self = this;
    if (this.lastPrintElement) {
      this.lastPrintElement.getPrintElementOptionItems().forEach(function (item) {
        item.destroy();
      });
    }
    this.lastPrintElement = undefined;
    var $ct = container || this.settingContainer;
    if (!container) this.settingContainer.html("");
    var items = [];
    if (opts.optionItems) {
      items = opts.optionItems;
    } else {
      Object.keys(opts.options).forEach(function (k) {
        var item = PrintElementOptionItemManager.getItem(k);
        if (item) items.push(item);
      });
    }
    var $wrapper = $('<div class="kuprint-option-items"></div>');
    if (opts.title) {
      $wrapper.append(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label kuprint-option-title">' +
          opts.title +
          "</div></div>",
      );
    }
    items.forEach(function (item) {
      item.submit = function () {
        opts.callback(self.getValueByOptionItems(items));
      };
      $wrapper.append(item.createTarget(undefined, opts.options, undefined));
      item.setValue(opts.options[item.name], opts.options, undefined);
    });
    var $submit = $(
      '<button class="kuprint-option-item-settingBtn kuprint-option-item-submitBtn" type="button">确定</button>',
    );
    $wrapper.append($submit);
    $submit.bind("click.submitOption", function () {
      opts.callback(self.getValueByOptionItems(items));
    });
    $wrapper.find(".auto-submit").change(function () {
      opts.callback(self.getValueByOptionItems(items));
    });
    $wrapper.find(".auto-submit:input").bind("keydown.submitOption", function (e) {
      if (e.keyCode === 13) opts.callback(self.getValueByOptionItems(items));
    });
    $ct.append($wrapper);
  };
  OptionSettingPanel.prototype.getValueByOptionItems = function (items) {
    var obj = {};
    items.forEach(function (item) {
      obj[item.name] = item.getValue();
    });
    return obj;
  };
  return OptionSettingPanel;
})();

// ============================================================
// PaginationCreator
// ============================================================
var PaginationCreator = (function () {
  interface TPAPER {
    [key: string]: any;
  }
  function PaginationCreator(container, template) {
    this.paginationContainer = container;
    this.$container = $(this.paginationContainer);
    this.template = template;
  }
  PaginationCreator.prototype.buildPagination = function () {
    var total = this.template.getPaneltotal();
    var self = this;
    this.$container.html("");
    var $ul = $('<ul class="kuprint-pagination"></ul>');
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var $li = $("<li><span>" + (idx + 1) + '</span><a href="javascript:void(0);">x</a></li>');
        $li.find("span").click(function () {
          self.template.selectPanel(idx);
          $li.removeClass("selected");
          $(this).parent("li").addClass("selected");
        });
        $li.find("a").click(function () {
          self.template.deletePanel(idx);
          self.buildPagination();
        });
        $ul.append($li);
      })(i);
    }
    var $add = $("<li><span>+</span></li>");
    $ul.append($add);
    this.$container.append($ul);
    $add.click(function () {
      self.template.addPrintPanel(undefined, true);
      self.buildPagination();
    });
  };
  return PaginationCreator;
})();

export { Paper, PaginationCreator, TemplateEntity, OptionSettingPanel };

// ============================================================
// PrintTemplate - The main template class
// ============================================================
