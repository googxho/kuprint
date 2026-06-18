// ============================================================
// elements/table-custom-option.js — 自定义表格选项
// TableCustomPrintElementOption 继承 PrintElementOption
// ============================================================

import { __extends } from "../core/utils.js";
import { PrintElementOption } from "../core/print-element-option.js";
import { TableColumnRow, TableColumnFull } from "../table/row.js";

const _PEO = PrintElementOption as any;

// ============================================================
// Types
// ============================================================
interface TTableCustomOption {
  columns: any[];
  lHeight?: number;
  autoCompletion?: boolean;
  tableFooterRepeat?: string;
  [key: string]: any;
  getPrintElementOptionEntity(): any;
}

function TableCustomPrintElementOption(this: TTableCustomOption, opts: any) {
  var self = _PEO.call(this, opts) || this;
  opts = opts || {};
  if (opts.columns) {
    self.columns = [];
    opts.columns.forEach(function (layer) {
      self.columns.push(new (TableColumnRow as any)(layer));
    });
  } else {
    self.columns = [
      new (TableColumnRow as any)({
        columns: [
          new (TableColumnFull as any)({ width: 100 }),
          new (TableColumnFull as any)({ width: 100 }),
        ],
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
