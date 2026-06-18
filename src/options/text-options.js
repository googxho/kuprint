// ============================================================
// options/text-options.js — text options配置项
// 从 core/option-items.js 拆分
// ============================================================

(function() {

    function LineHeightOption() {
        this.name = "lineHeight";
    }
    LineHeightOption.prototype.css = function (target, value) {
        if (target && target.length) {
            if (value) {
                target.css("line-height", value + "pt");
                return "line-height:" + value + "pt";
            }
            target[0].style.lineHeight = "";
        }
        return null;
    };
    LineHeightOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">字体行高</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option>' +
            '<option value="6">6pt</option><option value="6.75">6.75pt</option>' +
            '<option value="7.5">7.5pt</option><option value="8.25">8.25pt</option>' +
            '<option value="9">9pt</option><option value="9.75">9.75pt</option>' +
            '<option value="10.5">10.5pt</option><option value="11.25">11.25pt</option>' +
            '<option value="12">12pt</option><option value="12.75">12.75pt</option>' +
            '<option value="13.5">13pt</option><option value="14.25">14.25pt</option>' +
            '<option value="15">15pt</option><option value="15.75">15.75pt</option>' +
            '<option value="16.5">16.5pt</option><option value="17.25">17.25pt</option>' +
            '<option value="18">18pt</option><option value="18.75">18.75pt</option>' +
            '<option value="19.5">19.5pt</option><option value="20.25">20.25pt</option>' +
            '<option value="21">21pt</option><option value="21.75">21.75pt</option>' +
            '<option value="22.5">22.5pt</option><option value="23.25">23.25pt</option>' +
            '<option value="24">24pt</option><option value="24.75">24.75pt</option>' +
            '<option value="25.5">25.5pt</option><option value="26.25">26.25pt</option>' +
            '<option value="27">27pt</option><option value="27.75">27.75pt</option>' +
            '<option value="28.5">28.5pt</option><option value="29.25">29.25pt</option>' +
            '<option value="30">30pt</option><option value="30.75">30.75pt</option>' +
            '<option value="31.5">31.5pt</option><option value="32.25">32.25pt</option>' +
            '<option value="33">33pt</option><option value="33.75">33.75pt</option>' +
            '<option value="34.5">34.5pt</option><option value="35.25">35.25pt</option>' +
            '<option value="36">36pt</option></select></div></div>');
        return this.target;
    };
    LineHeightOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    LineHeightOption.prototype.setValue = function (v) {
        if (v !== undefined && v !== null) {
            if (!this.target.find('option[value="' + v + '"]').length) {
                this.target.find("select").prepend('<option value="' + v + '">' + v + '</option>');
            }
            this.target.find("select").val(v);
        }
    };
    LineHeightOption.prototype.destroy = function () { this.target.remove(); };

    function FontFamilyOption() {
        this.name = "fontFamily";
    }
    FontFamilyOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">字体</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option>' +
            '<option value="SimSun">宋体</option>' +
            '<option value="Microsoft YaHei">微软雅黑</option>' +
            '</select></div></div>');
        return this.target;
    };
    FontFamilyOption.prototype.css = function (target, value) {
        if (target && target.length) {
            if (value) { target.css("font-family", value); return "font-family:" + value; }
            target[0].style.fontFamily = "";
        }
        return null;
    };
    FontFamilyOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? v.toString() : undefined;
    };
    FontFamilyOption.prototype.setValue = function (v) {
        if (v) {
            if (!this.target.find('option[value="' + v + '"]').length) {
                this.target.find("select").prepend('<option value="' + v + '">' + v + '</option>');
            }
            this.target.find("select").val(v);
        }
    };
    FontFamilyOption.prototype.destroy = function () { this.target.remove(); };

    function FontSizeOption() {
        this.name = "fontSize";
    }
    FontSizeOption.prototype.css = function (target, value) {
        if (target && target.length) {
            if (value) { target.css("font-size", value + "pt"); return "font-size:" + value + "pt"; }
            target[0].style.fontSize = "";
        }
        return null;
    };
    FontSizeOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">字体大小</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option>' +
            '<option value="6">6pt</option><option value="6.75">6.75pt</option>' +
            '<option value="7.5">7.5pt</option><option value="8.25">8.25pt</option>' +
            '<option value="9">9pt</option><option value="9.75">9.75pt</option>' +
            '<option value="10.5">10.5pt</option><option value="11.25">11.25pt</option>' +
            '<option value="12">12pt</option><option value="12.75">12.75pt</option>' +
            '<option value="13.5">13.5pt</option><option value="14.25">14.25pt</option>' +
            '<option value="15">15pt</option><option value="15.75">15.75pt</option>' +
            '<option value="16.5">16.5pt</option><option value="17.25">17.25pt</option>' +
            '<option value="18">18pt</option><option value="18.75">18.75pt</option>' +
            '<option value="19.5">19.5pt</option><option value="20.25">20.25pt</option>' +
            '<option value="21">21pt</option><option value="21.75">21.75pt</option>' +
            '</select></div></div>');
        return this.target;
    };
    FontSizeOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    FontSizeOption.prototype.setValue = function (v) {
        if (v !== undefined && v !== null) {
            if (!this.target.find('option[value="' + v + '"]').length) {
                this.target.find("select").prepend('<option value="' + v + '">' + v + '</option>');
            }
            this.target.find("select").val(v);
        }
    };
    FontSizeOption.prototype.destroy = function () { this.target.remove(); };

    function FontWeightOption() {
        this.name = "fontWeight";
    }
    FontWeightOption.prototype.css = function (target, value) {
        if (target && target.length) {
            if (value) { target.css("font-weight", value); return "font-weight:" + value; }
            target[0].style.fontWeight = "";
        }
        return null;
    };
    FontWeightOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">字体粗细</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option>' +
            '<option value="lighter">更细</option><option value="bold">粗体</option>' +
            '<option value="bolder">粗体+</option>' +
            '<option value="100">100</option><option value="200">200</option>' +
            '<option value="300">300</option><option value="400">400</option>' +
            '<option value="500">500</option><option value="600">600</option>' +
            '<option value="700">700</option><option value="800">800</option>' +
            '<option value="900">900</option></select></div></div>');
        return this.target;
    };
    FontWeightOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? v.toString() : undefined;
    };
    FontWeightOption.prototype.setValue = function (v) {
        if (v) {
            if (!this.target.find('option[value="' + v + '"]').length) {
                this.target.find("select").prepend('<option value="' + v + '">' + v + '</option>');
            }
            this.target.find("select").val(v);
        }
    };
    FontWeightOption.prototype.destroy = function () { this.target.remove(); };

    function LetterSpacingOption() {
        this.name = "letterSpacing";
    }
    LetterSpacingOption.prototype.css = function (target, value) {
        if (target && target.length) {
            if (value) { target.css("letter-spacing", value + "pt"); return "letter-spacing:" + value + "pt"; }
            target[0].style.letterSpacing = "";
        }
        return null;
    };
    LetterSpacingOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">字间距</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option>' +
            '<option value="0.75">0.75pt</option><option value="1.5">1.5pt</option>' +
            '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
            '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
            '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
            '<option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
            '<option value="8.25">8.25pt</option><option value="9">9pt</option>' +
            '<option value="9.75">9.75pt</option><option value="10.5">10.5pt</option>' +
            '<option value="11.25">11.25pt</option><option value="12">12pt</option>' +
            '</select></div></div>');
        return this.target;
    };
    LetterSpacingOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    LetterSpacingOption.prototype.setValue = function (v) {
        if (v !== undefined && v !== null) {
            if (!this.target.find('option[value="' + v + '"]').length) {
                this.target.find("select").prepend('<option value="' + v + '">' + v + '</option>');
            }
            this.target.find("select").val(v);
        }
    };
    LetterSpacingOption.prototype.destroy = function () { this.target.remove(); };

    function TextAlignOption() {
        this.name = "textAlign";
    }
    TextAlignOption.prototype.css = function (target, value) {
        if (target && target.length) {
            if (value) {
                target.css("text-align", value);
                if (value === "justify") {
                    target.css("text-align-last", "justify");
                    target.css("text-justify", "distribute-all-lines");
                } else {
                    target[0].style.textAlignLast = "";
                    target[0].style.textJustify = "";
                }
                return "text-align:" + value;
            }
            target[0].style.textAlign = "";
            target[0].style.textAlignLast = "";
            target[0].style.textJustify = "";
        }
        return null;
    };
    TextAlignOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">左右对齐</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="">居左</option>' +
            '<option value="center">居中</option><option value="right">居右</option>' +
            '<option value="justify">两端对齐</option></select></div></div>');
        return this.target;
    };
    TextAlignOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? v.toString() : undefined;
    };
    TextAlignOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    TextAlignOption.prototype.destroy = function () { this.target.remove(); };

    function HideTitleOption() {
        this.name = "hideTitle";
    }
    HideTitleOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">标题显示隐藏</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="false">显示</option>' +
            '<option value="true">隐藏</option></select></div></div>');
        return this.target;
    };
    HideTitleOption.prototype.getValue = function () {
        if (this.target.find("select").val() === "true") return true;
    };
    HideTitleOption.prototype.setValue = function (v) {
        this.target.find("select").val((v == null ? "" : v).toString());
    };
    HideTitleOption.prototype.destroy = function () { this.target.remove(); };

    function TextTypeOption() {
        this.name = "textType";
    }
    TextTypeOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">打印类型</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="">文本</option>' +
            '<option value="barcode">条形码</option><option value="qrcode">二维码</option>' +
            '</select></div></div>');
        return this.target;
    };
    TextTypeOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v || undefined;
    };
    TextTypeOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    TextTypeOption.prototype.destroy = function () { this.target.remove(); };


// 将实例注册到共享数组
window.__printElementOptionItems = window.__printElementOptionItems || [];
window.__printElementOptionItems.push(
    new LineHeightOption(),
    new FontFamilyOption(),
    new FontSizeOption(),
    new FontWeightOption(),
    new LetterSpacingOption(),
    new TextAlignOption(),
    new HideTitleOption(),
    new TextTypeOption()
);

})();
