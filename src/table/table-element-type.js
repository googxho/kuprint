// ============================================================
// table/table-element-type.js — 表格元素类型定义
// 从 table/hitable.js 拆分（关注点分离：UI 与类型注册）
// ============================================================
//   - PrintElementTypeEntity      元素类型实体
//   - TablePrintElementType      表格元素类型
// ============================================================

var PrintElementTypeEntity = function (opts) {
    this.field = opts.field; this.title = opts.title;
    this.type = opts.type; this.columns = opts.columns;
};

var TablePrintElementType = (function () {
    function TablePrintElementType(opts) {
        var self = this;
        this.text = opts.text; this.field = opts.field; this.fields = opts.fields;
        this.title = opts.title; this.tid = opts.tid; this.data = opts.data;
        this.styler = opts.styler; this.formatter = opts.formatter; this.type = opts.type;
        this.options = opts.options; this.editable = opts.editable;
        this.columnDisplayEditable = opts.columnDisplayEditable;
        this.columnDisplayIndexEditable = opts.columnDisplayIndexEditable;
        this.columnTitleEditable = opts.columnTitleEditable;
        this.columnResizable = opts.columnResizable;
        this.columnAlignEditable = opts.columnAlignEditable;
        this.columns = [];
        (opts.columns || []).forEach(function (layer) { self.columns.push(self.createTableColumnArray(layer)); });
        this.rowStyler = opts.rowStyler; this.striped = opts.striped;
        this.groupFields = opts.groupFields || [];
        this.groupFormatter = opts.groupFormatter;
        this.groupFooterFormatter = opts.groupFooterFormatter;
        this.footerFormatter = opts.footerFormatter;
        this.gridColumnsFooterFormatter = opts.gridColumnsFooterFormatter;
        this.columnObj = this.makeColumnObj();
    }
    TablePrintElementType.prototype.getText = function () { return this.text || this.title || ""; };
    TablePrintElementType.prototype.createPrintElement = function (opts) {
        var self = this;
        if (this.columns && this.columns.length === 0) {
            (opts.columns || []).forEach(function (layer) { self.columns.push(self.createTableColumnArray(layer)); });
        }
        return new TablePrintElement(this, opts);
    };
    TablePrintElementType.prototype.getData = function () { return [{}]; };
    TablePrintElementType.prototype.createTableColumnArray = function (cols) {
        var result = [];
        cols.forEach(function (c) { result.push(new TableColumnFull(c)); });
        return result;
    };
    TablePrintElementType.prototype.getPrintElementTypeEntity = function () {
        return new PrintElementTypeEntity({ title: this.title, type: this.type });
    };
    TablePrintElementType.prototype.getFields = function () { return this.fields; };
    TablePrintElementType.prototype.getOptions = function () { return this.options || {}; };
    TablePrintElementType.prototype.getColumnByColumnId = function (id) { return this.columnObj[id]; };
    TablePrintElementType.prototype.makeColumnObj = function () {
        var map = {};
        if (this.columns) {
            this.columns.forEach(function (layer) {
                layer.forEach(function (col) { if (col.columnId) map[col.columnId] = col; });
            });
        }
        return map;
    };
    return TablePrintElementType;
})();
