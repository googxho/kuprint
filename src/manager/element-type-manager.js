// ============================================================
// manager/element-type-manager.js — 元素类型管理系统
// ============================================================
// 【元素类型注册与创建】
//   - ElementTypeManager       类型注册中心（单例）
//   - PrintElementTypeManager  公开 API（静态方法）
//   - PrintElementTypeGroup    类型分组
//   - PrintElementTypeCreator  类型创建工厂
//   - ElementTypeHtmlBuilder   左侧列表 HTML 构建器
//   - BasePrintElementType / SimplePrintElementType /
//     TablePrintElementType / TableCustomPrintElementType
// ============================================================

// ============================================================
// PrintElementFactory (merged from core/print-element-factory.js)
// ============================================================
var PrintElementFactory = {
    createPrintElement: function (pte, opts) {
        switch (pte.type) {
            case "text": return new TextPrintElement(pte, opts);
            case "image": return new ImagePrintElement(pte, opts);
            case "longText": return new LongTextPrintElement(pte, opts);
            case "table": return new TablePrintElement(pte, opts);
            case "html": return new HtmlPrintElement(pte, opts);
            case "vline": return new VlinePrintElement(pte, opts);
            case "hline": return new HlinePrintElement(pte, opts);
            case "rect": return new RectPrintElement(pte, opts);
            case "oval": return new OvalPrintElement(pte, opts);
            default: return undefined;
        }
    }
};

var BasePrintElementType = (function () {
    function BasePrintElementType(opts) {
        this.field = opts.field; this.fields = opts.fields; this.title = opts.title;
        this.text = opts.text; this.tid = opts.tid; this.data = opts.data;
        this.styler = opts.styler; this.formatter = opts.formatter; this.type = opts.type;
        this.onRendered = opts.onRendered; this.options = opts.options;
    }
    BasePrintElementType.prototype.getText = function (forProxy) {
        return forProxy ? (this.title || this.text || "") : (this.text || this.title || "");
    };
    BasePrintElementType.prototype.getData = function () { return this.data; };
    BasePrintElementType.prototype.createPrintElement = function (opts) {
        var o = {};
        $.extend(o, opts || {});
        return PrintElementFactory.createPrintElement(this, o);
    };
    BasePrintElementType.prototype.getPrintElementTypeEntity = function () {
        return new PrintElementTypeEntity({ title: this.title, type: this.type });
    };
    BasePrintElementType.prototype.getFields = function () { return this.fields; };
    BasePrintElementType.prototype.getOptions = function () { return this.options || {}; };
    return BasePrintElementType;
})();

var TableCustomPrintElementType = (function (_super) {
    __extends(TableCustomPrintElementType, _super);
    function TableCustomPrintElementType(opts) { return _super.call(this, opts) || this; }
    TableCustomPrintElementType.prototype.createPrintElement = function (opts) {
        return new TableCustomPrintElement(this, opts);
    };
    return TableCustomPrintElementType;
})(TablePrintElementType);

var SimplePrintElementType = (function (_super) {
    __extends(SimplePrintElementType, _super);
    function SimplePrintElementType(opts) { return _super.call(this, opts) || this; }
    SimplePrintElementType.prototype.createPrintElement = function (opts) {
        var o = {};
        $.extend(o, opts || {});
        return PrintElementFactory.createPrintElement(this, o);
    };
    SimplePrintElementType.prototype.getPrintElementTypeEntity = function () {
        return new PrintElementTypeEntity({ title: this.title, type: this.type });
    };
    return SimplePrintElementType;
})(BasePrintElementType);

var PrintElementTypeCreator = {
    createPrintElementType: function (opts) {
        opts.type = opts.type || "text";
        if (opts.type === "text") return new SimplePrintElementType(opts);
        if (opts.type === "table") return new TablePrintElementType(opts);
        if (opts.type === "tableCustom") return new TableCustomPrintElementType(opts);
        return new BasePrintElementType(opts);
    }
};

// ============================================================
// ElementTypeManager (registry)
// ============================================================
var ElementTypeManager = (function () {
    function ElementTypeManager() { this.allElementTypes = []; }
    Object.defineProperty(ElementTypeManager, "instance", {
        get: function () {
            if (!ElementTypeManager._instance) ElementTypeManager._instance = new ElementTypeManager();
            return ElementTypeManager._instance;
        },
        enumerable: true, configurable: true
    });
    ElementTypeManager.prototype.addPrintElementTypes = function (moduleKey, groups) {
        var self = this;
        if (this[moduleKey]) this[moduleKey] = this[moduleKey].concat(groups);
        else this[moduleKey] = groups;
        groups.forEach(function (group) {
            self.allElementTypes = self.allElementTypes.concat(group.printElementTypes);
        });
    };
    ElementTypeManager.prototype.getElementTypeGroups = function (moduleKey) {
        return this[this.formatterModule(moduleKey)] || [];
    };
    ElementTypeManager.prototype.getElementType = function (tid) {
        var matches = this.allElementTypes.filter(function (et) { return et.tid === tid; });
        return matches.length > 0 ? matches[0] : undefined;
    };
    ElementTypeManager.prototype.formatterModule = function (key) { return key || "_default"; };
    return ElementTypeManager;
})();

// ============================================================
// PrintElementTypeGroup
// ============================================================
var PrintElementTypeGroup = function (name, types) {
    var self = this;
    this.name = name;
    this.printElementTypes = [];
    types.forEach(function (t) { self.printElementTypes.push(PrintElementTypeCreator.createPrintElementType(t)); });
};

// ============================================================
// PrintElementTypeManager (public builder) — must be function (constructor) for API compatibility
// ============================================================
function PrintElementTypeManager() { }
PrintElementTypeManager.getElementTypeGroups = function (moduleKey) {
    var key = PrintElementTypeManager.formatterModule(moduleKey);
    return ElementTypeManager.instance[key] || [];
};
PrintElementTypeManager.getElementType = function (tid, type) {
    if (tid) return ElementTypeManager.instance.getElementType(tid);
    PrintElementTypeCreator.createPrintElementType({ type: type });
    // Note: original returns undefined when tid is falsy (side effect only)
};
PrintElementTypeManager.build = function (container, moduleKey) {
    var key = PrintElementTypeManager.formatterModule(moduleKey);
    var draggableItems = new ElementTypeHtmlBuilder().createPrintElementTypeHtml(container, PrintElementTypeManager.getElementTypeGroups(key));
    PrintElementTypeManager.enableDrag(draggableItems);
};
PrintElementTypeManager.buildByHtml = function (items) { PrintElementTypeManager.enableDrag(items); };
PrintElementTypeManager.enableDrag = function ($items) {
    $items.hidraggable({
        revert: true,
        proxy: function ($el) {
            var dpe = KuPrintlib.instance.getDragingPrintElement();
            var target = dpe.printElement.getProxyTarget(dpe.printElement.printElementType.getOptions());
            target.appendTo("body");
            target.css("z-index", "9999");
            return target;
        },
        moveUnit: "pt", minMove: 4,
        onBeforeDrag: function (e) {
            KuPrintlib.instance.draging = true;
            var pte = PrintElementTypeManager.getElementType(
                $(e.data.target).attr("tid"), $(e.data.target).attr("ptype")
            );
            KuPrintlib.instance.setDragingPrintElement(pte.createPrintElement());
            return true;
        },
        onDrag: function (e, left, top) {
            KuPrintlib.instance.getDragingPrintElement().updatePosition(left, top);
        },
        onStopDrag: function () { KuPrintlib.instance.draging = false; }
    });
};
PrintElementTypeManager.formatterModule = function (key) { return key || "_default"; };

var ElementTypeHtmlBuilder = (function () {
    function ElementTypeHtmlBuilder() { }
    ElementTypeHtmlBuilder.prototype.createPrintElementTypeHtml = function (container, groups) {
        var $ul = $('<ul class="kuprint-printElement-type"></ul>');
        groups.forEach(function (group) {
            var $li = $("<li></li>");
            $li.append('<span class="title">' + group.name + "</span>");
            var $subUl = $("<ul></ul>");
            $li.append($subUl);
            group.printElementTypes.forEach(function (et) {
                $subUl.append('<li><a class="ep-draggable-item" tid="' + et.tid + '">  ' + et.getText() + " </a></li>");
            });
            $ul.append($li);
        });
        $(container).append($ul);
        return $ul.find(".ep-draggable-item");
    };
    return ElementTypeHtmlBuilder;
})();

// ============================================================
// PanelEntity (DTO)
// ============================================================
var PanelEntity = function (opts) {
    this.index = opts.index; this.paperType = opts.paperType;
    if (this.paperType) {
        var ps = KuPrintlib.instance[this.paperType];
        if (opts.height) { this.height = opts.height; this.width = opts.width; }
        else { this.height = ps.height; this.width = ps.width; }
    } else { this.height = opts.height; this.width = opts.width; }
    this.paperHeader = opts.paperHeader || 0;
    this.paperFooter = opts.paperFooter || hinnn.mm.toPt(this.height);
    this.printElements = opts.printElements || [];
    this.paperNumberLeft = opts.paperNumberLeft; this.paperNumberTop = opts.paperNumberTop;
    this.paperNumberDisabled = opts.paperNumberDisabled; this.paperNumberFormat = opts.paperNumberFormat;
    this.panelPaperRule = opts.panelPaperRule; this.rotate = opts.rotate || undefined;
    this.firstPaperFooter = opts.firstPaperFooter; this.evenPaperFooter = opts.evenPaperFooter;
    this.oddPaperFooter = opts.oddPaperFooter; this.lastPaperFooter = opts.lastPaperFooter;
    this.topOffset = opts.topOffset; this.fontFamily = opts.fontFamily;
    this.leftOffset = opts.leftOffset; this.orient = opts.orient;
};

// ============================================================
// MouseRect
// ============================================================
var MouseRect = (function () {
    function MouseRect(x, y, left, top) {
        this.startX = this.minX = x; this.startY = this.minY = y;
        this.maxX = x; this.maxY = y; this.lastLeft = left; this.lastTop = top;
    }
    MouseRect.prototype.updateRect = function (x, y) {
        this.minX = this.startX < x ? this.startX : x;
        this.minY = this.startY < y ? this.startY : y;
        this.maxX = this.startX < x ? x : this.startX;
        this.maxY = this.startY < y ? y : this.startY;
    };
    MouseRect.prototype.updatePositionByMultipleSelect = function (dx, dy) {
        if (dx != null) this.lastLeft = this.lastLeft + dx;
        if (dy != null) this.lastTop = this.lastTop + dy;
        this.target.css({ left: this.lastLeft + "pt", top: this.lastTop + "pt" });
    };
    return MouseRect;
})();

// ============================================================
// Paper - Represents a single page
// ============================================================