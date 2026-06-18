// ============================================================
// core/print-element-option.js — 元素选项类
// ============================================================
// 【PrintElementOption — 打印元素配置项】
// 管理元素的位置(left/top)、尺寸(width/height)等通用属性。
// 也包含 InnerElementEditor（表格单元格编辑器）、
// IdCreator（ID 生成器）、PrintReferenceElement（参考元素）、
// DragingPrintElement 等辅助类。
// 依赖：KuPrintConfig、KuPrintlib
// ============================================================

var PrintElementOption = (function () {
    var EmptyObj = function () { };
    function PrintElementOption(opts) {
        opts = opts || {};
        this.left = opts.left; this.top = opts.top;
        this.topInDesign = this.top;
        this.height = opts.height; this.width = opts.width;
        this.init(opts);
    }
    PrintElementOption.prototype.setDefault = function (defaults) {
        this.defaultOptions = defaults;
        this.initSize();
    };
    PrintElementOption.prototype.initSize = function () {
        if (!this.width) this.setWidth(this.defaultOptions.width);
        if (!this.height) this.setHeight(this.defaultOptions.height);
    };
    PrintElementOption.prototype.initSizeByHtml = function (w, h) {
        if (!this.width) this.setWidth(w);
        if (!this.height) this.setHeight(h);
    };
    PrintElementOption.prototype.getLeft = function () { return this.left; };
    PrintElementOption.prototype.displayLeft = function () { return this.left + "pt"; };
    PrintElementOption.prototype.setLeft = function (v) { if (v != null) this.left = v; };
    PrintElementOption.prototype.getTop = function () { return this.top; };
    PrintElementOption.prototype.getTopInDesign = function () { return this.topInDesign; };
    PrintElementOption.prototype.displayTop = function () { return this.top + "pt"; };
    PrintElementOption.prototype.setTop = function (v) { if (v != null) this.top = v; };
    PrintElementOption.prototype.copyDesignTopFromTop = function () { this.topInDesign = this.top; };
    PrintElementOption.prototype.getHeight = function () { return this.height; };
    PrintElementOption.prototype.displayHeight = function () { return this.height + "pt"; };
    PrintElementOption.prototype.setHeight = function (v) { if (v != null) this.height = v; };
    PrintElementOption.prototype.getWidth = function () { return this.width; };
    PrintElementOption.prototype.displayWidth = function () { return this.width + "pt"; };
    PrintElementOption.prototype.setWidth = function (v) { if (v != null) this.width = v; };
    PrintElementOption.prototype.getValueFromOptionsOrDefault = function (key) {
        return this[key] == null ? this.defaultOptions[key] : this[key];
    };
    PrintElementOption.prototype.getPrintElementOptionEntity = function () {
        var entity = new EmptyObj();
        var self = this;
        Object.keys(this).filter(function (k) { return k !== "topInDesign"; }).forEach(function (k) {
            if (typeof self[k] === "number" || typeof self[k] === "string" || typeof self[k] === "boolean") {
                entity[k] = self[k];
            }
            if (k === "style") {
                entity.style = {};
                var s = self[k];
                if (s) {
                    Object.keys(s).forEach(function (sk) {
                        if (typeof s[sk] === "number" || typeof s[sk] === "string") entity.style[sk] = s[sk];
                    });
                }
            }
        });
        return entity;
    };
    PrintElementOption.prototype.init = function (opts) {
        var self = this;
        if (opts) Object.keys(opts).forEach(function (k) { self[k] = opts[k]; });
    };
    return PrintElementOption;
})();

// ============================================================
// Module 11: IdCreator
// ============================================================
var IdCreator = { id: 1, createId: function () { this.id += 1; return this.id; } };

// ============================================================
// Module 5: TableColumn
// ============================================================
var InnerElementEditor = (function () {
    function InnerElementEditor() { }
    InnerElementEditor.prototype.init = function (cell, tableOpts) {
        var self = this;
        this.tableOptions = tableOpts;
        this.title = cell.title;
        this.field = cell.field;
        cell.getTarget().unbind("dblclick.hitable").bind("dblclick.hitable", function () {
            cell.isEditing = true;
            self.beginEdit(cell);
        });
    };
    InnerElementEditor.prototype.getDisplayHtml = function () { return this.title; };
    InnerElementEditor.prototype.beginEdit = function (cell) {
        var self = this;
        this.editor = EditorFactory.Instance.createEditor("text");
        cell.getTarget().html("");
        this.editor.init(cell);
        if (this.title || this.field) {
            this.editor.setValue(
                this.tableOptions.options.isEnableEditField
                    ? (this.title || "") + "#" + (this.field || "")
                    : (this.title || "")
            );
        }
        $(this.editor.target).keydown(function (e) { if (e.keyCode === 13) self.endEdit(cell); });
        $(this.editor.target).blur(function () { self.endEdit(cell); });
        if (this.tableOptions.editingCell && this.tableOptions.editingCell.id !== cell.id) {
            this.tableOptions.editingCell.innerElement.endEdit(this.tableOptions.editingCell);
        }
        this.tableOptions.editingCell = cell;
    };
    InnerElementEditor.prototype.endEdit = function (cell) {
        var val = this.editor.getValue();
        if (val) {
            if (this.tableOptions.options.isEnableEditField) {
                var parts = val.split("#");
                cell.title = this.title = parts[0];
                if (parts.length > 1) cell.field = this.field = parts[1];
            } else {
                cell.title = this.title = val;
            }
        } else {
            if (this.tableOptions.options.isEnableEditField) {
                cell.title = this.title = ""; cell.field = this.field = "";
            } else {
                cell.title = this.title = "";
            }
        }
        this.editor.destroy();
        cell.getTarget().html(this.title);
    };
    return InnerElementEditor;
})();

var TextEditor = (function () {
    function TextEditor() { }
    TextEditor.prototype.init = function (cell) {
        this.target = $('<input type="text" class="hitable-editor-text" value="" />');
        cell.getTarget().append(this.target);
        this.target.focus();
    };
    TextEditor.prototype.getValue = function () { return this.target.val(); };
    TextEditor.prototype.setValue = function (v) { this.target.val(v); };
    TextEditor.prototype.destroy = function () { this.target.remove(); };
    return TextEditor;
})();

var EditorFactory = (function () {
    function EditorFactory() { this.text = new TextEditor(); }
    Object.defineProperty(EditorFactory, "Instance", {
        get: function () { return EditorFactory._instance || (EditorFactory._instance = new EditorFactory()); },
        enumerable: true, configurable: true
    });
    EditorFactory.prototype.createEditor = function (type) { return $.extend({}, EditorFactory.Instance[type]); };
    return EditorFactory;
})();
