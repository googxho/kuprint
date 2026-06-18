// ============================================================
// elements/table-custom-option.js — 自定义表格选项
// TableCustomPrintElementOption 继承 PrintElementOption
// ============================================================

var TableCustomPrintElementOption = (function (_super) {
    __extends(TableCustomPrintElementOption, _super);
    function TableCustomPrintElementOption(opts) {
        var self = _super.call(this, opts) || this;
        opts = opts || {};
        if (opts.columns) {
            self.columns = [];
            opts.columns.forEach(function (layer) { self.columns.push(new TableColumnRow(layer)); });
        } else {
            self.columns = [new TableColumnRow({
                columns: [new TableColumnFull({ width: 100 }), new TableColumnFull({ width: 100 })]
            })];
        }
        self.lHeight = opts.lHeight;
        self.autoCompletion = opts.autoCompletion;
        self.tableFooterRepeat = opts.tableFooterRepeat;
        return self;
    }
    TableCustomPrintElementOption.prototype.getPrintElementOptionEntity = function () {
        var entity = _super.prototype.getPrintElementOptionEntity.call(this);
        entity.columns = [];
        this.columns.forEach(function (layer) { entity.columns.push(layer.getPrintElementOptionEntity()); });
        return entity;
    };
    return TableCustomPrintElementOption;
})(PrintElementOption);
