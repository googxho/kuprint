// ============================================================
// elements/lines.js — 线条与形状元素
// VlinePrintElement / HlinePrintElement / RectPrintElement / OvalPrintElement
// ============================================================

// --- VlinePrintElement ---
var VlinePrintElement = (function (_super) {
    __extends(VlinePrintElement, _super);
    function VlinePrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.options = new PrintElementOption(opts);
        self.options.setDefault(new PrintElementOption(KuPrintConfig.instance.vline.default).getPrintElementOptionEntity());
        return self;
    }
    VlinePrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) this.css(this.designTarget, this.getData());
    };
    VlinePrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.hline; };
    VlinePrintElement.prototype.createTarget = function () {
        return $('<div class="kuprint-printElement kuprint-printElement-vline" style="border-left:1px solid;position:absolute;"></div>');
    };
    VlinePrintElement.prototype.getReizeableShowPoints = function () { return ["s"]; };
    VlinePrintElement.prototype.getHtml = function (paper, data, n) { return this.getHtml2(paper, data, n); };
    return VlinePrintElement;
})(BasePrintElement);

// --- HlinePrintElement ---
var HlinePrintElement = (function (_super) {
    __extends(HlinePrintElement, _super);
    function HlinePrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.options = new PrintElementOption(opts);
        self.options.setDefault(new PrintElementOption(KuPrintConfig.instance.hline.default).getPrintElementOptionEntity());
        return self;
    }
    HlinePrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) this.css(this.designTarget, this.getData());
    };
    HlinePrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.hline; };
    HlinePrintElement.prototype.createTarget = function () {
        return $('<div class="kuprint-printElement kuprint-printElement-hline" style="border-top:1px solid;position:absolute;"></div>');
    };
    HlinePrintElement.prototype.getReizeableShowPoints = function () { return ["e"]; };
    return HlinePrintElement;
})(BasePrintElement);

// --- RectPrintElement ---
var RectPrintElement = (function (_super) {
    __extends(RectPrintElement, _super);
    function RectPrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.options = new PrintElementOption(opts);
        self.options.setDefault(new PrintElementOption(KuPrintConfig.instance.rect.default).getPrintElementOptionEntity());
        return self;
    }
    RectPrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) this.css(this.designTarget, this.getData());
    };
    RectPrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.hline; };
    RectPrintElement.prototype.createTarget = function () {
        return $('<div class="kuprint-printElement kuprint-printElement-rect" style="border:1px solid;position:absolute;"></div>');
    };
    RectPrintElement.prototype.getHtml = function (paper, data, n) { return this.getHtml2(paper, data, n); };
    return RectPrintElement;
})(BasePrintElement);

// --- OvalPrintElement ---
var OvalPrintElement = (function (_super) {
    __extends(OvalPrintElement, _super);
    function OvalPrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.options = new PrintElementOption(opts);
        self.options.setDefault(new PrintElementOption(KuPrintConfig.instance.oval.default).getPrintElementOptionEntity());
        return self;
    }
    OvalPrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) this.css(this.designTarget, this.getData());
    };
    OvalPrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.hline; };
    OvalPrintElement.prototype.createTarget = function () {
        return $('<div class="kuprint-printElement kuprint-printElement-oval" style="border:1px solid;position:absolute;border-radius:50%;"></div>');
    };
    OvalPrintElement.prototype.getHtml = function (paper, data, n) { return this.getHtml2(paper, data, n); };
    return OvalPrintElement;
})(BasePrintElement);
