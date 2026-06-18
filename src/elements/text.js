// ============================================================
// elements/text.js — 文本/条形码/二维码元素
// TextPrintElement 继承 BasePrintElement
// ============================================================

// ============================================================
// Concrete Print Element classes
// ============================================================

// --- TextPrintElement ---
var TextPrintElement = (function (_super) {
    __extends(TextPrintElement, _super);
    function TextPrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.options = new TextPrintElementOption(opts);
        self.options.setDefault(new TextPrintElementOption(KuPrintConfig.instance.text.default).getPrintElementOptionEntity());
        return self;
    }
    TextPrintElement.prototype.getDesignTarget = function (paper) {
        return _super.prototype.getDesignTarget.call(this, paper);
    };
    TextPrintElement.prototype.getProxyTarget = function (override) {
        if (override) this.SetProxyTargetOption(override);
        var data = this.getData();
        var target = this.createTarget(this.printElementType.getText(true), data);
        this.updateTargetSize(target);
        this.css(target, data);
        return target;
    };
    TextPrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) {
            var data = this.getData();
            this.css(this.designTarget, data);
            this.updateTargetText(this.designTarget, this.getTitle(), data);
        }
    };
    TextPrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.text; };
    TextPrintElement.prototype.getTitle = function () {
        var t = this.options.title || this.printElementType.title || "";
        if (t) t = TextHelper.replaceEnterAndNewlineAndTab(t, "");
        return t;
    };
    TextPrintElement.prototype.getData = function (data) {
        var val = data ? (data[this.getField()] || "") : (this.options.testData || this.printElementType.getData() || "");
        if (this.options.format) {
            if (this.options.dataType === "datetime") return hinnn.dateFormat(val, this.options.format);
            if (this.options.dataType === "boolean") {
                var parts = this.options.format.split(":");
                if (parts.length > 0) return val === true || val === "true" ? parts[0] : parts[1];
            }
        }
        return val;
    };
    TextPrintElement.prototype.updateTargetText = function ($el, title, data, n) {
        var formatter = this.getFormatter();
        var content = $el.find(".kuprint-printElement-text-content");
        var text = "";
        if (this.getField()) {
            text = (this.options.getHideTitle() ? "" : title ? title + "：" : "") +
                (formatter ? formatter(title, data, this.options, this._currenttemplateData, $el) : data);
        } else {
            text = formatter ? formatter(title, title, this.options, this._currenttemplateData, $el) : title;
        }
        var textType = this.options.getTextType();
        if (textType === "text") {
            content.html(text);
        } else if (textType === "barcode") {
            content.html('<svg width="100%" display="block" height="100%" class="hibarcode_imgcode" preserveAspectRatio="none slice"></svg><div class="hibarcode_displayValue"></div>');
            try {
                if (data) {
                    JsBarcode(content.find(".hibarcode_imgcode")[0], data, {
                        format: this.options.getBarcodeMode(), width: 1, textMargin: -1,
                        lineColor: this.options.color || "#000000", margin: 0,
                        height: parseInt(hinnn.pt.toPx(this.options.getHeight() || 10).toString()),
                        displayValue: false
                    });
                    content.find(".hibarcode_imgcode").attr("height", "100%").attr("width", "100%");
                    if (!this.options.hideTitle) content.find(".hibarcode_displayValue").html(data);
                } else { content.html(""); }
            } catch (e) { console.log(e); content.html("此格式不支持该文本"); }
        } else if (textType === "qrcode") {
            content.html("");
            try {
                if (data) {
                    var w = parseInt(hinnn.pt.toPx(this.options.getWidth() || 20));
                    var h = parseInt(hinnn.pt.toPx(this.options.getHeight() || 20));
                    new QRCode(content[0], {
                        width: w, height: h,
                        colorDark: this.options.color || "#000000", useSVG: true
                    }).makeCode(data);
                }
            } catch (e) { console.log(e); content.html("二维码生成失败"); }
        }
    };
    TextPrintElement.prototype.onResize = function (e, h, w, t, l) {
        _super.prototype.onResize.call(this, e, h, w, t, l);
        if (this.options.getTextType() === "barcode" || this.options.getTextType() === "qrcode") {
            this.updateTargetText(this.designTarget, this.getTitle(), this.getData());
        }
    };
    TextPrintElement.prototype.createTarget = function (title, data, n) {
        var $el = $('<div tabindex="1" class="kuprint-printElement kuprint-printElement-text" style="position:absolute;">' +
            '<div class="kuprint-printElement-text-content kuprint-printElement-content" style="height:100%;width:100%"></div></div>');
        this.updateTargetText($el, title, data, n);
        return $el;
    };
    TextPrintElement.prototype.getHtml = function (paper, data, n) { return this.getHtml2(paper, data, n); };
    return TextPrintElement;
})(BasePrintElement);
