// ============================================================
// table/hitable.js — HiTale 可编辑表格
// ============================================================

import { hinnn } from "../core/utils.js";
import { KuPrintlib } from "../core/lib.js";
import { IdCreator } from "../core/print-element-option.js";
import { HiCellSelector, TableRowBase } from "./row.js";

var HiTaleOptions = function (opts) {
  this.table = opts.table;
  this.isEnableEdit = opts.isEnableEdit;
  this.trs = opts.trs;
  this.resizeRow = opts.resizeRow;
  this.resizeColumn = opts.resizeColumn;
  this.isEnableEditField = opts.isEnableEditField;
  this.isEnableContextMenu = opts.isEnableContextMenu;
  this.isEnableInsertRow = opts.isEnableInsertRow;
  this.isEnableDeleteRow = opts.isEnableDeleteRow;
  this.isEnableInsertColumn = opts.isEnableInsertColumn;
  this.isEnableDeleteColumn = opts.isEnableDeleteColumn;
  this.isEnableMergeCell = opts.isEnableMergeCell;
  this.columnResizable = opts.columnResizable;
  this.columnAlignEditable = opts.columnAlignEditable;
};

var HiTaleOptionsCoat = (function () {
  function HiTaleOptionsCoat(opts) {
    this.options = new HiTaleOptions(opts);
  }
  HiTaleOptionsCoat.prototype.enableEdit = function () {
    return this.options.isEnableEdit;
  };
  HiTaleOptionsCoat.prototype.disableEdit = function () {
    return this.options.isEnableEdit;
  };
  HiTaleOptionsCoat.prototype.isEnableEdit = function () {
    return this.options.isEnableEdit;
  };
  return HiTaleOptionsCoat;
})();

var CellGridItem = function (opts) {
  this.cell = opts.cell;
  this.link = opts.link;
  this.linkType = opts.linkType;
  this.bottom = opts.bottom;
  this.rightMost = opts.rightMost;
  this.rowLevel = opts.rowLevel;
  this.columnLevel = opts.columnLevel;
  this.indexInTableGridRow = opts.indexInTableGridRow;
  this.indexInTableGridColumn = opts.indexInTableGridColumn;
};

var GridHelper = {
  getLeftTableCell: function (gridRow, idx) {
    var result;
    gridRow.forEach(function (item, i) {
      if (item.cell && i < idx) result = item.cell;
    });
    return result;
  },
  getIndex: function (gridRow, cellId) {
    var result;
    gridRow.forEach(function (item, i) {
      if (item.cell && item.cell.id === cellId) result = i;
    });
    return result;
  },
};

var GripContainer = function (target, grips) {
  this.target = target;
  this.grips = grips;
};
var RowGrip = function (target) {
  this.target = target;
};
var ReconsitutionTableColumns2 = function () {
  this.rowColumns = [];
};

var HiTaleColumnHelper = {
  getColumnsWidth: function (tree, totalWidth) {
    var widths = {};
    var autoW = HiTaleColumnHelper.allAutoWidth(tree);
    tree.rowColumns.forEach(function (col) {
      widths[col.id] = (col.width / autoW) * (totalWidth > 0 ? totalWidth : 0);
    });
    return widths;
  },
  resizeTableCellWeight: function (columns) {
    columns.forEach(function (layer) {
      layer.columns.forEach(function (col) {
        if (col.hasWidth) $(col.getTarget()).css("width", col.width + "pt");
      });
    });
  },
  allAutoWidth: function (tree) {
    var total = 0;
    tree.rowColumns.forEach(function (col) {
      total += col.width;
    });
    return total;
  },
  reconsitutionTableColumnTree: function (columns, existing) {
    var tree = existing || new ReconsitutionTableColumns2();
    for (var i = 0; i < columns.length; i++) {
      tree.totalLayer = i + 1;
      tree[i] = columns[i].columns;
      tree.rowColumns = tree.rowColumns.concat(
        tree[i].filter(function (col) {
          return col.rowspan === columns.length - i;
        }),
      );
    }
    return tree;
  },
};

var HiTresizer = (function () {
  function HiTresizer(hitable) {
    this.signature = "HiTresizer";
    this.hitable = hitable;
    this.rows = hitable.rows;
    this.target = hitable.target;
  }
  HiTresizer.prototype.init = function () {
    this.addResizeRowAndColumn();
    if (this.hitable.optionsCoat.options.resizeColumn) this.createColumnGrips();
    if (this.hitable.optionsCoat.options.resizeRow) this.createRowGrips();
  };
  HiTresizer.prototype.resizeTableCellWidth = function () {
    HiTaleColumnHelper.resizeTableCellWeight(this.rows);
  };
  HiTresizer.prototype.addResizeRowAndColumn = function () {};
  HiTresizer.prototype.createColumnGrips = function () {
    var self = this;
    var grips = [];
    var container = $('<div class="columngrips"/>');
    container.width(this.target.width());
    this.rows.forEach(function (row) {
      row.columns.forEach(function (col, idx) {
        if (col.getTarget().attr("haswidth")) {
          var grip = $('<div class="columngrip"><div class="gripResizer"></div></div>');
          container.append(grip);
          var gripObj = new RowGrip(grip);
          if (grips.length > 0) grips[grips.length - 1].nextGrip = gripObj;
          grips.push(gripObj);
          self.syncGrips(col, gripObj);
          $(grip).hidraggable({
            axis: "h",
            onDrag: function () {},
            moveUnit: "pt",
            minMove: 1,
            onBeforeDrag: function () {
              KuPrintlib.instance.draging = true;
              if (!gripObj.nextGrip) return false;
              self.dragingGrip = gripObj;
              self.dragingGrip.left = parseFloat(
                self.dragingGrip.target.css("left").replace("px", ""),
              );
              gripObj.target.addClass("columngripDraging");
            },
            onStopDrag: function () {
              KuPrintlib.instance.draging = false;
              var newLeft = parseFloat(self.dragingGrip.target.css("left").replace("px", ""));
              var delta = hinnn.px.toPt(newLeft - self.dragingGrip.left);
              gripObj.cell.width = gripObj.cell.width + delta;
              gripObj.nextGrip.cell.width = gripObj.nextGrip.cell.width - delta;
              self.resizeTableCellWidth();
              gripObj.target.removeClass("columngripDraging");
              self.updateColumnGrips();
            },
          });
        }
      });
    });
    this.target.before(container);
    this.cgripContainer = new GripContainer(container, grips);
  };
  HiTresizer.prototype.updateColumnGrips = function () {
    if (this.cgripContainer) {
      this.cgripContainer.target.remove();
      this.createColumnGrips();
    }
  };
  HiTresizer.prototype.updateRowGrips = function () {
    if (this.rgripContainer) {
      this.rgripContainer.target.remove();
      this.createRowGrips();
    }
  };
  HiTresizer.prototype.createRowGrips = function () {
    var self = this;
    var grips = [];
    var container = $('<div class="rowgrips"/>');
    this.rows.forEach(function (row, i) {
      var grip = $('<div class="rowgrip"><div class="gripResizer"></div></div>');
      container.append(grip);
      var gripObj = new RowGrip(grip);
      grips.push(gripObj);
      if (i > 0 && i < self.rows.length) {
        $(grip).hidraggable({
          axis: "v",
          onDrag: function () {},
          moveUnit: "pt",
          minMove: 1,
          onBeforeDrag: function () {
            self.dragingGrip = gripObj;
            self.dragingGrip.top = parseFloat(self.dragingGrip.target.css("top").replace("px", ""));
            gripObj.target.addClass("rowgripDraging");
          },
          onStopDrag: function () {
            var newTop = parseFloat(self.dragingGrip.target.css("top").replace("px", ""));
            var h = hinnn.px.toPt(
              newTop - self.dragingGrip.top + self.rows[i].columns[0].getTarget().height(),
            );
            self.rows[i].columns[0].getTarget().css("height", h + "pt");
            self.syncRowGrips();
            gripObj.target.removeClass("rowgripDraging");
          },
        });
      }
    });
    this.target.before(container);
    this.rgripContainer = new GripContainer(container, grips);
    this.syncRowGrips();
  };
  HiTresizer.prototype.syncGrips = function (cell, grip) {
    var target = cell.getTarget();
    grip.cell = cell;
    grip.target.css({
      left: target.offset().left - this.target.offset().left + target.outerWidth(false),
      height: 30,
    });
  };
  HiTresizer.prototype.syncRowGrips = function () {
    var self = this;
    this.rgripContainer.target.height(this.target.height());
    this.rows.forEach(function (row, i) {
      var td = row.columns[0].getTarget();
      self.rgripContainer.grips[i].target.css({
        top: td.offset().top - self.target.offset().top + td.outerHeight(false),
        width: 30,
      });
    });
  };
  HiTresizer.prototype.addResizerHeadRow = function () {
    this.target.find("thead").prepend("");
  };
  return HiTresizer;
})();

var NoopResizer = {
  init: function () {},
  updateRowGrips: function () {},
  updateColumnGrips: function () {},
};

var HiTale = (function () {
  function HiTale(opts) {
    this.id = IdCreator.createId();
    this.optionsCoat = new HiTaleOptionsCoat(opts);
    this.handle = opts.handle;
    this.target = opts.table;
    this.initRows(opts.rows);
    this.init(opts);
    this.tableCellSelector = new HiCellSelector(this.rows, this.target);
    this.resizer = this.optionsCoat.options.columnResizable ? new HiTresizer(this) : NoopResizer;
    this.resizer.init();
  }
  HiTale.prototype.insertRow = function (pos, cellPos, cls) {
    var startPos = cellPos || this.tableCellSelector.getSingleSelect();
    if (!startPos) return;
    var cell = startPos.cell;
    var row = this.rows[startPos.rowIndex];
    var rowIdx = startPos.rowIndex;
    var grid = this.getCellGrid();
    var newRow = new TableRowBase();
    newRow.init(this.optionsCoat, undefined, row.isHead);
    if (cls) newRow.getTarget().addClass(cls);
    if (pos === "above") {
      grid[rowIdx].forEach(function (item) {
        var target = item.link || item.cell;
        var w = target.width / target.colspan;
        if (item.columnLevel === 0) {
          var c = newRow.createTableCell();
          c.width = w;
          newRow.insertCellToLast(c);
        } else if (item.linkType === "column") {
          item.link.rowspan += 1;
          item.link.getTarget().attr("rowspan", item.link.rowspan);
        }
      });
      this.rows.splice(rowIdx, 0, newRow);
      row.getTarget().before(newRow.getTarget());
      hinnn.event.trigger("newRow" + this.id, newRow);
    } else {
      var bottomIdx = rowIdx + cell.rowspan - 1;
      grid[bottomIdx].forEach(function (item) {
        var target = item.link || item.cell;
        var w = target.width / target.colspan;
        if (item.bottom) {
          var c = newRow.createTableCell();
          c.width = w;
          newRow.insertCellToLast(c);
        } else {
          if (item.cell) {
            item.cell.rowspan += 1;
            item.cell.getTarget().attr("rowspan", item.cell.rowspan);
          }
          if (item.linkType === "column") {
            item.link.rowspan += 1;
            item.link.getTarget().attr("rowspan", item.link.rowspan);
          }
        }
      });
      this.rows.splice(bottomIdx + 1, 0, newRow);
      this.rows[bottomIdx].getTarget().after(newRow.getTarget());
      hinnn.event.trigger("newRow" + this.id, newRow);
    }
  };
  HiTale.prototype.insertColumn = function (pos, cellPos, cls, width) {
    var self = this;
    var allRows = this.rows.concat(this.trRows);
    var startPos = cellPos || this.tableCellSelector.getSingleSelect();
    if (!startPos) return;
    var cell = startPos.cell;
    var rowIdx = startPos.rowIndex;
    var grid = this.getCellGrid(allRows);
    var matches = grid[rowIdx].filter(function (item) {
      return (item.cell && item.cell.id === cell.id) || (item.link && item.link.id === cell.id);
    });
    if (pos === "left") {
      var gridCol = matches[0].indexInTableGridRow;
      grid.forEach(function (row, i) {
        var item = row[gridCol];
        var rightCells = row.filter(function (it, idx) {
          return idx >= gridCol && it.cell;
        });
        if (item.rowLevel === 0) {
          var tr = allRows[i];
          var c = tr.createTableCell();
          if (cls) c.getTarget().addClass(cls);
          if (width != null) c.width = width;
          if (rightCells.length) tr.insertToTargetCellLeft(rightCells[0].cell, c);
          else tr.insertCellToLast(c);
          hinnn.event.trigger("newCell" + self.id, c);
        } else if (item.linkType === "row") {
          item.link.colspan += 1;
          item.link.getTarget().attr("colspan", item.link.colspan);
        }
      });
    } else {
      var rightGridCol = matches[matches.length - 1].indexInTableGridRow;
      grid.forEach(function (row, i) {
        var item = row[rightGridCol];
        var leftCells = row.filter(function (it, idx) {
          return idx <= rightGridCol && it.cell;
        });
        if (item.rightMost) {
          var tr = allRows[i];
          var c = tr.createTableCell();
          if (cls) c.getTarget().addClass(cls);
          if (width != null) c.width = width;
          if (leftCells.length) tr.insertToTargetCellRight(leftCells[leftCells.length - 1].cell, c);
          else tr.insertCellToFirst(c);
          hinnn.event.trigger("newCell" + self.id, c);
        } else {
          if (item.linkType === "row") {
            item.link.colspan += 1;
            item.link.getTarget().attr("colspan", item.link.colspan);
          }
          if (item.cell) {
            item.cell.colspan += 1;
            item.cell.getTarget().attr("colspan", item.cell.colspan);
          }
        }
      });
    }
  };
  HiTale.prototype.deleteRow = function () {
    var self = this;
    var startPos = this.tableCellSelector.getSingleSelect();
    if (!startPos) return;
    var rowIdx = startPos.rowIndex;
    var grid = this.getCellGrid();
    var row = this.rows[rowIdx];
    grid[rowIdx].forEach(function (item, colIdx) {
      if (item.cell) {
        if (item.cell.rowspan === 1) {
          row.removeCell(item.cell);
        } else {
          row.removeCell(item.cell);
          var nextCells = grid[rowIdx + 1].filter(function (it, i) {
            return it.cell && i > colIdx;
          });
          var nextRow = self.rows[rowIdx + 1];
          var c = nextRow.createTableCell(item.cell.rowspan - 1, item.cell.colspan);
          if (nextCells.length) nextRow.insertToTargetCellLeft(nextCells[0].cell, c);
          else nextRow.insertCellToLast(c);
        }
      } else if (item.linkType === "column") {
        item.link.rowspan -= 1;
        item.link.getTarget().attr("rowspan", item.link.rowspan);
      }
    });
    row.getTarget().remove();
    this.rows.splice(rowIdx, 1);
  };
  HiTale.prototype.deleteColums = function () {
    var allRows = this.rows.concat(this.trRows);
    var startPos = this.tableCellSelector.getSingleSelect();
    if (!startPos) return;
    var cell = startPos.cell;
    var rowIdx = startPos.rowIndex;
    var grid = this.getCellGrid(allRows);
    var gridCol = grid[rowIdx].filter(function (item) {
      return (item.cell && item.cell.id === cell.id) || (item.link && item.link.id === cell.id);
    })[0].indexInTableGridRow;
    grid.forEach(function (row, i) {
      var item = row[gridCol];
      if (item.cell) {
        if (item.cell.colspan === 1) allRows[i].removeCell(item.cell);
        else {
          item.cell.colspan -= 1;
          item.cell.getTarget().attr("colspan", item.cell.colspan);
        }
      } else if (item.linkType === "row") {
        item.link.colspan -= 1;
        item.link.getTarget().attr("colspan", item.link.colspan);
      }
    });
  };
  HiTale.prototype.mergeCell = function () {
    var self = this;
    var cells = this.tableCellSelector.getSelectedCells();
    if (!cells.length) return;
    var first = cells[0][0].cell;
    cells.forEach(function (row, r) {
      row.forEach(function (pos, c) {
        if (r === 0) {
          if (c !== 0) {
            first.colspan += pos.cell.colspan;
            self.rows[pos.rowIndex].removeCell(pos.cell);
          }
        } else {
          self.rows[pos.rowIndex].removeCell(pos.cell);
        }
        if (c === 0 && cells[0][0].rowIndex + first.rowspan - 1 < pos.rowIndex) {
          first.rowspan += pos.cell.rowspan;
        }
      });
    });
    first.getTarget().attr("colspan", first.colspan);
    first.getTarget().attr("rowspan", first.rowspan);
    this.tableCellSelector.setSingleSelect(cells[0][0]);
  };
  HiTale.prototype.splitCell = function () {
    var startPos = this.tableCellSelector.getSingleSelect();
    if (!startPos) return;
    var cell = startPos.cell;
    var grid = this.getCellGrid();
    var gridCol = GridHelper.getIndex(grid[startPos.rowIndex], cell.id);
    for (var i = startPos.rowIndex; i < startPos.rowIndex + cell.rowspan; i++) {
      var row = this.rows[i];
      var refCell = i === startPos.rowIndex ? cell : GridHelper.getLeftTableCell(grid[i], gridCol);
      for (var j = 0; j < cell.colspan; j++) {
        if (i === startPos.rowIndex && j === 0) continue;
        if (refCell) row.insertToTargetCellRight(refCell, row.createTableCell());
        else row.insertCellToFirst(row.createTableCell());
      }
    }
    cell.rowspan = 1;
    cell.colspan = 1;
    cell.getTarget().attr("colspan", cell.colspan);
    cell.getTarget().attr("rowspan", cell.rowspan);
  };
  HiTale.prototype.init = function (opts) {
    var self = this;
    $(this.target).addClass("hitable");
    this.optionsCoat.onBeforEdit = function (cell) {
      if (self.optionsCoat.options.onBeforEdit && opts.onBeforEdit(cell) === false) return false;
      if (self.optionsCoat.editingCell) self.optionsCoat.editingCell.endEdit();
      return true;
    };
    $(this.target).mousedown(function () {
      self.optionsCoat.isLeftMouseButtonDown = true;
    });
    $(this.target).mouseup(function () {
      self.optionsCoat.isLeftMouseButtonDown = false;
    });
    this.initContext();
    this.target
      .on("mousemove", function (e) {
        if (e.buttons === 1) self.tableCellSelector.multipleSelectByXY(e.pageX, e.pageY);
      })
      .on("mousedown", function (e) {
        if (e.buttons === 1) self.tableCellSelector.singleSelectByXY(e.pageX, e.pageY);
      });
  };
  HiTale.prototype.initRows = function (rows) {
    var self = this;
    this.trRows = [];
    if (rows) {
      this.rows = rows;
      rows.forEach(function (row, i) {
        row.init(self.optionsCoat, self.target.find("tr:eq(" + i + ")"), true);
      });
      var trs = this.optionsCoat.options.trs;
      if (trs) {
        this.initRowsByTrs(trs).forEach(function (r) {
          self.trRows.push(r);
        });
      }
    } else {
      this.rows = this.initRowsByTrs(this.target.find("tr"));
    }
  };
  HiTale.prototype.initRowsByTrs = function ($trs) {
    var self = this;
    return $trs
      .map(function (i, el) {
        var row = new TableRowBase();
        row.init(self.optionsCoat, $(el));
        return row;
      })
      .get();
  };
  HiTale.prototype.enableEdit = function () {
    this.optionsCoat.enableEdit();
  };
  HiTale.prototype.disableEdit = function () {
    this.optionsCoat.disableEdit();
  };
  HiTale.prototype.getCellGrid = function (rows) {
    var allRows = rows || this.rows;
    var colStep = this.getColumnStep();
    var grid = [];
    allRows.forEach(function (row, rowIdx) {
      row.columns.forEach(function (col, colIdx) {
        for (var r = 0; r < col.colspan; r++) {
          for (var c = 0, found = false; c < colStep && !found; ) {
            if (!grid[rowIdx]) grid[rowIdx] = [];
            if (!grid[rowIdx][c]) {
              grid[rowIdx][c] = new CellGridItem({
                cell: r === 0 ? col : undefined,
                link: r !== 0 ? col : undefined,
                linkType: r > 0 ? "row" : undefined,
                rightMost: r === col.colspan - 1 || undefined,
                bottom: col.rowspan - 1 === 0,
                rowLevel: r,
                columnLevel: 0,
                indexInTableGridRow: c,
                indexInTableGridColumn: rowIdx,
              });
              for (var rr = rowIdx + 1, level = 1; level < col.rowspan; level++) {
                if (!grid[rr]) grid[rr] = [];
                grid[rr][c] = new CellGridItem({
                  cell: undefined,
                  link: col,
                  linkType: r > 0 ? "rowColumn" : "column",
                  rightMost: r === col.colspan - 1 || undefined,
                  bottom: level === col.rowspan - 1,
                  rowLevel: r,
                  columnLevel: level,
                  indexInTableGridRow: c,
                  indexInTableGridColumn: rr,
                });
                rr++;
              }
              found = true;
            }
            c++;
          }
        }
      });
    });
    return grid;
  };
  HiTale.prototype.setAlign = function (align) {
    var pos = this.tableCellSelector.getSingleSelect();
    if (pos) pos.cell.setAlign(align);
  };
  HiTale.prototype.setVAlign = function (valign) {
    var pos = this.tableCellSelector.getSingleSelect();
    if (pos) pos.cell.setVAlign(valign);
  };
  HiTale.prototype.getColumnStep = function (rowIdx) {
    var total = 0;
    if (this.rows.length) {
      this.rows[rowIdx || 0].columns.forEach(function (col) {
        total += col.colspan;
      });
    }
    return total;
  };
  HiTale.prototype.initContext = function () {
    var self = this;
    if (!this.optionsCoat.options.isEnableContextMenu) return false;
    $(this.handle).hicontextMenu({
      menus: [
        {
          text: "在上方插入行",
          enabled: this.optionsCoat.options.isEnableInsertRow,
          disable: function () {
            return !self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.insertRow("above");
            self.resizer.updateRowGrips();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "在下方插入行",
          borderBottom: true,
          enabled: this.optionsCoat.options.isEnableInsertRow,
          disable: function () {
            return !self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.insertRow("below");
            self.resizer.updateRowGrips();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "向左方插入列",
          enabled: this.optionsCoat.options.isEnableInsertColumn,
          disable: function () {
            return !self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.insertColumn("left");
            self.resizer.updateColumnGrips();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "向右方插入列",
          enabled: this.optionsCoat.options.isEnableInsertColumn,
          borderBottom: true,
          disable: function () {
            return !self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.insertColumn("right");
            self.resizer.updateColumnGrips();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "删除行",
          enabled: this.optionsCoat.options.isEnableDeleteRow,
          disable: function () {
            return !self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.deleteRow();
            self.resizer.updateRowGrips();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "删除列",
          borderBottom: true,
          enabled: this.optionsCoat.options.isEnableDeleteColumn,
          disable: function () {
            return !self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.deleteColums();
            self.resizer.updateColumnGrips();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "对齐",
          borderBottom: true,
          enabled: this.optionsCoat.options.columnAlignEditable,
          menus: [
            {
              text: "左",
              callback: function () {
                self.setAlign("left");
              },
            },
            {
              text: "左右居中",
              callback: function () {
                self.setAlign("center");
              },
            },
            {
              text: "右",
              callback: function () {
                self.setAlign("right");
              },
            },
            {
              text: "默认",
              borderBottom: true,
              callback: function () {
                self.setAlign("");
              },
            },
            {
              text: "上",
              callback: function () {
                self.setVAlign("top");
              },
            },
            {
              text: "垂直居中",
              callback: function () {
                self.setVAlign("middle");
              },
            },
            {
              text: "下",
              callback: function () {
                self.setVAlign("bottom");
              },
            },
            {
              text: "默认",
              callback: function () {
                self.setVAlign("");
              },
            },
          ],
        },
        {
          text: "合并单元格",
          enabled: this.optionsCoat.options.isEnableMergeCell,
          disable: function () {
            return self.tableCellSelector.getSingleSelect();
          },
          callback: function () {
            self.mergeCell();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
        {
          text: "解开单元格",
          enabled: this.optionsCoat.options.isEnableMergeCell,
          disable: function () {
            var pos = self.tableCellSelector.getSingleSelect();
            return !pos || (pos.cell.rowspan === 1 && pos.cell.colspan === 1);
          },
          callback: function () {
            self.splitCell();
            hinnn.event.trigger("updateTable" + self.id);
          },
        },
      ].filter(function (m) {
        return m.enabled;
      }),
    });
  };
  HiTale.prototype.getTableWidth = function () {
    return hinnn.px.toPt(this.target.outerWidth(false));
  };
  HiTale.prototype.updateColumnGrips = function () {
    this.resizer.updateColumnGrips();
  };
  HiTale.prototype.updateRowGrips = function () {
    this.resizer.updateRowGrips();
  };
  return HiTale;
})();

export { HiTale };
