// ============================================================
// table/excel-helper.js — Excel/表格渲染辅助
// ============================================================
// 【TableExcelHelper — 表格 HTML 渲染工具】
// 负责将列定义和数据渲染为 HTML 表格（thead/tbody/tfoot）。
// 处理列宽计算、分组、格式化函数、样式函数、表格脚等。
// ============================================================

import { hinnn } from "../core/utils.js";
import { ReconsitutionTableColumns } from "./row.js";
const _RCT = ReconsitutionTableColumns as any;

var TableExcelHelper = {
  createTableHead: function (columns, totalWidth) {
    var tree = TableExcelHelper.reconsitutionTableColumnTree(columns);
    var thead = $("<thead></thead>");
    var colWidths = TableExcelHelper.getColumnsWidth(tree, totalWidth);
    for (var layer = 0; layer < tree.totalLayer; layer++) {
      var tr = $("<tr></tr>");
      tree[layer].forEach(function (col) {
        var td = $("<td></td>");
        if (col.id) td.attr("id", col.id);
        if (col.columnId) td.attr("column-id", col.columnId);
        if (col.align || col.halign) td.css("text-align", col.halign || col.align);
        if (col.vAlign) td.css("vertical-align", col.vAlign);
        if (col.colspan > 1) td.attr("colspan", col.colspan);
        if (col.rowspan > 1) td.attr("rowspan", col.rowspan);
        td.html(col.title);
        if (colWidths[col.id]) {
          col.hasWidth = true;
          col.targetWidth = colWidths[col.id];
          td.attr("haswidth", "haswidth");
          td.css("width", colWidths[col.id] + "pt");
        } else {
          col.hasWidth = false;
        }
        tr.append(td);
      });
      thead.append(tr);
    }
    TableExcelHelper.syncTargetWidthToOption(columns);
    return thead;
  },
  createTableFooter: function (columns, data, options, printElementType, templateData, rows) {
    var tfoot = $("<tfoot></tfoot>");
    var fn = TableExcelHelper.getFooterFormatter(options, printElementType);
    if (fn) tfoot.append(fn(options, data, templateData, rows));
    return tfoot;
  },
  createTableRow: function (columns, data, options, printElementType) {
    var tree = TableExcelHelper.reconsitutionTableColumnTree(columns);
    var tbody = $("<tbody></tbody>");
    var rows = data || [];
    if (printElementType.groupFields && printElementType.groupFields.length) {
      hinnn
        .groupBy(rows, printElementType.groupFields, function (row) {
          var key = {};
          printElementType.groupFields.forEach(function (f) {
            key[f] = row[f];
          });
          return key;
        })
        .forEach(function (group) {
          if (printElementType.groupFormatter) {
            var gtr = $("<tr><td colspan=" + tree.colspan + "></td></tr>");
            gtr.find("td").append(printElementType.groupFormatter(group, options));
            tbody.append(gtr);
          }
          group.rows.forEach(function (row) {
            tbody.append(TableExcelHelper.createRowTarget(tree, row, options, printElementType));
          });
          if (printElementType.groupFooterFormatter) {
            var ftr = $("<tr><td colspan=" + tree.colspan + "></td></tr>");
            ftr.find("td").append(printElementType.groupFooterFormatter(group, options));
            tbody.append(ftr);
          }
        });
    } else {
      rows.forEach(function (row) {
        tbody.append(TableExcelHelper.createRowTarget(tree, row, options, printElementType));
      });
    }
    return tbody;
  },
  createRowTarget: function (tree, rowData, options, printElementType) {
    var tr = $("<tr></tr>");
    tr.data("rowData", rowData);
    tree.rowColumns.forEach(function (col, idx) {
      var td = $("<td></td>");
      if (col.field) td.attr("field", col.field);
      if (col.align) td.css("text-align", col.align);
      if (col.vAlign) td.css("vertical-align", col.vAlign);
      var formatter = TableExcelHelper.getColumnFormatter(col);
      var val = formatter
        ? formatter(rowData[col.field], rowData, idx, options)
        : rowData[col.field];
      td.html(val);
      var styler = TableExcelHelper.getColumnStyler(col);
      if (styler) {
        var style = styler(rowData[col.field], rowData, idx, options);
        if (style)
          Object.keys(style).forEach(function (k) {
            td.css(k, style[k]);
          });
      }
      tr.append(td);
    });
    var rowStyler = TableExcelHelper.getRowStyler(options, printElementType);
    if (rowStyler) {
      var rs = rowStyler(rowData, options);
      if (rs)
        Object.keys(rs).forEach(function (k) {
          tr.css(k, rs[k]);
        });
    }
    return tr;
  },
  createEmptyRowTarget: function (columns) {
    var tree = TableExcelHelper.reconsitutionTableColumnTree(columns);
    var tr = $("<tr></tr>");
    tree.rowColumns.forEach(function (col) {
      var td = $("<td></td>");
      if (col.field) td.attr("field", col.field);
      if (col.align) td.css("text-align", col.align);
      if (col.vAlign) td.css("vertical-align", col.vAlign);
      tr.append(td);
    });
    return tr;
  },
  getColumnsWidth: function (tree, totalWidth) {
    var widths = {};
    var autoW = TableExcelHelper.allAutoWidth(tree);
    var fixedW = TableExcelHelper.allFixedWidth(tree);
    tree.rowColumns.forEach(function (col) {
      if (col.fixed) {
        widths[col.id] = col.width;
      } else {
        var remaining = totalWidth - fixedW;
        widths[col.id] = (col.width / autoW) * (remaining > 0 ? remaining : 0);
      }
    });
    return widths;
  },
  resizeTableCellWidth: function (target, columns, totalWidth) {
    var tree = TableExcelHelper.reconsitutionTableColumnTree(columns);
    var widths = TableExcelHelper.getColumnsWidth(tree, totalWidth);
    target.find("thead tr td[haswidth]").each(function (i, el) {
      var id = $(el).attr("id");
      $(el).css("width", widths[id] + "pt");
    });
  },
  allAutoWidth: function (tree) {
    var total = 0;
    tree.rowColumns.forEach(function (col) {
      total += col.fixed ? 0 : col.width;
    });
    return total;
  },
  allFixedWidth: function (tree) {
    var total = 0;
    tree.rowColumns.forEach(function (col) {
      total += col.fixed ? col.width : 0;
    });
    return total;
  },
  reconsitutionTableColumnTree: function (columns: any, existing?: any, n?: any) {
    var tree = existing || new _RCT();
    tree.colspan = 0;
    for (var i = 0; i < columns.length; i++) {
      tree.totalLayer = i + 1;
      tree[i] = columns[i].columns;
      if (i === 0) {
        columns[i].columns.forEach(function (col) {
          tree.colspan += col.colspan;
        });
      }
    }
    tree.rowColumns = TableExcelHelper.getOrderedColumns(tree);
    return tree;
  },
  syncTargetWidthToOption: function (columns) {
    columns.forEach(function (layer) {
      layer.columns.forEach(function (col) {
        if (col.hasWidth) col.width = col.targetWidth;
      });
    });
  },
  getFooterFormatter: function (options, pte) {
    var fn;
    if (pte.footerFormatter) fn = pte.footerFormatter;
    if (options.footerFormatter) {
      try {
        fn = new Function("return (" + options.footerFormatter + ")")();
      } catch (e) {
        console.log(e);
      }
    }
    return fn;
  },
  getRowStyler: function (options, pte) {
    var fn;
    if (pte.rowStyler) fn = pte.rowStyler;
    if (options.rowStyler) {
      try {
        fn = new Function("return (" + options.rowStyler + ")")();
      } catch (e) {
        console.log(e);
      }
    }
    return fn;
  },
  getColumnStyler: function (col) {
    var fn;
    if (col.styler) fn = col.styler;
    if (col.styler2) {
      try {
        fn = new Function("return (" + col.styler2 + ")")();
      } catch (e) {
        console.log(e);
      }
    }
    return fn;
  },
  getColumnFormatter: function (col) {
    var fn;
    if (col.formatter) fn = col.formatter;
    if (col.formatter2) {
      try {
        fn = new Function("return (" + col.formatter2 + ")")();
      } catch (e) {
        console.log(e);
      }
    }
    return fn;
  },
  getOrderedColumns: function (tree) {
    var map = {};
    for (var i = 0; i < tree.totalLayer; i++) {
      tree[i].forEach(function (col) {
        for (var r = 0; r < col.rowspan; r++) {
          var key = i + r;
          if (!map[key]) map[key] = [];
          map[key].push(col);
        }
      });
    }
    return map[tree.totalLayer - 1];
  },
};

export default TableExcelHelper;
