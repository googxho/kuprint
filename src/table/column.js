// ============================================================
// table/column.js — 表格列定义
// ============================================================
// 【TableColumn / TableColumnFull — 表格列模型】
// TableColumn      基础列（列标题、宽度、colspan/rowspan）
// TableColumnFull  完整列（增加 align、formatter、styler 等）
// TableColumnEntity 列实体 DTO
// 依赖：IdCreator（core/print-element-option.js）
// ============================================================

var TableColumnEntity = function (opts) {
    this.title = opts.title; this.field = opts.field; this.width = opts.width;
    this.align = opts.align; this.halign = opts.halign; this.vAlign = opts.vAlign;
    this.colspan = opts.colspan; this.rowspan = opts.rowspan;
    this.checked = opts.checked; this.columnId = opts.columnId;
    this.formatter2 = opts.formatter2; this.styler2 = opts.styler2;
};

var TableColumn = (function () {
    function TableColumn() { this.id = IdCreator.createId(); }
    TableColumn.prototype.init = function (target, tableOpts, rowId, isHead) {
        this.isHead = isHead; this.rowId = rowId; this.isEditing = false;
        var numRe = /^[0-9]*$/;
        this.target = target; this.tableOptions = tableOpts;
        var cs = this.target.attr("colspan");
        this.colspan = numRe.test(cs) ? parseInt(cs) : 1;
        var rs = this.target.attr("rowspan");
        this.rowspan = numRe.test(rs) ? parseInt(rs) : 1;
        this.initEvent();
        if (this.isHead) this.initInnerElement();
    };
    TableColumn.prototype.beginEdit = function () {
        if (!this.isEditing && this.tableOptions.isEnableEdit && this.tableOptions.onBeforEdit(this)) {
            var val = this.getValue();
            this.editor = EditorFactory.Instance.createEditor("text");
            this.isEditing = true; this.tableOptions.editingCell = this;
            this.target.html(""); this.editor.init(this); this.editor.setValue(val);
        }
    };
    TableColumn.prototype.endEdit = function () {
        this.isEditing = false;
        var val = this.editor.getValue();
        this.editor.destroy(); this.target.html(val);
    };
    TableColumn.prototype.getTarget = function () { return this.target; };
    TableColumn.prototype.getValue = function () { return this.target.html(); };
    TableColumn.prototype.setValue = function () { };
    TableColumn.prototype.initInnerElement = function () {
        this.innerElement = new InnerElementEditor();
        this.innerElement.init(this, this.tableOptions);
    };
    TableColumn.prototype.initEvent = function () { };
    TableColumn.prototype.isXYinCell = function (x, y) {
        return this.isOverlap(new Rect({ x: x, y: y, height: 0, width: 0 }));
    };
    TableColumn.prototype.getTableRect = function () {
        var off = this.target.offset();
        return new Rect({ x: off.left, y: off.top, height: this.target[0].offsetHeight, width: this.target[0].offsetWidth });
    };
    TableColumn.prototype.isOverlap = function (r) {
        var tr = this.getTableRect();
        return r.x + r.width > tr.x && tr.x + tr.width > r.x &&
            r.y + r.height > tr.y && tr.y + tr.height > r.y;
    };
    TableColumn.prototype.isInRect = function (ctx) {
        var r = ctx.rect, tr = this.getTableRect();
        if (r.x + r.width > tr.x && tr.x + tr.width > r.x &&
            r.y + r.height > tr.y && tr.y + tr.height > r.y) {
            var merged = RectHelper.mergeRect(r, tr);
            if (JSON.stringify(r) !== JSON.stringify(merged)) {
                ctx.changed = true; ctx.rect = merged; return true;
            }
        }
        return false;
    };
    TableColumn.prototype.isSelected = function () { return this.target.hasClass("selected"); };
    TableColumn.prototype.select = function () { this.target.addClass("selected"); };
    TableColumn.prototype.isHeader = function () { return false; };
    TableColumn.prototype.setAlign = function (v) {
        this.align = v;
        if (v) this.target.css("text-align", v);
        else this.target[0].style.textAlign = "";
    };
    TableColumn.prototype.setVAlign = function (v) {
        this.vAlign = v;
        if (v) this.target.css("vertical-align", v);
        else this.target[0].style.verticalAlign = "";
    };
    TableColumn.prototype.getEntity = function () { return new TableColumnEntity(this); };
    return TableColumn;
})();
