// ============================================================
// elements/image.js — 图片元素
// ImagePrintElement 继承 BasePrintElement
// ============================================================

// --- ImagePrintElement ---
var ImagePrintElement = (function (_super) {
    __extends(ImagePrintElement, _super);
    function ImagePrintElement(pte, opts) {
        var self = _super.call(this, pte) || this;
        self.options = new PrintElementOption(opts);
        self.options.setDefault(new PrintElementOption(KuPrintConfig.instance.image.default).getPrintElementOptionEntity());
        return self;
    }
    ImagePrintElement.prototype.getReizeableShowPoints = function () { return ["se"]; };
    ImagePrintElement.prototype.getData = function (data) {
        var src = "";
        if (data) {
            src = this.getField() ? (data[this.getField()] || "") : (this.options.src || this.printElementType.getData());
        } else {
            src = this.options.src || this.printElementType.getData();
        }
        var formatter = this.getFormatter();
        if (formatter) src = formatter(src, this.options, this._currenttemplateData);
        return src || "";
    };
    ImagePrintElement.prototype.createTarget = function (title, data) {
        var $el = $('<div class="kuprint-printElement kuprint-printElement-image" style="position:absolute;">' +
            '<div class="kuprint-printElement-image-content" style="height:100%;width:100%"></div></div>');
        this.updateTargetImage($el, title, data);
        return $el;
    };
    ImagePrintElement.prototype.initSizeByHtml = function ($el) {
        _super.prototype.initSizeByHtml.call(this, $el);
        this.css($el, this.getData());
    };
    ImagePrintElement.prototype.getConfigOptions = function () { return KuPrintConfig.instance.image; };
    ImagePrintElement.prototype.updateDesignViewFromOptions = function () {
        if (this.designTarget) {
            this.css(this.designTarget, this.getData());
            this.updateTargetImage(this.designTarget, this.getTitle(), this.getData());
        }
    };
    ImagePrintElement.prototype.updateTargetImage = function ($el, title, src) {
        var content = $el.find(".kuprint-printElement-image-content");
        if (content.find("img").length) {
            content.find("img").attr("src", src);
        } else {
            content.html('<img style="width:100%;height:100%;" src="' + src + '">');
        }
    };
    ImagePrintElement.prototype.getHtml = function (paper, data, n) { return this.getHtml2(paper, data, n); };
    return ImagePrintElement;
})(BasePrintElement);
