// ============================================================
// elements/text-option.js — 文本元素选项类
// TextPrintElementOption / LongTextPrintElementOption / HtmlPrintElementOption
// ============================================================

// ============================================================
// Concrete Print Element Option classes
// ============================================================
var TextPrintElementOption = (function (_super) {
    __extends(TextPrintElementOption, _super);
    function TextPrintElementOption(opts) {
        var self = _super.call(this, opts) || this;
        if (self.title) self.title = TextHelper.replaceEnterAndNewlineAndTab(self.title, "");
        return self;
    }
    TextPrintElementOption.prototype.getHideTitle = function () {
        return this.hideTitle == null ? this.defaultOptions.hideTitle : this.hideTitle;
    };
    TextPrintElementOption.prototype.getTextType = function () {
        return (this.textType == null ? this.defaultOptions.textType : this.textType) || "text";
    };
    TextPrintElementOption.prototype.getFontSize = function () {
        return (this.fontSize == null ? this.defaultOptions.fontSize : this.fontSize) || 9;
    };
    TextPrintElementOption.prototype.getBarcodeMode = function () {
        return (this.barcodeMode == null ? this.defaultOptions.barcodeMode : this.barcodeMode) || "CODE128";
    };
    return TextPrintElementOption;
})(PrintElementOption);

var LongTextPrintElementOption = (function (_super) {
    __extends(LongTextPrintElementOption, _super);
    function LongTextPrintElementOption(opts) {
        var self = _super.call(this, opts) || this;
        self.leftSpaceRemoved = opts.leftSpaceRemoved;
        return self;
    }
    LongTextPrintElementOption.prototype.getHideTitle = function () {
        return this.hideTitle == null ? this.defaultOptions.hideTitle : this.hideTitle;
    };
    return LongTextPrintElementOption;
})(PrintElementOption);

var HtmlPrintElementOption = (function (_super) {
    __extends(HtmlPrintElementOption, _super);
    function HtmlPrintElementOption(opts) { return _super.call(this, opts) || this; }
    return HtmlPrintElementOption;
})(PrintElementOption);
