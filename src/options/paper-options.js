// ============================================================
// options/paper-options.js — paper options配置项
// 从 core/option-items.js 拆分
// ============================================================

(function() {

    function PaperNumberFormatOption() {
        this.name = "paperNumberFormat";
    }
    PaperNumberFormatOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">页码格式</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="paperNo-paperCount" class="auto-submit"></div></div>');
        return this.target;
    };
    PaperNumberFormatOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? v.toString() : undefined;
    };
    PaperNumberFormatOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    PaperNumberFormatOption.prototype.destroy = function () { this.target.remove(); };

    function PaperNumberDisabledOption() {
        this.name = "paperNumberDisabled";
    }
    PaperNumberDisabledOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">启用/禁用</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="false">启用</option>' +
            '<option value="true">禁用</option></select></div></div>');
        return this.target;
    };
    PaperNumberDisabledOption.prototype.getValue = function () {
        if (this.target.find("select").val() === "true") return true;
    };
    PaperNumberDisabledOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    PaperNumberDisabledOption.prototype.destroy = function () { this.target.remove(); };

    function LongTextIndentOption() {
        this.name = "longTextIndent";
    }
    LongTextIndentOption.prototype.css = function (target, value) { return null; };
    LongTextIndentOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">每行缩进</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option>' +
            '<option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
            '<option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option>' +
            '<option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option>' +
            '<option value="12.75">12.75pt</option><option value="13.5">13pt</option><option value="14.25">14.25pt</option>' +
            '<option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
            '<option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option>' +
            '<option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option>' +
            '<option value="21.75">21.75pt</option><option value="22.5">22.5pt</option><option value="23.25">23.25pt</option>' +
            '<option value="24">24pt</option><option value="24.75">24.75pt</option><option value="25.5">25.5pt</option>' +
            '<option value="26.25">26.25pt</option><option value="27">27pt</option><option value="27.75">27.75pt</option>' +
            '<option value="28.5">28.5pt</option><option value="29.25">29.25pt</option><option value="30">30pt</option>' +
            '<option value="30.75">30.75pt</option><option value="31.5">31.5pt</option><option value="32.25">32.25pt</option>' +
            '<option value="33">33pt</option><option value="33.75">33.75pt</option><option value="34.5">34.5pt</option>' +
            '<option value="35.25">35.25pt</option><option value="36">36pt</option>' +
            '</select></div></div>');
        return this.target;
    };
    LongTextIndentOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    LongTextIndentOption.prototype.setValue = function (v) {
        if (v !== undefined && v !== null) {
            if (!this.target.find('option[value="' + v + '"]').length) {
                this.target.find("select").prepend('<option value="' + v + '">' + v + '</option>');
            }
            this.target.find("select").val(v);
        }
    };
    LongTextIndentOption.prototype.destroy = function () { this.target.remove(); };

    function ShowInPageOption() {
        this.name = "showInPage";
    }
    ShowInPageOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">显示规则</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="first">首页</option>' +
            '<option value="odd">奇数页</option><option value="even">偶数页</option>' +
            '<option value="last">尾页</option></select></div></div>');
        return this.target;
    };
    ShowInPageOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? v.toString() : undefined;
    };
    ShowInPageOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    ShowInPageOption.prototype.destroy = function () { this.target.remove(); };

    function PanelPaperRuleOption() {
        this.name = "panelPaperRule";
    }
    PanelPaperRuleOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">打印规则</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="odd">保持奇数</option>' +
            '<option value="even">保持偶数</option></select></div></div>');
        return this.target;
    };
    PanelPaperRuleOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v ? v.toString() : undefined;
    };
    PanelPaperRuleOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    PanelPaperRuleOption.prototype.destroy = function () { this.target.remove(); };

    function LeftSpaceRemovedOption() {
        this.name = "leftSpaceRemoved";
    }
    LeftSpaceRemovedOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">移除段落左侧空白</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="true">移除</option>' +
            '<option value="false">不移除</option></select></div></div>');
        return this.target;
    };
    LeftSpaceRemovedOption.prototype.getValue = function () {
        if (this.target.find("select").val() === "false") return false;
    };
    LeftSpaceRemovedOption.prototype.setValue = function (v) {
        this.target.find("select").val((v == null ? "" : v).toString());
    };
    LeftSpaceRemovedOption.prototype.destroy = function () { this.target.remove(); };

    function FirstPaperFooterOption() {
        this.name = "firstPaperFooter";
    }
    FirstPaperFooterOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">首页页尾</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="首页页尾" class="auto-submit"></div></div>');
        return this.target;
    };
    FirstPaperFooterOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    FirstPaperFooterOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    FirstPaperFooterOption.prototype.destroy = function () { this.target.remove(); };

    function LastPaperFooterOption() {
        this.name = "lastPaperFooter";
    }
    LastPaperFooterOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">尾页页尾</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="尾页页尾" class="auto-submit"></div></div>');
        return this.target;
    };
    LastPaperFooterOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    LastPaperFooterOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    LastPaperFooterOption.prototype.destroy = function () { this.target.remove(); };

    function EvenPaperFooterOption() {
        this.name = "evenPaperFooter";
    }
    EvenPaperFooterOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">偶数页页尾</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="偶数页页尾" class="auto-submit"></div></div>');
        return this.target;
    };
    EvenPaperFooterOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    EvenPaperFooterOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    EvenPaperFooterOption.prototype.destroy = function () { this.target.remove(); };

    function OddPaperFooterOption() {
        this.name = "oddPaperFooter";
    }
    OddPaperFooterOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">奇数页页尾</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="奇数页页尾" class="auto-submit"></div></div>');
        return this.target;
    };
    OddPaperFooterOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    OddPaperFooterOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    OddPaperFooterOption.prototype.destroy = function () { this.target.remove(); };

    function FixedOption() {
        this.name = "fixed";
    }
    FixedOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">位置固定</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="false">否</option>' +
            '<option value="true">是</option></select></div></div>');
        return this.target;
    };
    FixedOption.prototype.getValue = function () {
        if (this.target.find("select").val() === "true") return true;
    };
    FixedOption.prototype.setValue = function (v) {
        this.target.find("select").val((v == null ? "" : v).toString());
    };
    FixedOption.prototype.destroy = function () { this.target.remove(); };

    function AxisOption() {
        this.name = "axis";
    }
    AxisOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">拖动方向</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="v">横向</option>' +
            '<option value="h">竖向</option></select></div></div>');
        return this.target;
    };
    AxisOption.prototype.getValue = function () {
        var v = this.target.find("select").val();
        return v || undefined;
    };
    AxisOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    AxisOption.prototype.destroy = function () { this.target.remove(); };

    function TopOffsetOption() {
        this.name = "topOffset";
    }
    TopOffsetOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">顶部偏移</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="偏移量pt" class="auto-submit"></div></div>');
        return this.target;
    };
    TopOffsetOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    TopOffsetOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    TopOffsetOption.prototype.destroy = function () { this.target.remove(); };

    function LeftOffsetOption() {
        this.name = "leftOffset";
    }
    LeftOffsetOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">左偏移</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="偏移量pt" class="auto-submit"></div></div>');
        return this.target;
    };
    LeftOffsetOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    LeftOffsetOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    LeftOffsetOption.prototype.destroy = function () { this.target.remove(); };

    function LHeightOption() {
        this.name = "lHeight";
    }
    LHeightOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item kuprint-option-item-row">' +
            '<div class="kuprint-option-item-label">最低高度</div>' +
            '<div class="kuprint-option-item-field">' +
            '<input type="text" placeholder="文本过短或为空时的高度" class="auto-submit"></div></div>');
        return this.target;
    };
    LHeightOption.prototype.getValue = function () {
        var v = this.target.find("input").val();
        return v ? parseFloat(v.toString()) : undefined;
    };
    LHeightOption.prototype.setValue = function (v) { this.target.find("input").val(v); };
    LHeightOption.prototype.destroy = function () { this.target.remove(); };

    function UnShowInPageOption() {
        this.name = "unShowInPage";
    }
    UnShowInPageOption.prototype.createTarget = function () {
        this.target = $('<div class="kuprint-option-item">' +
            '<div class="kuprint-option-item-label">隐藏规则</div>' +
            '<div class="kuprint-option-item-field"><select class="auto-submit">' +
            '<option value="">默认</option><option value="first">首页</option>' +
            '<option value="last">尾页</option></select></div></div>');
        return this.target;
    };
    UnShowInPageOption.prototype.getValue = function () {
        return this.target.find("select").val() || undefined;
    };
    UnShowInPageOption.prototype.setValue = function (v) { this.target.find("select").val(v); };
    UnShowInPageOption.prototype.destroy = function () { this.target.remove(); };


// 将实例注册到共享数组
window.__printElementOptionItems = window.__printElementOptionItems || [];
window.__printElementOptionItems.push(
    new PaperNumberFormatOption(),
    new PaperNumberDisabledOption(),
    new LongTextIndentOption(),
    new ShowInPageOption(),
    new PanelPaperRuleOption(),
    new LeftSpaceRemovedOption(),
    new FirstPaperFooterOption(),
    new LastPaperFooterOption(),
    new EvenPaperFooterOption(),
    new OddPaperFooterOption(),
    new FixedOption(),
    new AxisOption(),
    new TopOffsetOption(),
    new LeftOffsetOption(),
    new LHeightOption(),
    new UnShowInPageOption()
);

})();
