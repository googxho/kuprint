// ============================================================
// table/row.js — 表格行定义
// ============================================================
// 【TableRowBase / TableColumnRow — 表格行模型】
// TableRowBase   行基类（单元格管理、插入/删除）
// TableColumnRow 列行（自动表格用，将列定义渲染为表头行）
// ============================================================

import { __extends } from "../core/utils.js";
import { IdCreator } from "../core/print-element-option.js";
import { TableColumn } from "./column.js";

function TableColumnFull(opts) {
  var self = TableColumn.call(this) || this;
  opts = opts || {};
  self.width = opts.width ? parseFloat(opts.width.toString()) : 100;
  self.title = opts.title;
  self.descTitle = opts.descTitle;
  self.field = opts.field;
  self.fixed = opts.fixed;
  self.rowspan = opts.rowspan ? parseInt(opts.rowspan) : 1;
  self.colspan = opts.colspan ? parseInt(opts.colspan) : 1;
  self.align = opts.align;
  self.halign = opts.halign;
  self.vAlign = opts.vAlign;
  self.formatter = opts.formatter;
  self.styler = opts.styler;
  self.formatter2 = opts.formatter2;
  self.styler2 = opts.styler2;
  self.checkbox = opts.checkbox;
  self.checked = opts.checked != 0;
  self.columnId = opts.columnId || opts.field;
  return self;
}
TableColumnFull.prototype.css = function () {};
__extends(TableColumnFull, TableColumn);

// ============================================================
// Module 10: Rect / HiCellSelector
// ============================================================
var Rect = function (opts) {
  this.x = opts.x;
  this.y = opts.y;
  this.height = opts.height;
  this.width = opts.width;
};

var RectWithChanged = function (rect) {
  this.rect = rect;
};
var CellPosition = function (rowIndex, cell) {
  this.rowIndex = rowIndex;
  this.cell = cell;
};

function HiCellSelector(rows, tableTarget) {
  this.selectedCells = [];
  this.rows = rows;
  this.tableTarget = tableTarget;
}
HiCellSelector.prototype.clear = function () {
  this.tableTarget.find("td").removeClass("selected");
};
HiCellSelector.prototype.setSingleSelect = function (cell) {
  this.startCell = cell;
  this.selectedCells = [];
};
HiCellSelector.prototype.getSingleSelect = function () {
  if (this.selectedCells.length) {
    if (this.selectedCells.length === 1) {
      return this.selectedCells[0].length === 1 ? this.selectedCells[0][0] : undefined;
    }
    if (this.selectedCells.length > 1) return undefined;
  }
  return this.startCell;
};
HiCellSelector.prototype.singleSelectByXY = function (x, y) {
  var cell = this.getCellByXY(x, y);
  if (cell) {
    this.clear();
    cell.cell.select();
    this.startCell = cell;
    this.selectedCells = [];
  }
};
HiCellSelector.prototype.multipleSelectByXY = function (x, y) {
  this.clear();
  var result = [];
  if (this.startCell) {
    var endCell = this.getCellByXY(x, y);
    if (endCell) {
      var merged = RectHelper.mergeRect(
        this.startCell.cell.getTableRect(),
        endCell.cell.getTableRect(),
      );
      this.selectByRect(new RectWithChanged(merged), result);
    }
  }
  this.selectedCells = result;
};
HiCellSelector.prototype.selectByRect = function (ctx, result) {
  var self = this;
  this.rows.forEach(function (row, i) {
    var cells = [];
    row.columns.forEach(function (col) {
      if (col.isInRect(ctx)) {
        cells.push(new CellPosition(i, col));
        col.select();
      }
    });
    if (cells.length) result.push(cells);
  });
  if (ctx.changed) {
    ctx.changed = false;
    result.splice(0, result.length);
    self.selectByRect(ctx, result);
  }
};
HiCellSelector.prototype.getSelectedCells = function () {
  return this.selectedCells;
};
HiCellSelector.prototype.getCellByXY = function (x, y) {
  var found;
  this.rows.forEach(function (row, i) {
    var cols = row.columns.filter(function (col) {
      return col.isXYinCell(x, y);
    });
    if (cols.length) found = new CellPosition(i, cols[0]);
  });
  return found;
};

// ============================================================
// RectHelper
// ============================================================
var RectHelper = {
  mergeRect: function (r1, r2) {
    var nx = Math.min(r1.x, r2.x);
    var ny = Math.min(r1.y, r2.y);
    return new Rect({
      x: nx,
      y: ny,
      height: Math.max(r1.y + r1.height, r2.y + r2.height) - ny,
      width: Math.max(r1.x + r1.width, r2.x + r2.width) - nx,
    });
  },
  Rect: function (x1, y1, x2, y2) {
    return {
      minX: x1 < x2 ? x1 : x2,
      minY: y1 < y2 ? y1 : y2,
      maxX: x1 < x2 ? x2 : x1,
      maxY: y1 < y2 ? y2 : y1,
    };
  },
};

// ============================================================
// PaperHtmlResult
// ============================================================
var PaperHtmlResult = function (opts) {
  this.printLine = opts.printLine;
  this.target = opts.target;
  this.referenceElement = opts.referenceElement;
};

// ============================================================
// Module 8: PrintReferenceElement
// ============================================================
function PrintReferenceElement(opts) {
  this.top = opts.top;
  this.left = opts.left;
  this.height = opts.height;
  this.width = opts.width;
  this.bottomInLastPaper = opts.bottomInLastPaper;
  this.beginPrintPaperIndex = opts.beginPrintPaperIndex;
  this.printTopInPaper = opts.printTopInPaper;
  this.endPrintPaperIndex = opts.endPrintPaperIndex;
}
PrintReferenceElement.prototype.isPositionLeftOrRight = function (top) {
  return this.top <= top && this.top + this.height > top;
};

// ============================================================
// Module 13: TableRowBase
// ============================================================
function TableRowBase() {
  this.id = IdCreator.createId();
}
TableRowBase.prototype.init = function (tableOpts, target, isHead) {
  this.isHead = isHead;
  this.target = target || $("<tr></tr>");
  this.tableOptions = tableOpts;
  this.initCells(this.columns);
};
TableRowBase.prototype.getTarget = function () {
  return this.target;
};
TableRowBase.prototype.initCells = function (columns) {
  var self = this;
  if (columns) {
    columns.forEach(function (col, i) {
      col.init(self.target.find("td:eq(" + i + ")"), self.tableOptions, self.id, self.isHead);
    });
  } else {
    this.columns = [];
    this.target.find("td").each(function (i, el) {
      var col = new TableColumn();
      col.init($(el), self.tableOptions, self.id, self.isHead);
      self.columns.push(col);
    });
  }
};
TableRowBase.prototype.removeCell = function (cell) {
  var idx = this.columns.indexOf(cell);
  this.columns[idx].getTarget().remove();
  this.columns.splice(idx, 1);
};
TableRowBase.prototype.createTableCell = function (rowspan, colspan) {
  var cell = new TableColumn();
  cell.init($("<td></td>"), this.tableOptions, this.id, this.isHead);
  if (rowspan > 1) {
    cell.getTarget().attr("rowspan", rowspan);
    cell.rowspan = rowspan;
  }
  if (colspan > 1) {
    cell.getTarget().attr("colspan", colspan);
    cell.colspan = colspan;
  }
  return cell;
};
TableRowBase.prototype.insertToTargetCellLeft = function (refCell, newCell) {
  var idx = this.columns.indexOf(refCell);
  refCell.getTarget().before(newCell.getTarget());
  this.columns.splice(idx, 0, newCell);
};
TableRowBase.prototype.insertToTargetCellRight = function (refCell, newCell) {
  var idx = this.columns.indexOf(refCell);
  this.columns[idx].getTarget().after(newCell.getTarget());
  this.columns.splice(idx + 1, 0, newCell);
};
TableRowBase.prototype.insertCellToFirst = function (cell) {
  this.target.prepend(cell.getTarget());
  this.columns.splice(0, 0, cell);
};
TableRowBase.prototype.insertCellToLast = function (cell) {
  this.columns.push(cell);
  this.target.append(cell.getTarget());
};
TableRowBase.prototype.getPrintElementOptionEntity = function () {
  var result = [];
  this.columns.forEach(function (col) {
    result.push(col.getEntity());
  });
  return result;
};

function TableColumnRow(opts) {
  var self = TableRowBase.call(this) || this;
  self.columns = [];
  if (opts && opts.constructor === Array) {
    (opts || []).forEach(function (c) {
      self.columns.push(new (TableColumnFull as any)(c));
    });
  } else if (opts && opts.columns) {
    (opts.columns || []).forEach(function (c) {
      self.columns.push(new (TableColumnFull as any)(c));
    });
  }
  return self;
}
TableColumnRow.prototype.getPrintElementOptionEntity = function () {
  var result = [];
  this.columns.forEach(function (col) {
    result.push(col.getEntity());
  });
  return result;
};
__extends(TableColumnRow, TableRowBase);

var ReconsitutionTableColumns = function () {
  interface TROW {
    [key: string]: any;
  }
  this.rowColumns = [];
};

function GridColumnsStructure(count, target) {
  this.gridColumns = count;
  this.target = target;
}
GridColumnsStructure.prototype.getByIndex = function (idx) {
  return this.target.find(".hi-grid-col:eq(" + idx + ")");
};

export {
  TableColumnFull,
  Rect,
  RectWithChanged,
  CellPosition,
  HiCellSelector,
  RectHelper,
  PaperHtmlResult,
  PrintReferenceElement,
  TableRowBase,
  TableColumnRow,
  ReconsitutionTableColumns,
  GridColumnsStructure,
};
