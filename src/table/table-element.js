// ============================================================
// elements/table-element.js — 表格打印元素
// ============================================================
// 【TablePrintElement — 自动表格打印元素】
//
// 根据数据源自动生成表格。核心能力：
//   - 自动分页（数据超出页面时自动拆分到多页）
//   - 每页自动重复表头
//   - 列配置（选择显示哪些列、列宽、顺序）
//   - 分组显示（groupBy）
//   - 一行多组（gridColumns，如一行显示2列数据）
//   - 表头/表体样式（背景色、字体、边框等）
//   - 表格脚（footerFormatter）
//   - 自动补全空行（autoCompletion）
//
// 包含以下类：
//   - PrintElementEntity       打印元素实体 DTO
//   - TableColumnOptionEntity  表格列选项实体 DTO
//   - TablePrintElementOption  表格元素配置项（继承 PrintElementOption）
//   - TablePrintElement        表格元素（继承 BasePrintElement）
//
// 依赖：BasePrintElement、TableColumn、TableRow、TableExcelHelper、
//       HiTale、KuPrintConfig
// ============================================================

// ============================================================
// Module 18: TablePrintElementOption
// ============================================================
var TableColumnOptionEntity = function (opts) {
    this.width = opts.width; this.title = opts.title; this.columnId = opts.columnId;
    this.fixed = false; this.rowspan = opts.rowspan || 1; this.colspan = opts.colspan || 1;
    this.align = opts.align; this.halign = opts.halign; this.vAlign = opts.vAlign;
    this.formatter2 = opts.formatter2; this.styler2 = opts.styler2;
};

var TablePrintElementOption = (function (_super) {
    __extends(TablePrintElementOption, _super);
    function TablePrintElementOption(opts, pte) {
        var self = _super.call(this, opts) || this;
        opts = opts || {};
        self.lHeight = opts.lHeight;
        self.autoCompletion = opts.autoCompletion;
        self.tableFooterRepeat = opts.tableFooterRepeat;
        if (pte) {
            self.columns = [];
            if (pte.editable && opts.columns && opts.columns.length) {
                opts.columns.forEach(function (layer) {
                    var cols = [];
                    layer.forEach(function (c) {
                        var entity = new TableColumnOptionEntity(c);
                        var existing = pte.getColumnByColumnId(entity.columnId);
                        var col = existing ? $.extend(existing, entity) : new TableColumnFull(entity);
                        col.checked = true;
                        cols.push(col);
                    });
                    self.columns.push(new TableColumnRow(cols));
                });
            } else {
                pte.columns.forEach(function (layer) {
                    self.columns.push(new TableColumnRow(layer.filter(function (c) { return c.checked; })));
                });
            }
        }
        return self;
    }
    TablePrintElementOption.prototype.getColumnByColumnId = function (id) {
        return this.makeColumnObj()[id];
    };
    TablePrintElementOption.prototype.makeColumnObj = function () {
        var map = {};
        if (this.columns) {
            this.columns.forEach(function (layer) {
                layer.columns.forEach(function (col) { if (col.columnId) map[col.columnId] = col; });
            });
        }
        return map;
    };
    TablePrintElementOption.prototype.getGridColumns = function () { return this.gridColumns || 1; };
    TablePrintElementOption.prototype.getPrintElementOptionEntity = function () {
        var entity = _super.prototype.getPrintElementOptionEntity.call(this);
        if (this.columns) {
            entity.columns = [];
            this.columns.forEach(function (layer) {
                var cols = layer.getPrintElementOptionEntity()
                    .filter(function (c) { return c.checked; })
                    .map(function (c) { return new TableColumnOptionEntity(c); });
                entity.columns.push(cols);
            });
        }
        return entity;
    };
    return TablePrintElementOption;
})(PrintElementOption);

// ============================================================
// Module 15: TablePrintElement
// ============================================================
var TablePrintElement = (function (_super) {
    __extends(TablePrintElement, _super);
    function TablePrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.gridColumnsFooterCss = "kuprint-gridColumnsFooter";
        self.tableGridRowCss = "table-grid-row";
        self.options = new TablePrintElementOption(opts, self.printElementType);
        self.options.setDefault(
            new TablePrintElementOption(KuPrintConfig.instance.table.default).getPrintElementOptionEntity()
        );
        return self;
    }
    TablePrintElement.prototype.getColumns = function () { return this.options.columns; };
    TablePrintElement.prototype.getColumnByColumnId = function (id) {
        return this.options.getColumnByColumnId(id);
    };
    TablePrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) {
            this.css(this.designTarget, this.getData());
            var content = this.designTarget.find(".kuprint-printElement-table-content");
            var html = this.getHtml(this.designPaper);
            content.html("");
            content.append(html[0].target.find(".table-grid-row"));
            if (this.printElementType.editable) this.setHitable();
            this.setColumnsOptions();
        }
    };
    TablePrintElement.prototype.css = function ($el, data) {
        if ((this.getField() || !this.options.content) && !this.printElementType.formatter) {
            return _super.prototype.css.call(this, $el, data);
        }
    };
    TablePrintElement.prototype.getDesignTarget = function (paper) {
        this.designTarget = this.getHtml(paper)[0].target;
        this.designPaper = paper;
        this.designTarget.find("td").hidroppable({
            accept: ".rn-draggable-item",
            onDrop: function () { },
            onDragEnter: function (e, el) { $(el).removeClass("rn-draggable-item"); },
            onDragLeave: function (e, el) { $(el).addClass("rn-draggable-item"); }
        });
        return this.designTarget;
    };
    TablePrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.table; };
    TablePrintElement.prototype.createTarget = function (title, data, templateData) {
        var container = $('<div class="kuprint-printElement kuprint-printElement-table" style="position:absolute;">' +
            '<div class="kuprint-printElement-table-handle"></div>' +
            '<div class="kuprint-printElement-table-content" style="height:100%;width:100%"></div></div>');
        var grid = this.createGridColumnsStructure(templateData);
        for (var i = 0; i < grid.gridColumns; i++) {
            grid.getByIndex(i).append(this.getTableHtml(data, templateData));
        }
        container.find(".kuprint-printElement-table-content").append(grid.target);
        return container;
    };
    TablePrintElement.prototype.createGridColumnsStructure = function (templateData) {
        var row = $('<div class="hi-grid-row table-grid-row"></div>');
        for (var i = 0; i < this.options.getGridColumns(); i++) {
            var col = $('<div class="tableGridColumnsGutterRow hi-grid-col" style="width:' +
                (100 / this.options.getGridColumns()) + '%;"></div>');
            row.append(col);
        }
        var gridFooterFn = this.getGridColumnsFooterFormatter();
        if (gridFooterFn) {
            var footer = $('<div class="kuprint-gridColumnsFooter"></div>');
            footer.append(gridFooterFn(this.options, this.getData(templateData), templateData, []));
            row.append(footer);
        }
        return new GridColumnsStructure(this.options.getGridColumns(), row);
    };
    TablePrintElement.prototype.createtempEmptyRowsTargetStructure = function (templateData) {
        if (this.getField()) return this.createTarget(this.printElementType.title, []);
        var target = this.createTarget(this.printElementType.title, []).clone();
        target.find(".kuprint-printElement-tableTarget tbody tr").remove();
        return target;
    };
    TablePrintElement.prototype.getTableHtml = function (data, templateData) {
        if (!this.getField() && this.options.content) {
            var $div = $("<div></div>");
            $div.append(this.options.content);
            var $tbl = $div.find("table");
            $tbl.addClass("kuprint-printElement-tableTarget");
            return $tbl;
        }
        if (this.printElementType.formatter) {
            $div = $("<div></div>");
            $div.append(this.printElementType.formatter(data));
            $tbl = $div.find("table");
            $tbl.addClass("kuprint-printElement-tableTarget");
            return $tbl;
        }
        var table = $('<table class="kuprint-printElement-tableTarget" style="border-collapse:collapse;"></table>');
        var colWidth = this.options.getWidth() / this.options.getGridColumns();
        table.append(TableExcelHelper.createTableHead(this.getColumns(), colWidth));
        table.append(TableExcelHelper.createTableRow(this.getColumns(), data, this.options, this.printElementType));
        var footerFn = this.getFooterFormatter();
        if (footerFn) {
            if (this.options.tableFooterRepeat === "no") { /* skip */ }
            else if (this.options.tableFooterRepeat === "last") {
                table.find("tbody").append(
                    TableExcelHelper.createTableFooter(
                        this.printElementType.columns, data, this.options,
                        this.printElementType, templateData, data
                    ).html()
                );
            } else {
                table.append(
                    TableExcelHelper.createTableFooter(
                        this.printElementType.columns, data, this.options,
                        this.printElementType, templateData, []
                    )
                );
            }
        }
        return table;
    };
    TablePrintElement.prototype.getEmptyRowTarget = function () {
        return TableExcelHelper.createEmptyRowTarget(this.getColumns());
    };
    TablePrintElement.prototype.getHtml = function (paper, data) {
        this.createTempContainer();
        var result = this.getPaperHtmlResult(paper, data);
        this.removeTempContainer();
        return result;
    };
    TablePrintElement.prototype.getPaperHtmlResult = function (paper, data) {
        var results = [];
        var rows = this.getData(data);
        var tableHtml = this.getTableHtml(rows, data);
        var emptyTarget = this.createtempEmptyRowsTargetStructure(data);
        if (data) this.updateTargetWidth(emptyTarget);
        else this.updateTargetSize(emptyTarget);
        this.css(emptyTarget, rows);
        this.css(tableHtml, rows);
        this.getTempContainer().html("");
        this.getTempContainer().append(emptyTarget);
        var printTop = this.getBeginPrintTopInPaperByReferenceElement(paper);
        var pageIdx = 0;
        var isEnd = false;
        var anchorTop;
        while (!isEnd) {
            var extraHeight = 0;
            var footer = paper.getPaperFooter(pageIdx);
            if (pageIdx === 0 && printTop > footer) {
                printTop = printTop - footer + paper.paperHeader;
                results.push(new PaperHtmlResult({ target: undefined, printLine: undefined }));
                extraHeight = paper.getContentHeight(pageIdx) - (printTop - paper.paperHeader);
                pageIdx++;
                footer = paper.getPaperFooter(pageIdx);
            }
            var prevTarget = results.length > 0 ? results[results.length - 1].target : undefined;
            var rowsResult = this.getRowsInSpecificHeight(
                data,
                extraHeight > 0 ? extraHeight : pageIdx === 0 ? footer - printTop : paper.getContentHeight(pageIdx),
                emptyTarget, tableHtml, pageIdx, prevTarget
            );
            isEnd = rowsResult.isEnd;
            var printLine;
            if (rowsResult.target) {
                rowsResult.target.css("left", this.options.displayLeft());
                rowsResult.target[0].height = "";
            }
            if (pageIdx === 0 || extraHeight > 0) {
                if (rowsResult.target) { anchorTop = printTop; rowsResult.target.css("top", printTop + "pt"); }
                printLine = isEnd && this.options.lHeight != null
                    ? printTop + (rowsResult.height > this.options.lHeight ? rowsResult.height : this.options.lHeight)
                    : printTop + rowsResult.height;
            } else {
                if (rowsResult.target) { anchorTop = paper.paperHeader; rowsResult.target.css("top", paper.paperHeader + "pt"); }
                printLine = paper.paperHeader + rowsResult.height;
            }
            results.push(new PaperHtmlResult({
                target: rowsResult.target,
                printLine: printLine,
                referenceElement: new PrintReferenceElement({
                    top: this.options.getTop(), left: this.options.getLeft(),
                    height: this.options.getHeight(), width: this.options.getWidth(),
                    beginPrintPaperIndex: paper.index,
                    bottomInLastPaper: printLine,
                    printTopInPaper: anchorTop
                })
            }));
            pageIdx++;
        }
        return results;
    };
    TablePrintElement.prototype.getRowsInSpecificHeight = function (templateData, availHeight, emptyTarget, tableHtml, pageIdx, prevTarget) {
        var sourceTbody = tableHtml.find("tbody");
        var availPx = hinnn.pt.toPx(availHeight);
        emptyTarget.find(".kuprint-printElement-tableTarget tbody").html("");
        var currentHeight = emptyTarget.outerHeight();
        if (currentHeight > availPx) {
            return { target: undefined, length: 0, height: 0, isEnd: false };
        }
        var allRows = [];
        for (var g = 0; g < this.options.getGridColumns(); g++) {
            var gridTable = emptyTarget.find(".kuprint-printElement-tableTarget:eq(" + g + ")");
            var result;
            var gridRows = [];
            while (true) {
                if (currentHeight <= availPx) {
                    if (sourceTbody.find("tr").length === 0) {
                        result = { height: hinnn.px.toPt(currentHeight), isEnd: true };
                        if (templateData && this.options.autoCompletion) {
                            this.autoCompletion(availPx, gridTable);
                            currentHeight = emptyTarget.outerHeight();
                        }
                    } else {
                        var firstRow = sourceTbody.find("tr:lt(1)");
                        gridTable.find("tbody").append(firstRow);
                        var rowData = firstRow.data("rowData");
                        allRows.push(rowData); gridRows.push(rowData);
                        currentHeight = emptyTarget.outerHeight();
                        if (currentHeight > availPx) {
                            sourceTbody.prepend(firstRow);
                            allRows.pop(); gridRows.pop();
                            currentHeight = emptyTarget.outerHeight();
                            result = { height: hinnn.px.toPt(currentHeight), isEnd: false };
                        }
                    }
                }
                if (result) {
                    var footerFn = this.getFooterFormatter();
                    if (footerFn && gridTable.find("tfoot").length) {
                        gridTable.find("tfoot").html(
                            TableExcelHelper.createTableFooter(
                                this.printElementType.columns, this.getData(templateData),
                                this.options, this.printElementType, templateData, gridRows
                            ).html()
                        );
                    }
                    break;
                }
            }
        }
        var totalRows = emptyTarget.find(".kuprint-printElement-tableTarget tbody tr").length;
        var gridFooterFn = this.getGridColumnsFooterFormatter();
        if (gridFooterFn) {
            emptyTarget.find(this.gridColumnsFooterCss).html(gridFooterFn(this.options, this.getData(templateData), templateData, allRows));
        }
        if (sourceTbody.find("tr").length === 0) {
            if (totalRows === 0 && prevTarget) {
                return { target: undefined, length: 0, height: 0, isEnd: true };
            }
            return { target: emptyTarget.clone(), length: totalRows, height: hinnn.px.toPt(currentHeight), isEnd: true };
        }
        return { target: emptyTarget.clone(), length: totalRows, height: hinnn.px.toPt(currentHeight), isEnd: false };
    };
    TablePrintElement.prototype.autoCompletion = function (availPx, table) {
        var emptyRow = this.getEmptyRowTarget();
        var height = table.outerHeight();
        var lastRow;
        while (availPx > height) {
            lastRow = emptyRow.clone();
            table.find("tbody").append(lastRow);
            height = table.outerHeight();
        }
        if (lastRow) lastRow.remove();
    };
    TablePrintElement.prototype.getData = function (data) {
        if (!data) return [{}];
        var val = data[this.getField()];
        return val ? JSON.parse(JSON.stringify(val)) : [];
    };
    TablePrintElement.prototype.onResize = function (e, h, w, t, l) {
        _super.prototype.updateSizeAndPositionOptions.call(this, l, t, w, h);
        TableExcelHelper.resizeTableCellWidth(this.designTarget, this.getColumns(), this.options.getWidth());
    };
    TablePrintElement.prototype.getReizeableShowPoints = function () { return ["s", "e"]; };
    TablePrintElement.prototype.design = function (opts, paper) {
        var self = this;
        this.designTarget.hidraggable({
            handle: this.designTarget.find(".kuprint-printElement-table-handle"),
            axis: self.options.axis && opts && opts.axisEnabled ? self.options.axis : undefined,
            onDrag: function (e, left, top) { self.updateSizeAndPositionOptions(left, top); self.createLineOfPosition(paper); },
            moveUnit: "pt", minMove: KuPrintConfig.instance.movingDistance,
            onBeforeDrag: function () { KuPrintlib.instance.draging = true; self.createLineOfPosition(paper); },
            onStopDrag: function () { KuPrintlib.instance.draging = false; self.removeLineOfPosition(); }
        });
        if (this.printElementType.editable) this.setHitable();
        this.setColumnsOptions();
        this.designTarget.hireizeable({
            showPoints: self.getReizeableShowPoints(), noContainer: true,
            onBeforeResize: function () { KuPrintlib.instance.draging = true; },
            onResize: function (e, h, w, t, l) {
                self.onResize(e, h, w, t, l);
                if (self.hitable) self.hitable.updateColumnGrips();
                self.createLineOfPosition(paper);
            },
            onStopResize: function () { KuPrintlib.instance.draging = false; self.removeLineOfPosition(); }
        });
        this.bingKeyboardMoveEvent(this.designTarget, paper);
    };
    TablePrintElement.prototype.setHitable = function () {
        var self = this;
        this.hitable = new HiTale({
            table: this.designTarget.find(".kuprint-printElement-tableTarget:eq(0)"),
            rows: this.getColumns(), resizeRow: false, resizeColumn: true,
            trs: this.designTarget.find(".kuprint-printElement-tableTarget:eq(0) tbody tr"),
            handle: this.designTarget.find(".kuprint-printElement-tableTarget:eq(0) thead"),
            isEnableEdit: this.printElementType.editable,
            columnDisplayEditable: this.printElementType.columnDisplayEditable,
            columnDisplayIndexEditable: this.printElementType.columnDisplayIndexEditable,
            columnResizable: this.printElementType.columnResizable,
            columnAlignEditable: this.printElementType.columnAlignEditable,
            isEnableEditText: this.printElementType.columnTitleEditable,
            isEnableEditField: false, isEnableContextMenu: true,
            isEnableInsertRow: false, isEnableDeleteRow: false,
            isEnableInsertColumn: false, isEnableDeleteColumn: false,
            isEnableMergeCell: false
        });
        hinnn.event.on("updateTable" + this.hitable.id, function () { self.updateDesignViewFromOptions(); });
    };
    TablePrintElement.prototype.setColumnsOptions = function () {
        var self = this;
        this.designTarget.find(".kuprint-printElement-tableTarget:eq(0) thead td").bind("click.kuprint", function (e) {
            var columnId = $(e.target).attr("column-id");
            var col = self.getColumnByColumnId(columnId);
            if (col) {
                var items = self.getPrintElementOptionItemsByName("tableColumn");
                hinnn.event.trigger(self.getPrintElementSelectEventKey(), {
                    printElement: self,
                    customOptionsInput: [{
                        title: col.title + "-列属性",
                        optionItems: items,
                        options: col,
                        callback: function () {
                            items.forEach(function (item) { col[item.name] = item.getValue(); });
                        }
                    }]
                });
            } else {
                hinnn.event.trigger(self.getPrintElementSelectEventKey(), { printElement: self });
            }
        });
    };
    TablePrintElement.prototype.filterOptionItems = function (items) {
        var filtered = _super.prototype.filterOptionItems.call(this, items);
        if (this.printElementType.editable && this.options.columns.length === 1) return filtered;
        return items.filter(function (item) { return item.name !== "columns"; });
    };
    TablePrintElement.prototype.getFooterFormatter = function () {
        var fn;
        if (this.printElementType.footerFormatter) fn = this.printElementType.footerFormatter;
        if (this.options.footerFormatter) {
            try { fn = new Function("return (" + this.options.footerFormatter + ")")(); } catch (e) { console.log(e); }
        }
        return fn;
    };
    TablePrintElement.prototype.getGridColumnsFooterFormatter = function () {
        var fn;
        if (this.printElementType.gridColumnsFooterFormatter) fn = this.printElementType.gridColumnsFooterFormatter;
        if (this.options.gridColumnsFooterFormatter) {
            try { fn = new Function("return (" + this.options.gridColumnsFooterFormatter + ")")(); } catch (e) { console.log(e); }
        }
        return fn;
    };
    return TablePrintElement;
})(BasePrintElement);
