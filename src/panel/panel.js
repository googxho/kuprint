// ============================================================
// panel/panel.js — 设计面板
// ============================================================

import { hinnn } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { KuPrintlib } from "../core/lib.js";
import { Paper } from "../paper/paper.js";
import {
  ElementTypeManager,
  PanelEntity,
  PrintElementTypeCreator,
  MouseRect,
} from "../manager/element-type-manager.js";
import { PrintReferenceElement } from "../table/row.js";

var PrintPanel = (function () {
  function PrintPanel(entity, templateId) {
    this.templateId = templateId;
    this.index = entity.index;
    this.width = entity.width;
    this.height = entity.height;
    this.paperType = entity.paperType;
    this.paperHeader = entity.paperHeader;
    this.paperFooter = entity.paperFooter;
    this.initPrintElements(entity.printElements);
    this.paperNumberLeft = entity.paperNumberLeft;
    this.paperNumberTop = entity.paperNumberTop;
    this.paperNumberDisabled = entity.paperNumberDisabled;
    this.paperNumberFormat = entity.paperNumberFormat;
    this.panelPaperRule = entity.panelPaperRule;
    this.firstPaperFooter = entity.firstPaperFooter;
    this.evenPaperFooter = entity.evenPaperFooter;
    this.oddPaperFooter = entity.oddPaperFooter;
    this.lastPaperFooter = entity.lastPaperFooter;
    this.topOffset = entity.topOffset;
    this.leftOffset = entity.leftOffset;
    this.fontFamily = entity.fontFamily;
    this.orient = entity.orient;
    this.rotate = entity.rotate;
    this.target = this.createTarget();
  }
  PrintPanel.prototype.design = function (opts) {
    var self = this;
    this.orderPrintElements();
    this.designPaper = this.createNewPage(0);
    this.target.html("");
    this.target.append(this.designPaper.getTarget());
    this.droppablePaper(this.designPaper);
    this.designPaper.design(opts);
    this.designPaper.subscribePaperBaseInfoChanged(function (info) {
      self.paperHeader = info.paperHeader;
      self.paperFooter = info.paperFooter;
      self.paperNumberLeft = info.paperNumberLeft;
      self.paperNumberTop = info.paperNumberTop;
      self.paperNumberDisabled = info.paperNumberDisabled;
      self.paperNumberFormat = info.paperNumberFormat;
    });
    this.printElements.forEach(function (pe) {
      self.appendDesignPrintElement(self.designPaper, pe);
      pe.design(opts, self.designPaper);
    });
    this.target.bind("click.kuprint", function () {
      hinnn.event.trigger("BuildCustomOptionSettingEventKey_" + self.templateId, {
        options: {
          panelPaperRule: self.panelPaperRule,
          firstPaperFooter: self.firstPaperFooter,
          evenPaperFooter: self.evenPaperFooter,
          oddPaperFooter: self.oddPaperFooter,
          lastPaperFooter: self.lastPaperFooter,
          leftOffset: self.leftOffset,
          topOffset: self.topOffset,
          fontFamily: self.fontFamily,
          orient: self.orient,
          paperNumberFormat: self.paperNumberFormat,
        },
        callback: function (v) {
          self.panelPaperRule = v.panelPaperRule;
          self.firstPaperFooter = v.firstPaperFooter;
          self.evenPaperFooter = v.evenPaperFooter;
          self.oddPaperFooter = v.oddPaperFooter;
          self.lastPaperFooter = v.lastPaperFooter;
          self.leftOffset = v.leftOffset;
          self.topOffset = v.topOffset;
          self.fontFamily = v.fontFamily;
          self.orient = v.orient;
          self.paperNumberFormat = v.paperNumberFormat;
          self.designPaper.setOffset(self.leftOffset, self.topOffset);
          self.css(self.target);
        },
      });
    });
    this.bindBatchMoveElement();
  };
  PrintPanel.prototype.css = function ($el) {
    if (this.fontFamily) $el.css("fontFamily", this.fontFamily);
  };
  PrintPanel.prototype.getHtml = function (data, opts, existingPapers, parentPanel, jointOpts) {
    var self = this;
    this.orderPrintElements();
    var $container,
      papers = existingPapers || [],
      srcPanel = parentPanel || this,
      lastPaper;
    if (parentPanel) {
      lastPaper = papers[papers.length - 1];
      $container = lastPaper.getPanelTarget();
      lastPaper.updateReferenceElement(
        new PrintReferenceElement({
          top: this.paperHeader,
          left: 0,
          height: 0,
          width: 0,
          bottomInLastPaper: lastPaper.referenceElement.bottomInLastPaper,
          beginPrintPaperIndex: papers.length - 1,
          printTopInPaper: lastPaper.referenceElement.bottomInLastPaper,
          endPrintPaperIndex: papers.length - 1,
        }),
      );
    } else {
      $container = srcPanel.createTarget();
      lastPaper = srcPanel.createNewPage(papers.length);
      papers.push(lastPaper);
      $container.append(lastPaper.getTarget());
    }
    this.printElements
      .filter(function (pe) {
        return !pe.isFixed() && !pe.isHeaderOrFooter();
      })
      .forEach(function (pe) {
        var chunks = [];
        var prevPaper = papers[papers.length - 1];
        if (prevPaper.referenceElement.isPositionLeftOrRight(pe.options.getTop())) {
          lastPaper = papers[prevPaper.referenceElement.beginPrintPaperIndex];
        } else {
          lastPaper = papers[prevPaper.referenceElement.endPrintPaperIndex];
        }
        chunks = pe.getHtml(lastPaper, data);
        chunks.forEach(function (chunk, i) {
          if (chunk.referenceElement) {
            chunk.referenceElement.endPrintPaperIndex =
              chunk.referenceElement.beginPrintPaperIndex + chunks.length - 1;
          }
          if (i > 0) {
            if (lastPaper.index < papers.length - 1) lastPaper = papers[lastPaper.index + 1];
            else {
              lastPaper = srcPanel.createNewPage(papers.length, lastPaper.referenceElement);
              papers.push(lastPaper);
            }
            $container.append(lastPaper.getTarget());
          }
          if (chunk.target) {
            lastPaper.append(chunk.target);
            lastPaper.updatePrintLine(chunk.printLine);
            pe.onRendered(lastPaper, chunk.target);
          }
          if (i === chunks.length - 1 && chunk.referenceElement)
            lastPaper.updateReferenceElement(chunk.referenceElement);
        });
      });
    if (jointOpts && jointOpts.templates) {
      jointOpts.templates.forEach(function (jt) {
        jt.template.printPanels.forEach(function (panel) {
          panel.getHtml(jt.data || {}, jt.options || {}, papers, self);
        });
      });
    }
    if (!parentPanel) {
      if (this.lastPaperFooter && papers[papers.length - 1].printLine > this.lastPaperFooter) {
        lastPaper = srcPanel.createNewPage(papers.length, lastPaper.referenceElement);
        papers.push(lastPaper);
        $container.append(lastPaper.getTarget());
      }
      if (this.panelPaperRule) {
        if (this.panelPaperRule === "odd" && papers.length % 2 === 0) {
          lastPaper = srcPanel.createNewPage(papers.length, lastPaper.referenceElement);
          papers.push(lastPaper);
          $container.append(lastPaper.getTarget());
        }
        if (this.panelPaperRule === "even" && papers.length % 2 === 1) {
          lastPaper = srcPanel.createNewPage(papers.length, lastPaper.referenceElement);
          papers.push(lastPaper);
          $container.append(lastPaper.getTarget());
        }
      }
      papers.forEach(function (paper) {
        paper.updatePaperNumber(paper.index + 1, papers.length, opts.paperNumberToggleInEven);
        self.fillPaperHeaderAndFooter(paper, data, papers.length);
        if (opts) {
          if (opts.leftOffset != null) paper.setLeftOffset(opts.leftOffset);
          if (opts.topOffset != null) paper.setTopOffset(opts.topOffset);
        }
      });
      $container.prepend(this.getPrintStyle());
    }
    return $container;
  };
  PrintPanel.prototype.resize = function (type, w, h, rotate) {
    this.width = w;
    this.height = h;
    this.paperType = type;
    this.rotate = rotate;
    this.designPaper.resize(w, h);
  };
  PrintPanel.prototype.rotatePaper = function () {
    if (this.rotate == null) this.rotate = false;
    this.rotate = !this.rotate;
    this.resize(this.paperType, this.height, this.width, this.rotate);
  };
  PrintPanel.prototype.getTarget = function () {
    return this.target;
  };
  PrintPanel.prototype.enable = function () {
    this.target.removeClass("hipanel-disable");
  };
  PrintPanel.prototype.disable = function () {
    this.target.addClass("hipanel-disable");
  };
  PrintPanel.prototype.getPanelEntity = function (includeTid) {
    var elements = [];
    this.printElements.forEach(function (pe) {
      elements.push(pe.getPrintElementEntity(includeTid));
    });
    return new PanelEntity({
      index: this.index,
      width: this.width,
      height: this.height,
      paperType: this.paperType,
      paperHeader: this.paperHeader,
      paperFooter: this.paperFooter,
      paperNumberDisabled: !!this.paperNumberDisabled || undefined,
      paperNumberFormat: this.paperNumberFormat || undefined,
      panelPaperRule: this.panelPaperRule || undefined,
      paperNumberLeft: this.paperNumberLeft,
      paperNumberTop: this.paperNumberTop,
      printElements: elements,
      rotate: this.rotate,
      firstPaperFooter: this.firstPaperFooter,
      evenPaperFooter: this.evenPaperFooter,
      oddPaperFooter: this.oddPaperFooter,
      lastPaperFooter: this.lastPaperFooter,
      topOffset: this.topOffset,
      fontFamily: this.fontFamily,
      orient: this.orient,
      leftOffset: this.leftOffset,
    });
  };
  PrintPanel.prototype.createTarget = function () {
    var $el = $('<div class="kuprint-printPanel panel-index-' + this.index + '"></div>');
    this.css($el);
    return $el;
  };
  PrintPanel.prototype.droppablePaper = function (paper) {
    var self = this;
    paper.getTarget().hidroppable({
      accept: ".ep-draggable-item",
      onDrop: function () {
        var dpe = KuPrintlib.instance.getDragingPrintElement();
        var pe = dpe.printElement;
        pe.updateSizeAndPositionOptions(
          self.mathroundToporleft(dpe.left - hinnn.px.toPt(self.target.offset().left)),
          self.mathroundToporleft(dpe.top - hinnn.px.toPt(self.target.offset().top)),
        );
        pe.setTemplateId(self.templateId);
        pe.setPanel(self);
        self.appendDesignPrintElement(self.designPaper, pe, true);
        self.printElements.push(pe);
        pe.design(undefined, paper);
      },
    });
  };
  PrintPanel.prototype.initPrintElements = function (elements) {
    var self = this;
    this.printElements = [];
    if (elements) {
      elements.forEach(function (el) {
        var pte;
        if (el.printElementType)
          pte = PrintElementTypeCreator.createPrintElementType(el.printElementType);
        else pte = ElementTypeManager.instance.getElementType(el.tid);
        if (pte) {
          var pe = pte.createPrintElement(el.options);
          pe.setTemplateId(self.templateId);
          pe.setPanel(self);
          self.printElements.push(pe);
        } else {
          console.log("miss " + JSON.stringify(el));
        }
      });
    }
  };
  PrintPanel.prototype.mathroundToporleft = function (v) {
    var d = KuPrintConfig.instance.movingDistance;
    return Math.round(v / d) * d;
  };
  PrintPanel.prototype.appendDesignPrintElement = function (paper, pe, initSize) {
    pe.setCurrenttemplateData(undefined);
    var target = pe.getDesignTarget(paper);
    target.addClass("design");
    if (initSize) pe.initSizeByHtml(target);
    paper.append(target);
  };
  PrintPanel.prototype.createNewPage = function (idx, ref) {
    var paper = new Paper(
      this.templateId,
      this.width,
      this.height,
      this.paperHeader,
      this.paperFooter,
      this.paperNumberLeft,
      this.paperNumberTop,
      this.paperNumberDisabled,
      this.paperNumberFormat,
      idx,
      ref,
    );
    paper.setFooter(
      this.firstPaperFooter,
      this.evenPaperFooter,
      this.oddPaperFooter,
      this.lastPaperFooter,
    );
    paper.setOffset(this.leftOffset, this.topOffset);
    return paper;
  };
  PrintPanel.prototype.orderPrintElements = function () {
    this.printElements = hinnn.orderBy(this.printElements, function (pe) {
      return pe.options.getLeft();
    });
    this.printElements = hinnn.orderBy(this.printElements, function (pe) {
      return pe.options.getTop();
    });
  };
  PrintPanel.prototype.fillPaperHeaderAndFooter = function (paper, data, totalPages) {
    this.printElements
      .filter(function (pe) {
        return pe.isFixed() || pe.isHeaderOrFooter();
      })
      .forEach(function (pe) {
        if (pe.showInPage(paper.index, totalPages)) {
          var chunks = pe.getHtml(paper, data);
          if (chunks.length) paper.append(chunks[0].target);
        }
      });
  };
  PrintPanel.prototype.clear = function () {
    this.printElements.forEach(function (pe) {
      if (pe.designTarget && pe.designTarget.length) pe.designTarget.remove();
    });
    this.printElements = [];
  };
  PrintPanel.prototype.insertPrintElementToPanel = function (entity) {
    var pte = this.getPrintElementTypeByEntity(entity);
    if (pte) {
      var pe = pte.createPrintElement(entity.options);
      pe.setTemplateId(this.templateId);
      pe.setPanel(this);
      this.printElements.push(pe);
    }
  };
  PrintPanel.prototype.addPrintText = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "text";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintHtml = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "html";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintTable = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "table";
    if (opts.options && opts.options.columns) {
      var c = $.extend({}, opts.options.columns);
      opts.printElementType.columns = c.columns;
      c.columns = undefined;
    }
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintImage = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "image";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintLongText = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "longText";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintVline = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "vline";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintHline = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "hline";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintRect = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "rect";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.addPrintOval = function (opts) {
    opts.printElementType = opts.printElementType || {};
    opts.printElementType.type = "oval";
    this.insertPrintElementToPanel(opts);
  };
  PrintPanel.prototype.getPrintElementTypeByEntity = function (entity) {
    var pte;
    if (entity.tid) pte = ElementTypeManager.instance.getElementType(entity.tid);
    else pte = PrintElementTypeCreator.createPrintElementType(entity.printElementType);
    if (!pte) console.log("miss " + JSON.stringify(entity));
    return pte;
  };
  PrintPanel.prototype.getPrintStyle = function () {
    return (
      "<style printStyle>@page { border:0; padding:0cm; margin:0cm; " +
      this.getPrintSizeStyle() +
      " }</style>"
    );
  };
  PrintPanel.prototype.getPrintSizeStyle = function () {
    if (this.paperType) {
      return (
        "size:" + this.paperType + " " + (this.height > this.width ? "portrait" : "landscape") + ";"
      );
    }
    return (
      "size:" +
      this.width +
      "mm " +
      this.height +
      "mm " +
      (this.orient ? (this.orient === 1 ? "portrait" : "landscape") : "") +
      ";"
    );
  };
  PrintPanel.prototype.deletePrintElement = function (pe) {
    var self = this;
    for (var i = 0; i < this.printElements.length; i++) {
      if (this.printElements[i].id === pe.id) {
        pe.delete();
        self.printElements.splice(i, 1);
        break;
      }
    }
  };
  PrintPanel.prototype.getElementByTid = function (tid) {
    return this.printElements.filter(function (pe) {
      return pe.printElementType.tid === tid;
    });
  };
  PrintPanel.prototype.getElementByName = function (name) {
    return this.printElements.filter(function (pe) {
      return pe.options.name === name;
    });
  };
  PrintPanel.prototype.getFieldsInPanel = function () {
    var fields = [];
    this.printElements.forEach(function (pe) {
      if (pe.options && pe.options.field) fields.push(pe.options.field);
      else if (pe.printElementType.field) fields.push(pe.printElementType.field);
    });
    return fields;
  };
  PrintPanel.prototype.bindBatchMoveElement = function () {
    var self = this;
    this.designPaper
      .getTarget()
      .on("mousemove", function (e) {
        if (!KuPrintlib.instance.draging && e.buttons === 1 && self.mouseRect) {
          self.mouseRect.updateRect(e.pageX, e.pageY);
          self.updateRectPanel(self.mouseRect);
        }
      })
      .on("mousedown", function (e) {
        if (!KuPrintlib.instance.draging) {
          if (self.mouseRect && self.mouseRect.target) self.mouseRect.target.remove();
          if (e.buttons === 1) {
            self.mouseRect = new MouseRect(
              e.pageX,
              e.pageY,
              KuPrintlib.instance.dragLengthCNum(
                e.pageX - self.designPaper.getTarget().offset().left,
                KuPrintConfig.instance.movingDistance,
              ),
              KuPrintlib.instance.dragLengthCNum(
                e.pageY - self.designPaper.getTarget().offset().top,
                KuPrintConfig.instance.movingDistance,
              ),
            );
          }
        }
      });
  };
  PrintPanel.prototype.getElementInRect = function (rect) {
    var elements = [];
    this.printElements.forEach(function (pe) {
      if (pe.inRect(rect)) elements.push(pe);
    });
    return elements;
  };
  PrintPanel.prototype.updateRectPanel = function (rect) {
    var self = this;
    var paperEl = this.designPaper.getTarget();
    if (!this.mouseRect.target) {
      this.mouseRect.target = $(
        '<div tabindex="1" style="z-index:2;position:absolute;opacity:0.2;border:1px dashed #000;background-color:#31676f;"><span></span></div>',
      );
      paperEl.find(".kuprint-printPaper-content").append(this.mouseRect.target);
      this.mouseRect.target.focus();
      this.bingKeyboardMoveEvent(this.mouseRect.target);
      this.mouseRect.target.hidraggable({
        onDrag: function (e, left, top) {
          self.mouseRect.lastLeft = self.mouseRect.lastLeft || left;
          self.mouseRect.lastTop = self.mouseRect.lastTop || top;
          (self.mouseRect.mouseRectSelectedElement || []).forEach(function (pe) {
            pe.updatePositionByMultipleSelect(
              left - self.mouseRect.lastLeft,
              top - self.mouseRect.lastTop,
            );
          });
          self.mouseRect.lastLeft = left;
          self.mouseRect.lastTop = top;
        },
        moveUnit: "pt",
        minMove: KuPrintConfig.instance.movingDistance,
        onBeforeDrag: function () {
          self.mouseRect.target.focus();
          KuPrintlib.instance.draging = true;
          if (!self.mouseRect.mouseRectSelectedElement)
            self.mouseRect.mouseRectSelectedElement = self.getElementInRect(self.mouseRect);
        },
        onStopDrag: function () {
          KuPrintlib.instance.draging = false;
        },
      });
    }
    this.mouseRect.target.css({
      height: rect.maxY - rect.minY + "px",
      width: rect.maxX - rect.minX + "px",
      left: rect.lastLeft + "pt",
      top: rect.lastTop + "pt",
    });
  };
  PrintPanel.prototype.bingKeyboardMoveEvent = function ($el) {
    var self = this;
    $el.attr("tabindex", "1");
    $el.keydown(function (e) {
      if (!self.mouseRect.mouseRectSelectedElement)
        self.mouseRect.mouseRectSelectedElement = self.getElementInRect(self.mouseRect);
      var selected = self.mouseRect.mouseRectSelectedElement || [];
      switch (e.keyCode) {
        case 37:
          self.mouseRect.updatePositionByMultipleSelect(-KuPrintConfig.instance.movingDistance, 0);
          selected.forEach(function (pe) {
            pe.updatePositionByMultipleSelect(-KuPrintConfig.instance.movingDistance, 0);
          });
          e.preventDefault();
          break;
        case 38:
          self.mouseRect.updatePositionByMultipleSelect(0, -KuPrintConfig.instance.movingDistance);
          selected.forEach(function (pe) {
            pe.updatePositionByMultipleSelect(0, -KuPrintConfig.instance.movingDistance);
          });
          e.preventDefault();
          break;
        case 39:
          self.mouseRect.updatePositionByMultipleSelect(KuPrintConfig.instance.movingDistance, 0);
          selected.forEach(function (pe) {
            pe.updatePositionByMultipleSelect(KuPrintConfig.instance.movingDistance, 0);
          });
          e.preventDefault();
          break;
        case 40:
          self.mouseRect.updatePositionByMultipleSelect(0, KuPrintConfig.instance.movingDistance);
          selected.forEach(function (pe) {
            pe.updatePositionByMultipleSelect(0, KuPrintConfig.instance.movingDistance);
          });
          e.preventDefault();
          break;
      }
    });
  };
  return PrintPanel;
})();

// ============================================================
// Public API functions
// ============================================================

function kuprint_print(data) {
  this.getHtml(data).hiwprint();
}

function kuprint_print2(template, success, error) {
  $.extend({}, template || {}).imgToBase64 = true;
  var t = new PrintTemplate({});
  t.on("printSuccess", success);
  t.on("printError", error);
  t.printByHtml2(this.getHtml(template), template.options);
}

function kuprint_getHtml(opts) {
  var result;
  if (opts && opts.templates) {
    opts.templates.forEach(function (jt) {
      var mergedOpts = $.extend({}, jt.options || {});
      if (opts.imgToBase64) mergedOpts.imgToBase64 = true;
      if (result) result.append(jt.template.getHtml(jt.data, mergedOpts).html());
      else result = jt.template.getHtml(jt.data, mergedOpts);
    });
  }
  return result;
}

function kuprint_init(opts) {
  KuPrintConfig.instance.init(opts);
  KuPrintConfig.instance.providers.forEach(function (provider) {
    provider.addElementTypes(ElementTypeManager.instance);
  });
}

export { PrintPanel, kuprint_print, kuprint_print2, kuprint_getHtml, kuprint_init };

// ============================================================
// jQuery Plugins
// ============================================================
