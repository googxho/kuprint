// ============================================================
// table/table-custom.js — 自定义表格元素
// ============================================================

import { __extends, hinnn } from "../core/utils.js";
import { KuPrintConfig } from "../core/config.js";
import { KuPrintlib } from "../core/lib.js";
import { BasePrintElement } from "../core/base-print-element.js";
import { TableCustomPrintElementOption } from "../elements/table-custom-option.js";
import { TableColumnRow, TableColumnFull, PaperHtmlResult, PrintReferenceElement } from "./row.js";
import TableExcelHelper from "./excel-helper.js";
import { HiTale } from "./hitable.js";

const KLIB = KuPrintlib as any;
const KCFG = KuPrintConfig as any;

// --- TableCustomPrintElement ---
var TableCustomPrintElement = (function (_super) {
  interface TTABLE_CUSTOM {
    [key: string]: any;
  }
  __extends(TableCustomPrintElement, _super);
  function TableCustomPrintElement(this: any, pte: any, opts: any) {
    var self = _super.call(this, pte) || this;
    self.options = new (TableCustomPrintElementOption as any)(opts);
    self.options.setDefault(
      new (TableCustomPrintElementOption as any)(
        KCFG.instance.tableCustom.default,
      ).getPrintElementOptionEntity(),
    );
    self.columns = self.options.columns;
    return self;
  }
  TableCustomPrintElement.prototype.updateDesignViewFromOptions = function () {
    if (this.designTarget) {
      this.css(this.designTarget, this.getData());
      var content = this.designTarget.find(".kuprint-printElement-table-content");
      var html = this.getHtml(this.designPaper);
      content.html("");
      content.append(html[0].target.find(".kuprint-printElement-tableTarget"));
      this.setHiResizeable();
    }
  };
  TableCustomPrintElement.prototype.getDesignTarget = function (paper) {
    var self = this;
    this.designTarget = this.getHtml(paper)[0].target;
    this.designPaper = paper;
    this.designTarget.click(function () {
      hinnn.event.trigger(self.getPrintElementSelectEventKey(), { printElement: self });
    });
    this.designTarget.find("td").hidroppable({
      accept: ".rn-draggable-item",
      onDrop: function () {},
      onDragEnter: function (e, el) {
        $(el).removeClass("rn-draggable-item");
      },
      onDragLeave: function (e, el) {
        $(el).addClass("rn-draggable-item");
      },
    });
    return this.designTarget;
  };
  TableCustomPrintElement.prototype.getConfigOptions = function () {
    return KCFG.instance.tableCustom;
  };
  TableCustomPrintElement.prototype.createTarget = function (title, data, n) {
    var $el = $(
      '<div class="kuprint-printElement kuprint-printElement-table" style="position:absolute;">' +
        '<div class="kuprint-printElement-table-handle"></div>' +
        '<div class="kuprint-printElement-table-content" style="height:100%;width:100%"></div></div>',
    );
    $el.find(".kuprint-printElement-table-content").append(this.getTableHtml(data, n));
    return $el;
  };
  TableCustomPrintElement.prototype.getTableHtml = function (data, templateData) {
    var table = $(
      '<table class="kuprint-printElement-tableTarget" style="border-collapse:collapse;width:100%;"></table>',
    );
    table.append(TableExcelHelper.createTableHead(this.columns, this.options.getWidth()));
    table.append(
      TableExcelHelper.createTableRow(this.columns, data, this.options, this.printElementType),
    );
    var footerFn = this.printElementType.footerFormatter;
    if (footerFn) {
      if (this.options.tableFooterRepeat === "no") {
      } else if (this.options.tableFooterRepeat === "last") {
        table
          .find("tbody")
          .append(
            TableExcelHelper.createTableFooter(
              this.printElementType.columns,
              data,
              this.options,
              this.printElementType,
              templateData,
              data,
            ).html(),
          );
      } else {
        table.append(
          TableExcelHelper.createTableFooter(
            this.printElementType.columns,
            data,
            this.options,
            this.printElementType,
            templateData,
            [],
          ),
        );
      }
    }
    return table;
  };
  TableCustomPrintElement.prototype.getHtml = function (paper, data) {
    this.setCurrenttemplateData(data);
    this.createTempContainer();
    var result = this.getPaperHtmlResult(paper, data);
    this.removeTempContainer();
    return result;
  };
  TableCustomPrintElement.prototype.getPaperHtmlResult = function (paper, data) {
    var results = [];
    var rows = this.getData(data);
    var tableHtml = this.getTableHtml(rows, data);
    var emptyTarget = this.createTarget(this.printElementType.title, [], data);
    if (data) this.updateTargetWidth(emptyTarget);
    else this.updateTargetSize(emptyTarget);
    this.css(emptyTarget, rows);
    this.css(tableHtml, rows);
    this.getTempContainer().html("");
    this.getTempContainer().append(emptyTarget);
    var printTop = this.getBeginPrintTopInPaperByReferenceElement(paper);
    var pageIdx = 0,
      isEnd = false,
      anchorTop;
    while (!isEnd) {
      var extraHeight = 0;
      var footer = paper.getPaperFooter(pageIdx);
      if (pageIdx === 0 && printTop > footer) {
        printTop = printTop - footer + paper.paperHeader;
        results.push(new PaperHtmlResult({ target: undefined, printLine: undefined }));
        pageIdx++;
        extraHeight = paper.getContentHeight(pageIdx) - (printTop - paper.paperHeader);
        footer = paper.getPaperFooter(pageIdx);
      }
      var prevTarget = results.length > 0 ? results[results.length - 1].target : undefined;
      var h =
        extraHeight > 0
          ? extraHeight
          : pageIdx === 0
            ? footer - printTop
            : paper.getContentHeight(pageIdx);
      var rowsResult = this.getRowsInSpecificHeight(
        h,
        emptyTarget,
        tableHtml,
        pageIdx,
        prevTarget,
        data,
      );
      isEnd = rowsResult.isEnd;
      var printLine;
      if (rowsResult.target) {
        rowsResult.target.css("left", this.options.displayLeft());
        rowsResult.target[0].height = "";
      }
      if (pageIdx === 0 || extraHeight > 0) {
        if (rowsResult.target) {
          anchorTop = printTop;
          rowsResult.target.css("top", printTop + "pt");
        }
        printLine =
          isEnd && this.options.lHeight != null
            ? printTop +
              (rowsResult.height > this.options.lHeight ? rowsResult.height : this.options.lHeight)
            : printTop + rowsResult.height;
      } else {
        if (rowsResult.target) {
          anchorTop = paper.paperHeader;
          rowsResult.target.css("top", paper.paperHeader + "pt");
        }
        printLine = paper.paperHeader + rowsResult.height;
      }
      results.push(
        new PaperHtmlResult({
          target: rowsResult.target,
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
  TableCustomPrintElement.prototype.getRowsInSpecificHeight = function (
    availHeight,
    emptyTarget,
    tableHtml,
    pageIdx,
    prevTarget,
    data,
  ) {
    var sourceTbody = tableHtml.find("tbody");
    var availPx = hinnn.pt.toPx(availHeight);
    emptyTarget.find("tbody").html("");
    var currentHeight = emptyTarget.outerHeight();
    var consumedRows = [];
    var result;
    while (true) {
      if (currentHeight <= availPx) {
        if (sourceTbody.find("tr").length === 0) {
          if (prevTarget && this.options.autoCompletion) {
            this.autoCompletion(availPx, emptyTarget);
            currentHeight = emptyTarget.outerHeight();
          }
          result = {
            target: emptyTarget.clone(),
            length: emptyTarget.find("tbody tr").length,
            height: hinnn.px.toPt(currentHeight),
            isEnd: true,
          };
          if (emptyTarget.find("tbody tr").length === 0 && prevTarget) {
            result = { target: undefined, length: 0, height: 0, isEnd: true };
          }
        } else {
          var firstRow = sourceTbody.find("tr:lt(1)");
          emptyTarget.find("tbody").append(firstRow);
          currentHeight = emptyTarget.outerHeight();
          var rowData = firstRow.data("rowData");
          consumedRows.push(rowData);
          if (currentHeight > availPx) {
            sourceTbody.prepend(firstRow);
            consumedRows.pop();
            currentHeight = emptyTarget.outerHeight();
            result = {
              target: emptyTarget.clone(),
              length: emptyTarget.find("tbody tr").length,
              height: hinnn.px.toPt(currentHeight),
              isEnd: false,
            };
          }
        }
      } else {
        result = { target: undefined, length: 0, height: 0, isEnd: false };
      }
      if (result) {
        if (this.printElementType.footerFormatter && emptyTarget.find("tfoot") && result.target) {
          result.target
            .find("tfoot")
            .html(
              TableExcelHelper.createTableFooter(
                this.printElementType.columns,
                this.getData(data),
                this.options,
                this.printElementType,
                data,
                consumedRows,
              ).html(),
            );
        }
        break;
      }
    }
    return result;
  };
  TableCustomPrintElement.prototype.getData = function (data) {
    if (!data) return [{}];
    var val = data[this.getField()];
    return val ? JSON.parse(JSON.stringify(val)) : [];
  };
  TableCustomPrintElement.prototype.autoCompletion = function (availPx, table) {
    var emptyRow = this.getEmptyRowTarget();
    var height = table.outerHeight();
    var lastRow;
    while (availPx > height) {
      lastRow = emptyRow.clone();
      table.find("tbody").append(lastRow);
      height = table.outerHeight();
    }
    if (lastRow) lastRow.remove();
  };
  TableCustomPrintElement.prototype.getEmptyRowTarget = function () {
    return TableExcelHelper.createEmptyRowTarget(this.columns);
  };
  TableCustomPrintElement.prototype.onResize = function (e, h, w, t, l) {
    _super.prototype.updateSizeAndPositionOptions.call(this, l, t, w, h);
    TableExcelHelper.resizeTableCellWidth(this.designTarget, this.columns, this.options.getWidth());
  };
  TableCustomPrintElement.prototype.getReizeableShowPoints = function () {
    return ["s", "e"];
  };
  TableCustomPrintElement.prototype.design = function (opts, paper) {
    var self = this;
    this.designTarget.hidraggable({
      handle: this.designTarget.find(".kuprint-printElement-table-handle"),
      axis: self.options.axis && opts && opts.axisEnabled ? self.options.axis : undefined,
      onDrag: function (e, left, top) {
        self.updateSizeAndPositionOptions(left, top);
        self.createLineOfPosition(paper);
      },
      moveUnit: "pt",
      minMove: KCFG.instance.movingDistance,
      onBeforeDrag: function () {
        KLIB.instance.draging = true;
        self.createLineOfPosition(paper);
      },
      onStopDrag: function () {
        KLIB.instance.draging = false;
        self.removeLineOfPosition();
      },
    });
    this.setHiResizeable();
    this.designTarget.hireizeable({
      showPoints: self.getReizeableShowPoints(),
      noContainer: true,
      onBeforeResize: function () {
        KLIB.instance.draging = true;
      },
      onResize: function (e, h, w, t, l) {
        self.onResize(e, h, w, t, l);
        self.hitable.updateColumnGrips();
        self.createLineOfPosition(paper);
      },
      onStopResize: function () {
        KLIB.instance.draging = false;
        self.removeLineOfPosition();
      },
    });
    this.bingKeyboardMoveEvent(this.designTarget, paper);
  };
  TableCustomPrintElement.prototype.setHiResizeable = function () {
    var self = this;
    this.hitable = new HiTale({
      table: this.designTarget.find("table"),
      rows: this.columns,
      resizeRow: false,
      resizeColumn: true,
      trs: $(this.designTarget).find("tbody tr"),
      handle: this.designTarget.find("table thead"),
      columnDisplayEditable: true,
      columnDisplayIndexEditable: true,
      columnResizable: true,
      columnAlignEditable: true,
      isEnableEdit: true,
      isEnableEditText: true,
      isEnableEditField: true,
      isEnableContextMenu: true,
      isEnableInsertRow: true,
      isEnableDeleteRow: true,
      isEnableInsertColumn: true,
      isEnableDeleteColumn: true,
      isEnableMergeCell: true,
    });
    hinnn.event.on("updateTable" + this.hitable.id, function () {
      self.updateDesignViewFromOptions();
    });
  };
  return TableCustomPrintElement;
})(BasePrintElement);

export { TableCustomPrintElement };
