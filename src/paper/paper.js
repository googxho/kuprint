// ============================================================
// paper/paper.js — 纸张（一页打印纸）
// ============================================================
// 【Paper — 纸张管理】
// 表示一页打印纸。管理该页上元素的分页和渲染。
// 包含：页眉线/页尾线拖拽、页码显示、标尺（base64 PNG）、
// 纸张尺寸调整、显示规则等。
// 依赖：hinnn、KuPrintlib、PrintReferenceElement
// ============================================================

var Paper = (function () {
    function Paper(templateId, mmwidth, mmheight, paperHeader, paperFooter,
        paperNumberLeft, paperNumberTop, paperNumberDisabled, paperNumberFormat, index, referenceElement) {
        this.defaultPaperNumberFormat = "paperNo-paperCount";
        this.printLine = 0;
        this.templateId = templateId;
        this.width = hinnn.mm.toPt(mmwidth); this.height = hinnn.mm.toPt(mmheight);
        this.mmwidth = mmwidth; this.mmheight = mmheight;
        this.paperHeader = paperHeader; this.paperFooter = paperFooter;
        this.contentHeight = paperFooter - paperHeader;
        this.createTarget(); this.index = index;
        this.paperNumberLeft = paperNumberLeft || parseInt((this.width - 30).toString());
        this.paperNumberTop = paperNumberTop || parseInt((this.height - 22).toString());
        this.paperNumberDisabled = paperNumberDisabled; this.paperNumberFormat = paperNumberFormat;
        this.referenceElement = referenceElement
            ? $.extend({}, referenceElement)
            : new PrintReferenceElement({ top: 0, left: 0, height: 0, width: 0, bottomInLastPaper: 0, beginPrintPaperIndex: 0, printTopInPaper: 0, endPrintPaperIndex: 0 });
    }
    Paper.prototype.subscribePaperBaseInfoChanged = function (fn) { this.onPaperBaseInfoChanged = fn; };
    Paper.prototype.triggerOnPaperBaseInfoChanged = function () {
        if (this.onPaperBaseInfoChanged) {
            this.onPaperBaseInfoChanged({
                paperHeader: this.paperHeader, paperFooter: this.paperFooter,
                paperNumberLeft: this.paperNumberLeft, paperNumberTop: this.paperNumberTop,
                paperNumberDisabled: this.paperNumberDisabled, paperNumberFormat: this.paperNumberFormat
            });
        }
    };
    Paper.prototype.setFooter = function (first, even, odd, last) {
        this.firstPaperFooter = first; this.evenPaperFooter = even;
        this.oddPaperFooter = odd; this.lastPaperFooter = last;
    };
    Paper.prototype.setOffset = function (left, top) { this.setLeftOffset(left); this.setTopOffset(top); };
    Paper.prototype.setLeftOffset = function (v) {
        if (v) this.paperContentTarget.css("left", v + "pt");
        else this.paperContentTarget[0].style.left = "";
    };
    Paper.prototype.setTopOffset = function (v) {
        if (v) this.paperContentTarget.css("top", v + "pt");
        else this.paperContentTarget[0].style.top = "";
    };
    Paper.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-printPaper"><div class="kuprint-printPaper-content"></div></div>');
        this.paperContentTarget = this.target.find(".kuprint-printPaper-content");
        this.target.css("width", this.mmwidth + "mm");
        this.target.css("height", this.mmheight - KuPrintConfig.instance.paperHeightTrim + "mm");
        this.target.attr("original-height", this.mmheight);
    };
    Paper.prototype.createHeaderLine = function () {
        var self = this;
        this.headerLineTarget = $('<div class="kuprint-headerLine" style="position:absolute;width:100%;border-top:1px dashed #c9bebe;height:7pt;"></div>');
        this.headerLineTarget.css("top", (this.paperHeader || -1) + "pt");
        if (this.paperHeader === 0) this.headerLineTarget.addClass("hideheaderLinetarget");
        this.paperContentTarget.append(this.headerLineTarget);
        this.dragHeadLineOrFootLine(this.headerLineTarget, function (x, y) { self.paperHeader = y; self.triggerOnPaperBaseInfoChanged(); });
    };
    Paper.prototype.createFooterLine = function () {
        var self = this;
        this.footerLineTarget = $('<div class="kuprint-footerLine" style="position:absolute;width:100%;border-top:1px dashed #c9bebe;height:7pt;"></div>');
        this.footerLineTarget.css("top", parseInt(this.paperFooter.toString()) + "pt");
        if (this.paperFooter === this.height) {
            this.footerLineTarget.css("top", this.mmheight - KuPrintConfig.instance.paperHeightTrim + "mm");
            this.footerLineTarget.addClass("hidefooterLinetarget");
        }
        this.paperContentTarget.append(this.footerLineTarget);
        this.dragHeadLineOrFootLine(this.footerLineTarget, function (x, y) { self.paperFooter = y; self.triggerOnPaperBaseInfoChanged(); });
    };
    Paper.prototype.createPaperNumber = function (text) {
        var self = this;
        var existing = this.target.find(".kuprint-paperNumber");
        if (existing.length) { existing.html(text); return existing; }
        var $num = $('<span class="kuprint-paperNumber" style="position:absolute">' + text + '</span>');
        $num.css("top", this.paperNumberTop + "pt");
        $num.css("left", this.paperNumberLeft + "pt");
        this.paperContentTarget.append($num);
        this.dragHeadLineOrFootLine($num, function (x, y) { self.paperNumberTop = y; self.paperNumberLeft = x; self.triggerOnPaperBaseInfoChanged(); }, true);
        return $num;
    };
    Paper.prototype.getTarget = function () { return this.target; };
    Paper.prototype.append = function (el) { this.paperContentTarget.append(el); };
    Paper.prototype.updateReferenceElement = function (ref) { if (ref) this.referenceElement = ref; };
    Paper.prototype.updatePrintLine = function (line) { if (line >= this.printLine) this.printLine = line; };
    Paper.prototype.design = function (opts) {
        var self = this;
        this.createHeaderLine(); this.createFooterLine();
        this.target.addClass("design");
        this.paperNumberTarget = this.createPaperNumber(this.formatPaperNumber(1, 1));
        this.createRuler();
        this.resetPaperNumber(this.paperNumberTarget);
        $(this.paperNumberTarget).bind("dblclick.kuprint", function () {
            if (self.paperNumberDisabled == null) self.paperNumberDisabled = false;
            self.paperNumberDisabled = !self.paperNumberDisabled;
            self.resetPaperNumber(self.paperNumberTarget);
            self.triggerOnPaperBaseInfoChanged();
        });
        $(this.paperNumberTarget).bind("click.kuprint", function () {
            hinnn.event.trigger("BuildCustomOptionSettingEventKey_" + self.templateId, {
                options: { paperNumberFormat: self.paperNumberFormat, paperNumberDisabled: self.paperNumberDisabled },
                callback: function (v) {
                    self.paperNumberDisabled = !!v.paperNumberDisabled || undefined;
                    self.paperNumberFormat = v.paperNumberFormat || undefined;
                    self.createPaperNumber(self.formatPaperNumber(1, 1));
                    self.resetPaperNumber(self.paperNumberTarget);
                    self.triggerOnPaperBaseInfoChanged();
                }
            });
        });
    };
    Paper.prototype.resetPaperNumber = function ($el) {
        if (this.paperNumberDisabled) $el.addClass("kuprint-paperNumber-disabled");
        else $el.removeClass("kuprint-paperNumber-disabled");
    };
    Paper.prototype.updatePaperNumber = function (current, total, toggle) {
        var $num = this.createPaperNumber(this.formatPaperNumber(current, total));
        if (this.paperNumberDisabled) $num.hide();
        else if (toggle && this.index % 2 === 1) { $num[0].style.left = ""; $num.css("right", this.paperNumberLeft + "pt"); }
    };
    Paper.prototype.formatPaperNumber = function (current, total) {
        var fmt = this.paperNumberFormat || this.defaultPaperNumberFormat;
        return fmt.replace("paperNo", current.toString()).replace("paperCount", total.toString());
    };
    Paper.prototype.dragHeadLineOrFootLine = function ($el, cb, bothAxis) {
        var self = this;
        $el.hidraggable({
            axis: bothAxis ? undefined : "v",
            onDrag: function (e, x, y) { cb(x, y); },
            moveUnit: "pt", minMove: KuPrintConfig.instance.movingDistance,
            onBeforeDrag: function () { KuPrintlib.instance.draging = true; },
            onStopDrag: function () {
                KuPrintlib.instance.draging = false;
                self.footerLineTarget.removeClass("hidefooterLinetarget");
                self.headerLineTarget.removeClass("hideheaderLinetarget");
            }
        });
    };
    Paper.prototype.resize = function (w, h) {
        this.width = hinnn.mm.toPt(w); this.height = hinnn.mm.toPt(h);
        this.mmwidth = w; this.mmheight = h;
        this.target.css("width", w + "mm");
        this.target.css("height", h - KuPrintConfig.instance.paperHeightTrim + "mm");
        this.target.attr("original-height", this.mmheight);
        this.paperFooter = this.height;
        this.footerLineTarget.css("top", this.height + "pt");
        this.contentHeight = this.paperFooter - this.paperHeader;
        this.paperNumberLeft = parseInt((this.width - 30).toString());
        this.paperNumberTop = parseInt((this.height - 22).toString());
        this.paperNumberTarget.css("top", this.paperNumberTop + "pt");
        this.paperNumberTarget.css("left", this.paperNumberLeft + "pt");
        this.triggerOnPaperBaseInfoChanged();
    };
    Paper.prototype.getPaperFooter = function (pageOffset) {
        var idx = this.index + pageOffset;
        if (idx === 0) return this.firstPaperFooter || (this.oddPaperFooter || this.paperFooter);
        if (idx % 2 === 0) return this.oddPaperFooter || this.paperFooter;
        if (idx % 2 === 1) return this.evenPaperFooter || this.paperFooter;
    };
    Paper.prototype.getContentHeight = function (pageOffset) { return this.getPaperFooter(pageOffset) - this.paperHeader; };
    Paper.prototype.createRuler = function () {
        this.target.append(
            '<div class="kuprint_rul_wrapper">' +
            '<img class="h_img" src="data:image/png;base64,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" />' +
            '<img class="v_img" src="data:image/png;base64,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" />' +
            '</div>'
        );
    };
    Paper.prototype.displayHeight = function () { return this.mmheight - KuPrintConfig.instance.paperHeightTrim + "mm"; };
    Paper.prototype.displayWidth = function () { return this.mmwidth + "mm"; };
    Paper.prototype.getPanelTarget = function () { return this.target.parent(".kuprint-printPanel"); };
    return Paper;
})();

// ============================================================
// TemplateEntity (DTO)
// ============================================================
var TemplateEntity = function (t) {
    if (t) {
        if (t.panels) {
            this.panels = [];
            for (var i = 0; i < t.panels.length; i++) { this.panels.push(new PanelEntity(t.panels[i])); }
        } else { this.panels = []; }
    }
};

// ============================================================
// OptionSettingPanel
// ============================================================
var OptionSettingPanel = (function () {
    function OptionSettingPanel(template, container) {
        var self = this;
        this.printElementOptionSettingPanel = {};
        this.printTemplate = template;
        this.settingContainer = $(container);
        hinnn.event.on(template.getPrintElementSelectEventKey(), function (e) { self.buildSetting(e); });
        hinnn.event.on(template.getBuildCustomOptionSettingEventKey(), function (e) { self.buildSettingByCustomOptions(e); });
    }
    OptionSettingPanel.prototype.init = function () { };
    OptionSettingPanel.prototype.buildSetting = function (opts) {
        var self = this;
        var printElement = opts.printElement;
        var customOpts = opts.customOptionsInput;
        if (this.lastPrintElement) {
            this.lastPrintElement.getPrintElementOptionItems().forEach(function (item) { item.destroy(); });
        }
        this.lastPrintElement = undefined;
        this.settingContainer.html("");
        var $container = $('<div class="kuprint-option-items"></div>');
        printElement.getPrintElementOptionItems().forEach(function (item) {
            item.submit = function () { printElement.submitOption(); };
            var target = item.createTarget(printElement, printElement.options, printElement.printElementType);
            self.printElementOptionSettingPanel[item.name] = target;
            $container.append(target);
            item.setValue(printElement.options[item.name], printElement.options, printElement.printElementType);
        });
        var $submit = $('<button class="kuprint-option-item-settingBtn kuprint-option-item-submitBtn" type="button">确定</button>');
        var $delete = $('<button class="kuprint-option-item-settingBtn kuprint-option-item-deleteBtn" type="button">删除</button>');
        $container.append($submit).append($delete);
        $submit.bind("click.submitOption", function () { printElement.submitOption(); });
        $delete.bind("click.deleteBtn", function () { self.printTemplate.deletePrintElement(printElement); });
        $container.find(".auto-submit").change(function () { printElement.submitOption(); });
        $container.find(".auto-submit:input").bind("keydown.submitOption", function (e) { if (e.keyCode === 13) printElement.submitOption(); });
        this.settingContainer.append($container);
        if (customOpts) {
            customOpts.forEach(function (custOpt) {
                var origCb = custOpt.callback;
                custOpt.callback = function (v) { if (origCb) { origCb(v); printElement.submitOption(); } };
                self.buildSettingByCustomOptions(custOpt, self.settingContainer);
            });
        }
        this.lastPrintElement = printElement;
    };
    OptionSettingPanel.prototype.buildSettingByCustomOptions = function (opts, container) {
        var self = this;
        if (this.lastPrintElement) {
            this.lastPrintElement.getPrintElementOptionItems().forEach(function (item) { item.destroy(); });
        }
        this.lastPrintElement = undefined;
        var $ct = container || this.settingContainer;
        if (!container) this.settingContainer.html("");
        var items = [];
        if (opts.optionItems) {
            items = opts.optionItems;
        } else {
            Object.keys(opts.options).forEach(function (k) {
                var item = PrintElementOptionItemManager.getItem(k);
                if (item) items.push(item);
            });
        }
        var $wrapper = $('<div class="kuprint-option-items"></div>');
        if (opts.title) {
            $wrapper.append('<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label kuprint-option-title">' + opts.title + '</div></div>');
        }
        items.forEach(function (item) {
            item.submit = function () { opts.callback(self.getValueByOptionItems(items)); };
            $wrapper.append(item.createTarget(undefined, opts.options, undefined));
            item.setValue(opts.options[item.name], opts.options, undefined);
        });
        var $submit = $('<button class="kuprint-option-item-settingBtn kuprint-option-item-submitBtn" type="button">确定</button>');
        $wrapper.append($submit);
        $submit.bind("click.submitOption", function () { opts.callback(self.getValueByOptionItems(items)); });
        $wrapper.find(".auto-submit").change(function () { opts.callback(self.getValueByOptionItems(items)); });
        $wrapper.find(".auto-submit:input").bind("keydown.submitOption", function (e) { if (e.keyCode === 13) opts.callback(self.getValueByOptionItems(items)); });
        $ct.append($wrapper);
    };
    OptionSettingPanel.prototype.getValueByOptionItems = function (items) {
        var obj = {};
        items.forEach(function (item) { obj[item.name] = item.getValue(); });
        return obj;
    };
    return OptionSettingPanel;
})();

// ============================================================
// PaginationCreator
// ============================================================
var PaginationCreator = (function () {
    function PaginationCreator(container, template) {
        this.paginationContainer = container;
        this.$container = $(this.paginationContainer);
        this.template = template;
    }
    PaginationCreator.prototype.buildPagination = function () {
        var total = this.template.getPaneltotal();
        var self = this;
        this.$container.html("");
        var $ul = $('<ul class="kuprint-pagination"></ul>');
        for (var i = 0; i < total; i++) {
            (function (idx) {
                var $li = $("<li><span>" + (idx + 1) + '</span><a href="javascript:void(0);">x</a></li>');
                $li.find("span").click(function () { self.template.selectPanel(idx); $li.removeClass("selected"); $(this).parent("li").addClass("selected"); });
                $li.find("a").click(function () { self.template.deletePanel(idx); self.buildPagination(); });
                $ul.append($li);
            })(i);
        }
        var $add = $("<li><span>+</span></li>");
        $ul.append($add);
        this.$container.append($ul);
        $add.click(function () { self.template.addPrintPanel(undefined, true); self.buildPagination(); });
    };
    return PaginationCreator;
})();

// ============================================================
// PrintTemplate - The main template class
// ============================================================