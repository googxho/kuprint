// ============================================================
// elements/table-custom-option.js — 自定义表格选项
// TableCustomPrintElementOption 继承 PrintElementOption
// ============================================================

import { __extends } from "../core/utils.js";
import { PrintElementOption } from "../core/print-element-option.js";
import { TableColumnRow, TableColumnFull } from "../table/row.js";

function TableCustomPrintElementOption(opts) {
  var self = PrintElementOption.call(this, opts) || this;
  opts = opts || {};
  if (opts.columns) {
    self.columns = [];
    opts.columns.forEach(function (layer) {
      self.columns.push(new TableColumnRow(layer));
    });
  } else {
    self.columns = [
      new TableColumnRow({
        columns: [new TableColumnFull({ width: 100 }), new TableColumnFull({ width: 100 })],
      }),
    ];
  }
  self.lHeight = opts.lHeight;
  self.autoCompletion = opts.autoCompletion;
  self.tableFooterRepeat = opts.tableFooterRepeat;
  return self;
}
__extends(TableCustomPrintElementOption, PrintElementOption);
TableCustomPrintElementOption.prototype.getPrintElementOptionEntity = function () {
  var entity = PrintElementOption.prototype.getPrintElementOptionEntity.call(this);
  entity.columns = [];
  this.columns.forEach(function (layer) {
    entity.columns.push(layer.getPrintElementOptionEntity());
  });
  return entity;
};

export { TableCustomPrintElementOption };
