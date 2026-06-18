// ============================================================
// template/template.js — 打印模板
// ============================================================
// 【PrintTemplate — 模板核心数据模型】
// 管理所有打印面板(PrintPanel)和元素。提供：
//   - design()    设计模式渲染
//   - getHtml()   生成打印 HTML
//   - getJson()   序列化为 JSON
//   - print()     直接打印
//   - print2()    远程打印（WebSocket）
//   - toPdf()     导出 PDF（依赖 jsPDF/html2canvas）
// 也包含 OptionSettingPanel（属性面板管理）和
// PaginationCreator（分页导航创建）。
// 依赖：hinnn、KuPrintlib、KuPrintConfig、PrintPanel、Paper
// ============================================================

var PrintTemplate = (function () {
    function PrintTemplate(opts) {
        var self = this;
        this.tempImageBase64 = {};
        this.id = KuPrintlib.instance.guid();
        KuPrintlib.instance.setPrintTemplateById(this.id, this);
        var cfg = opts || {};
        this.printPanels = [];
        var tmpl = new TemplateEntity(cfg.template || []);
        if (cfg.template) {
            tmpl.panels.forEach(function (p) { self.printPanels.push(new PrintPanel(p, self.id)); });
        }
        if (cfg.fields) this.fields = cfg.fields;
        if (cfg.settingContainer) new OptionSettingPanel(this, cfg.settingContainer);
        if (cfg.paginationContainer) {
            this.printPaginationCreator = new PaginationCreator(cfg.paginationContainer, this);
            this.printPaginationCreator.buildPagination();
        }
        this.initAutoSave();
    }
    PrintTemplate.prototype.design = function (container, opts) {
        var self = this;
        if (!opts) opts = {};
        if (this.printPanels.length === 0) { this.printPanels.push(this.createDefaultPanel()); }
        if (!container) throw new Error("options.container can not be empty");
        this.createContainer(container);
        this.printPanels.forEach(function (panel, i) { self.container.append(panel.getTarget()); if (i > 0) panel.disable(); panel.design(opts); });
        this.selectPanel(0);
    };
    PrintTemplate.prototype.getSimpleHtml = function (data, opts) {
        var self = this;
        if (!opts) opts = {};
        var $ct = $('<div class="kuprint-printTemplate"></div>');
        if (data && data.constructor === Array) {
            data.forEach(function (d) {
                if (d) self.printPanels.forEach(function (panel) { $ct.append(panel.getHtml(d, opts)); });
            });
        } else {
            this.printPanels.forEach(function (panel) { $ct.append(panel.getHtml(data, opts)); });
        }
        if (opts && opts.imgToBase64) this.transformImg($ct.find("img"));
        return $ct;
    };
    PrintTemplate.prototype.getHtml = function (data, opts) {
        if (!data) data = {};
        return this.getSimpleHtml(data, opts);
    };
    PrintTemplate.prototype.getJointHtml = function (data, opts, jointOpts) {
        var $ct = $('<div class="kuprint-printTemplate"></div>');
        var panels = [];
        this.printPanels.forEach(function (panel) { $ct.append(panel.getHtml(data, opts, panels, undefined, jointOpts)); });
        return $ct;
    };
    PrintTemplate.prototype.setPaper = function (type, height) {
        if (/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(type)) {
            this.editingPanel.resize(undefined, parseFloat(type), parseFloat(height), false);
        } else {
            var ps = KuPrintlib.instance[type];
            if (!ps) throw new Error("not found pagetype:" + (type || ""));
            this.editingPanel.resize(type, ps.width, ps.height, false);
        }
    };
    PrintTemplate.prototype.rotatePaper = function () { this.editingPanel.rotatePaper(); };
    PrintTemplate.prototype.addPrintPanel = function (entity, immediate) {
        var panel = entity ? new PrintPanel(new PanelEntity(entity), this.id) : this.createDefaultPanel();
        if (entity) entity.index = this.printPanels.length;
        if (immediate) { this.container.append(panel.getTarget()); panel.design(); }
        this.printPanels.push(panel);
        if (immediate) this.selectPanel(panel.index);
        return panel;
    };
    PrintTemplate.prototype.selectPanel = function (idx) {
        var self = this;
        this.printPanels.forEach(function (panel, i) { if (idx === i) { panel.enable(); self.editingPanel = panel; } else panel.disable(); });
    };
    PrintTemplate.prototype.deletePanel = function (idx) {
        this.printPanels[idx].clear();
        this.printPanels[idx].getTarget().remove();
        this.printPanels.splice(idx, 1);
    };
    PrintTemplate.prototype.getPaneltotal = function () { return this.printPanels.length; };
    PrintTemplate.prototype.createDefaultPanel = function () {
        return new PrintPanel(new PanelEntity({ index: this.printPanels.length, paperType: "A4" }), this.id);
    };
    PrintTemplate.prototype.createContainer = function (container) {
        if (container) { this.container = $(container); this.container.addClass("kuprint-printTemplate"); }
        else { this.container = $('<div class="kuprint-printTemplate"></div>'); }
    };
    PrintTemplate.prototype.getJsonTid = function () {
        var panels = [];
        this.printPanels.forEach(function (panel) { if (panel.getPanelEntity().printElements.length) panels.push(panel.getPanelEntity()); });
        return new TemplateEntity({ panels: panels });
    };
    PrintTemplate.prototype.getJson = function () {
        var panels = [];
        this.printPanels.forEach(function (panel) { panels.push(panel.getPanelEntity(true)); });
        return new TemplateEntity({ panels: panels });
    };
    PrintTemplate.prototype.getPrintElementSelectEventKey = function () { return "PrintElementSelectEventKey_" + this.id; };
    PrintTemplate.prototype.getBuildCustomOptionSettingEventKey = function () { return "BuildCustomOptionSettingEventKey_" + this.id; };
    PrintTemplate.prototype.clear = function () {
        var self = this;
        this.printPanels.forEach(function (panel) {
            panel.clear();
            if (panel.index > 0) { var t = panel.getTarget(); if (t && t.length) t.remove(); }
        });
        this.printPanels = [this.printPanels[0]];
        if (this.printPaginationCreator) this.printPaginationCreator.buildPagination();
    };
    PrintTemplate.prototype.getPaperType = function (idx) { if (idx == null) idx = 0; return this.printPanels[0].paperType; };
    PrintTemplate.prototype.getOrient = function (idx) {
        if (idx == null) idx = 0;
        return this.printPanels[idx].height > this.printPanels[idx].width ? 1 : 2;
    };
    PrintTemplate.prototype.getPrintStyle = function (idx) { return this.printPanels[idx].getPrintStyle(); };
    PrintTemplate.prototype.print = function (data, opts) {
        if (!data) data = {};
        this.getHtml(data, opts).hiwprint();
    };
    PrintTemplate.prototype.print2 = function (data, opts) {
        if (!data) data = {};
        if (!opts) opts = {};
        if (this.clientIsOpened()) {
            var self = this;
            var loaded = 0;
            var styles = {};
            var $links = $("link[media=print]").length > 0 ? $("link[media=print]") : $("link");
            $links.each(function (i, link) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", $(link).attr("href"));
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        styles[i + ""] = '<style rel="stylesheet" type="text/css">' + xhr.responseText + '</style>';
                        loaded++;
                        if (loaded === $links.length) {
                            var css = "";
                            for (var j = 0; j < $links.length; j++) { css += styles[j + ""]; }
                            self.sentToClient(css, data, opts);
                        }
                    }
                };
                xhr.send();
            });
        } else { alert("连接客户端失败"); }
    };
    PrintTemplate.prototype.imageToBase64 = function ($img) {
        var src = $img.attr("src");
        if (src.indexOf("base64") === -1) {
            try {
                if (!this.tempImageBase64[src]) {
                    var canvas = document.createElement("canvas");
                    var img = new Image();
                    img.src = $img.attr("src");
                    canvas.width = img.width; canvas.height = img.height;
                    canvas.getContext("2d").drawImage(img, 0, 0);
                    if (src) this.tempImageBase64[src] = canvas.toDataURL("image/png");
                }
                $img.attr("src", this.tempImageBase64[src]);
            } catch (e) {
                try { this.xhrLoadImage($img); } catch (e2) { console.log(e2); }
            }
        }
    };
    PrintTemplate.prototype.xhrLoadImage = function () { };
    PrintTemplate.prototype.sentToClient = function (css, data, opts) {
        if (!data) data = {};
        var merged = $.extend({}, opts || {});
        merged.imgToBase64 = true;
        var html = css + this.getHtml(data, merged)[0].outerHTML;
        merged.id = KuPrintlib.instance.guid();
        merged.html = html;
        merged.templateId = this.id;
        hiwebSocket.send(merged);
    };
    PrintTemplate.prototype.printByHtml = function ($html) { $($html).hiwprint(); };
    PrintTemplate.prototype.printByHtml2 = function ($html, opts) {
        if (!opts) opts = {};
        if (this.clientIsOpened()) {
            var self = this;
            var loaded = 0;
            var styles = {};
            var $links = $("link[media=print]").length > 0 ? $("link[media=print]") : $("link");
            $links.each(function (i, link) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", $(link).attr("href"));
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        styles[i + ""] = '<style rel="stylesheet" type="text/css">' + xhr.responseText + '</style>';
                        loaded++;
                        if (loaded === $links.length) {
                            var css = "";
                            for (var j = 0; j < $links.length; j++) { css += styles[j + ""]; }
                            var html = css + $($html)[0].outerHTML;
                            var pkg = $.extend({}, opts || {});
                            pkg.id = KuPrintlib.instance.guid();
                            pkg.html = html;
                            pkg.templateId = self.id;
                            hiwebSocket.send(pkg);
                        }
                    }
                };
                xhr.send();
            });
        } else { alert("连接客户端失败"); }
    };
    PrintTemplate.prototype.deletePrintElement = function (pe) { this.printPanels.forEach(function (panel) { panel.deletePrintElement(pe); }); };
    PrintTemplate.prototype.transformImg = function ($imgs) {
        var self = this;
        $imgs.each(function (i, el) { self.imageToBase64($(el)); });
    };
    PrintTemplate.prototype.toPdf = function (data, filename, opts) {
        var self = this;
        if (!this.printPanels.length) return;
        var pw = hinnn.mm.toPt(this.printPanels[0].width);
        var ph = hinnn.mm.toPt(this.printPanels[0].height);
        var html2canvasOpts = $.extend({ scale: 2, width: hinnn.pt.toPx(pw), x: 0, y: 0, useCORS: true }, opts || {});
        var pdf = new jsPDF({
            orientation: this.getOrient(0) === 1 ? "portrait" : "landscape",
            unit: "pt",
            format: this.printPanels[0].paperType ? this.printPanels[0].paperType.toLocaleLowerCase() : [pw, ph]
        });
        var $html = this.getHtml(data, opts);
        this.createTempContainer();
        var tempContainer = this.getTempContainer();
        this.svg2canvas($html);
        tempContainer.html($html[0]);
        var pageCount = tempContainer.find(".kuprint-printPanel .kuprint-printPaper").length;
        $($html).css("position:fixed");
        html2canvas($html[0], html2canvasOpts).then(function (canvas) {
            var ctx = canvas.getContext("2d");
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            var imgData = canvas.toDataURL("image/jpeg");
            for (var i = 0; i < pageCount; i++) {
                pdf.addImage(imgData, "JPEG", 0, 0 - i * ph, pw, pageCount * ph);
                if (i < pageCount - 1) pdf.addPage();
            }
            self.removeTempContainer();
            if (filename.indexOf(".pdf") > -1) pdf.save(filename);
            else pdf.save(filename + ".pdf");
        });
    };
    PrintTemplate.prototype.createTempContainer = function () {
        this.removeTempContainer();
        $("body").prepend($('<div class="kuprint_temp_Container" style="overflow:hidden;height:0px;box-sizing:border-box;"></div>'));
    };
    PrintTemplate.prototype.removeTempContainer = function () { $(".kuprint_temp_Container").remove(); };
    PrintTemplate.prototype.getTempContainer = function () { return $(".kuprint_temp_Container"); };
    PrintTemplate.prototype.svg2canvas = function ($el) {
        $el.find("svg").each(function (i, svg) {
            var parent = svg.parentNode;
            var canvas = document.createElement("canvas");
            var svgStr = new XMLSerializer().serializeToString(svg);
            canvg(canvas, svgStr);
            $(svg).before(canvas);
            parent.removeChild(svg);
            $(canvas).css("width", "100%").css("height", "100%");
        });
    };
    PrintTemplate.prototype.on = function (event, fn) { hinnn.event.on(event + "_" + this.id, fn); };
    PrintTemplate.prototype.clientIsOpened = function () { return hiwebSocket.opened; };
    PrintTemplate.prototype.getPrinterList = function () { return hiwebSocket.getPrinterList() || []; };
    PrintTemplate.prototype.getElementByTid = function (tid, panelIdx) {
        if (panelIdx == null) panelIdx = 0;
        return this.printPanels[panelIdx].getElementByTid(tid);
    };
    PrintTemplate.prototype.getElementByName = function (name, panelIdx) {
        if (panelIdx == null) panelIdx = 0;
        return this.printPanels[panelIdx].getElementByName(name);
    };
    PrintTemplate.prototype.getPanel = function (idx) { if (idx == null) idx = 0; return this.printPanels[idx]; };
    PrintTemplate.prototype.loadAllImages = function ($html, cb, attempt) {
        var self = this;
        if (attempt == null) attempt = 0;
        var imgs = $html[0].getElementsByTagName("img");
        var allLoaded = true;
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if (img.src && img.src !== window.location.href && img.src.indexOf("base64") === -1) {
                if (!(img && img.naturalWidth !== undefined && img.naturalWidth !== 0 && img.complete)) { allLoaded = false; }
            }
        }
        attempt++;
        if (!allLoaded && attempt < 10) {
            setTimeout(function () { self.loadAllImages($html, cb, attempt); }, 500);
        } else { cb(); }
    };
    PrintTemplate.prototype.setFields = function (fields) { this.fields = fields; };
    PrintTemplate.prototype.getFields = function () { return this.fields; };
    PrintTemplate.prototype.getFieldsInPanel = function () {
        var fields = [];
        this.printPanels.forEach(function (panel) { fields = fields.concat(panel.getFieldsInPanel()); });
        return fields;
    };
    PrintTemplate.prototype.initAutoSave = function () {
        var self = this;
        if (this.autoSave) {
            hinnn.event.on("kuprintTemplateDataChanged_" + this.id, function () {
                hiLocalStorage.saveLocalData(
                    self.autoSaveKey || "kuprintAutoSave",
                    JSON.stringify(self.autoSaveMode === 1 ? self.getJson() : self.getJsonTid())
                );
            });
        }
    };
    return PrintTemplate;
})();

// ============================================================
// PrintPanel
// ============================================================