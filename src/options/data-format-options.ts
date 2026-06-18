import type { IOptionItem } from "./types.js";
// ============================================================
// options/data-format-options.js — data format options配置项
// ============================================================

function BarcodeModeOption(this: IOptionItem) {
  this.name = "barcodeMode";
}
BarcodeModeOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">条形码格式</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option>' +
      '<option value="CODE128A">CODE128A</option><option value="CODE128B">CODE128B</option>' +
      '<option value="CODE128C">CODE128C</option><option value="CODE39">CODE39</option>' +
      '<option value="EAN-13">EAN-13</option><option value="EAN-8">EAN-8</option>' +
      '<option value="EAN-5">EAN-5</option><option value="EAN-2">EAN-2</option>' +
      '<option value="UPC（A）">UPC（A）</option><option value="ITF">ITF</option>' +
      '<option value="ITF-14">ITF-14</option><option value="MSI">MSI</option>' +
      '<option value="MSI10">MSI10</option><option value="MSI11">MSI11</option>' +
      '<option value="MSI1010">MSI1010</option><option value="MSI1110">MSI1110</option>' +
      '<option value="Pharmacode">Pharmacode</option></select></div></div>',
  );
  return this.target;
};
BarcodeModeOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v || undefined;
};
BarcodeModeOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
BarcodeModeOption.prototype.destroy = function () {
  this.target.remove();
};

function ColorOption(this: IOptionItem) {
  this.name = "color";
}
ColorOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("color", value);
      return "color:" + value;
    }
    target[0].style.color = "";
  }
  return null;
};
ColorOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">字体颜色</div>' +
      '<div class="kuprint-option-item-field"><input type="text" class="auto-submit"/></div></div>',
  );
  return this.target;
};
ColorOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? v.toString() : undefined;
};
ColorOption.prototype.setValue = function (v) {
  this.target.find("input").minicolors({ defaultValue: v || "", theme: "bootstrap" });
  this.target.find("input").val(v);
};
ColorOption.prototype.destroy = function () {
  this.target.remove();
};

function TextDecorationOption(this: IOptionItem) {
  this.name = "textDecoration";
}
TextDecorationOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">文本修饰</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="underline">下划线</option>' +
      '<option value="overline">上划线</option><option value="line-through">穿梭线</option>' +
      "</select></div></div>",
  );
  return this.target;
};
TextDecorationOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("text-decoration", value);
      return "text-decoration:" + value;
    }
    target[0].style.textDecoration = "";
  }
  return null;
};
TextDecorationOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TextDecorationOption.prototype.setValue = function (v) {
  if (v) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
TextDecorationOption.prototype.destroy = function () {
  this.target.remove();
};

function FieldOption(this: IOptionItem) {
  this.name = "field";
}
FieldOption.prototype.createTarget = function (printElement) {
  var fields = printElement ? printElement.getFields() : undefined;
  if (fields) {
    this.isSelect = true;
    var html =
      '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">字段名</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">请选择字段</option>';
    fields.forEach(function (field, idx) {
      html += '<option value="' + field + '">' + field + "</option>";
    });
    html += "</select></div></div>";
    this.target = $(html);
  } else {
    this.isSelect = false;
    this.target = $(
      '<div class="kuprint-option-item kuprint-option-item-row">' +
        '<div class="kuprint-option-item-label">字段名</div>' +
        '<div class="kuprint-option-item-field">' +
        '<input type="text" placeholder="请输入字段名" class="auto-submit"></div></div>',
    );
  }
  return this.target;
};
FieldOption.prototype.getValue = function () {
  return (
    (this.isSelect ? this.target.find("select").val() : this.target.find("input").val()) ||
    undefined
  );
};
FieldOption.prototype.setValue = function (v) {
  if (this.isSelect) {
    if (v) {
      if (!this.target.find('option[value="' + v + '"]').length) {
        this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
      }
      this.target.find("select").val(v);
    }
  } else {
    this.target.find("input").val(v);
  }
};
FieldOption.prototype.destroy = function () {
  this.target.remove();
};

function TitleOption(this: IOptionItem) {
  this.name = "title";
}
TitleOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">标题</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:50px;" placeholder="请输入标题" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
TitleOption.prototype.getValue = function () {
  var v = this.target.find("textarea").val();
  return v || undefined;
};
TitleOption.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
TitleOption.prototype.destroy = function () {
  this.target.remove();
};

function TestDataOption(this: IOptionItem) {
  this.name = "testData";
}
TestDataOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">测试数据</div>' +
      '<div class="kuprint-option-item-field">' +
      '<input type="text" placeholder="仅字段名称存在时有效" class="auto-submit"></div></div>',
  );
  return this.target;
};
TestDataOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? v.toString() : undefined;
};
TestDataOption.prototype.setValue = function (v) {
  this.target.find("input").val(v);
};
TestDataOption.prototype.destroy = function () {
  this.target.remove();
};

function SrcOption(this: IOptionItem) {
  this.name = "src";
}
SrcOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">图片地址</div>' +
      '<div class="kuprint-option-item-field">' +
      '<input type="text" placeholder="请输入图片地址" class="auto-submit"></div></div>',
  );
  return this.target;
};
SrcOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? v.toString() : undefined;
};
SrcOption.prototype.setValue = function (v) {
  this.target.find("input").val(v);
};
SrcOption.prototype.destroy = function () {
  this.target.remove();
};

function TransformOption(this: IOptionItem) {
  this.name = "transform";
}
TransformOption.prototype.css = function (target, value) {
  if (target && target.length) {
    var content = target.find(".kuprint-printElement-content");
    if (value) {
      if (content.length) {
        content.css("transform", "rotate(" + value + "deg)");
        content.css("-webkit-transform", "rotate(" + value + "deg)");
      }
    } else {
      if (content.length) content[0].style.transform = "";
    }
  }
  return null;
};
TransformOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">旋转角度</div>' +
      '<div class="kuprint-option-item-field"><input type="text" class="auto-submit"/></div></div>',
  );
  return this.target;
};
TransformOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? parseFloat(v.toString()) : undefined;
};
TransformOption.prototype.setValue = function (v) {
  this.target.find("input").val(v);
};
TransformOption.prototype.destroy = function () {
  this.target.remove();
};

function OptionsGroupOption(this: IOptionItem) {
  this.name = "optionsGroup";
}
OptionsGroupOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">边框设置</div></div>',
  );
  return this.target;
};
OptionsGroupOption.prototype.getValue = function () {};
OptionsGroupOption.prototype.setValue = function () {};
OptionsGroupOption.prototype.destroy = function () {
  this.target.remove();
};

function BackgroundColorOption(this: IOptionItem) {
  this.name = "backgroundColor";
}
BackgroundColorOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("background-color", value);
    } else {
      target[0].style.backgroundColor = "";
    }
  }
  return null;
};
BackgroundColorOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">背景颜色</div>' +
      '<div class="kuprint-option-item-field"><input type="text" class="auto-submit"/></div></div>',
  );
  return this.target;
};
BackgroundColorOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? v.toString() : undefined;
};
BackgroundColorOption.prototype.setValue = function (v) {
  this.target.find("input").minicolors({ defaultValue: v || "", theme: "bootstrap" });
  this.target.find("input").val(v);
};
BackgroundColorOption.prototype.destroy = function () {
  this.target.remove();
};

function OrientOption(this: IOptionItem) {
  this.name = "orient";
}
OrientOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">纸张方向(仅自定义纸质有效)</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="1">纵向</option>' +
      '<option value="2">横向</option></select></div></div>',
  );
  return this.target;
};
OrientOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
OrientOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
OrientOption.prototype.destroy = function () {
  this.target.remove();
};

function TextContentVerticalAlignOption(this: IOptionItem) {
  this.name = "textContentVerticalAlign";
}
TextContentVerticalAlignOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">上下对齐</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="middle">垂直居中</option>' +
      '<option value="bottom">底部</option></select></div></div>',
  );
  return this.target;
};
TextContentVerticalAlignOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      if (value === "middle") target.addClass("kuprint-text-content-middle");
      if (value === "bottom") target.addClass("kuprint-text-content-bottom");
      return "";
    }
    target.removeClass("kuprint-text-content-middle");
    target.removeClass("kuprint-text-content-bottom");
  }
  return null;
};
TextContentVerticalAlignOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TextContentVerticalAlignOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TextContentVerticalAlignOption.prototype.destroy = function () {
  this.target.remove();
};

function DataTypeOption(this: IOptionItem) {
  this.name = "dataType";
}
DataTypeOption.prototype.createTarget = function () {
  var self = this;
  this.target = $(
    '<div class="kuprint-option-item-row">' +
      '<div class="kuprint-option-item"><div class="kuprint-option-item-label">数据类型</div>' +
      '<div class="kuprint-option-item-field"><select class="kuprint-option-item-datatype">' +
      '<option value="">默认</option><option value="datetime">日期时间</option>' +
      '<option value="boolean">布尔</option></select></div></div>' +
      '<div class="kuprint-option-item"><div class="kuprint-option-item-label">格式</div>' +
      '<div class="kuprint-option-item-field">' +
      '<select class="auto-submit kuprint-option-item-datatype-select-format"><option value="">默认</option></select>' +
      '<input class="auto-submit kuprint-option-item-datatype-input-format" type="text" data-type="boolean" placeholder="true:false">' +
      "</div></div></div>",
  );
  $(this.target.find(".kuprint-option-item-datatype")).change(function () {
    var dtype = $(self.target.find(".kuprint-option-item-datatype")).val();
    self.loadFormatSelectByDataType(dtype);
    self.submit(self.getValue());
  });
  return this.target;
};
DataTypeOption.prototype.getValue = function () {
  var dtype = this.target.find(".kuprint-option-item-datatype").val();
  if (dtype) {
    var fmt = this.target.find(".kuprint-option-item-datatype-format").val();
    return { dataType: dtype, format: fmt || undefined };
  }
  return { dataType: undefined, format: undefined };
};
DataTypeOption.prototype.setValue = function (v, opts) {
  this.target.find(".kuprint-option-item-datatype").val(opts.dataType || "");
  this.loadFormatSelectByDataType(opts.dataType);
  this.target.find(".kuprint-option-item-datatype-format").val(opts.format || "");
};
DataTypeOption.prototype.destroy = function () {
  this.target.remove();
};
DataTypeOption.prototype.loadFormatSelectByDataType = function (dtype) {
  if (dtype === "boolean") {
    this.target
      .find(".kuprint-option-item-datatype-select-format")
      .removeClass("kuprint-option-item-datatype-format")
      .hide()
      .val("");
    this.target
      .find(".kuprint-option-item-datatype-input-format")
      .addClass("kuprint-option-item-datatype-format")
      .show();
  } else if (dtype === "datetime") {
    this.target
      .find(".kuprint-option-item-datatype-select-format")
      .addClass("kuprint-option-item-datatype-format")
      .show();
    this.target
      .find(".kuprint-option-item-datatype-input-format")
      .removeClass("kuprint-option-item-datatype-format")
      .hide()
      .val("");
    this.target
      .find(".kuprint-option-item-datatype-select-format")
      .html('<option value="">默认</option>' + DATETIME_FORMAT_OPTIONS);
  } else {
    this.target.find(".kuprint-option-item-datatype-select-format").show();
    this.target.find(".kuprint-option-item-datatype-input-format").hide().val("");
    this.target.find(".kuprint-option-item-datatype-format").html('<option value="">默认</option>');
  }
};
var DATETIME_FORMAT_OPTIONS =
  '<option value="M/d">M/d</option><option value="MM/dd">MM/dd</option>' +
  '<option value="yy/M/d">yy/M/d</option><option value="yy/MM/dd">yy/MM/dd</option>' +
  '<option value="yyyy/M/d">yyyy/M/d</option><option value="yyyy/MM/dd">yyyy/MM/dd</option>' +
  '<option value="yy/M/d H:m">yy/M/d H:m</option><option value="yy/M/d H:m:s">yy/M/d H:m:s</option>' +
  '<option value="yy/M/d HH:mm">yy/M/d HH:mm</option><option value="yy/M/d HH:mm:ss">yy/M/d HH:mm:ss</option>' +
  '<option value="yy/MM/dd H:m">yy/MM/dd H:m</option><option value="yy/MM/dd H:m:s">yy/MM/dd H:m:s</option>' +
  '<option value="yy/MM/dd HH:mm">yy/MM/dd HH:mm</option><option value="yy/MM/dd HH:mm:ss">yy/MM/dd HH:mm:ss</option>' +
  '<option value="yyyy/M/d H:m">yyyy/M/dd H:m</option><option value="yyyy/M/d H:m:s">yyyy/M/d H:m:s</option>' +
  '<option value="yyyy/M/d HH:mm">yyyy/M/d HH:mm</option><option value="yyyy/M/d HH:mm:ss">yyyy/M/d HH:mm:ss</option>' +
  '<option value="yyyy/MM/dd H:m">yyyy/MM/dd H:m</option><option value="yyyy/MM/dd H:m:s">yyyy/MM/dd H:m:s</option>' +
  '<option value="yyyy/MM/dd HH:mm">yyyy/MM/dd HH:mm</option><option value="yyyy/MM/dd HH:mm:ss">yyyy/MM/dd HH:mm:ss</option>' +
  '<option value="M-d">M-d</option><option value="MM-dd">MM-dd</option>' +
  '<option value="yy-M-d">yy-M-d</option><option value="yy-MM-dd">yy-MM-dd</option>' +
  '<option value="yyyy-M-d">yyyy-M-d</option><option value="yyyy-MM-dd">yyyy-MM-dd</option>' +
  '<option value="yy-M-d H:m">yy-M-d H:m</option><option value="yy-M-d H:m:s">yy-M-d H:m:s</option>' +
  '<option value="yy-M-d HH:mm">yy-M-d HH:mm</option><option value="yy-M-d HH:mm:ss">yy-M-d HH:mm:ss</option>' +
  '<option value="yy-MM-dd H:m">yy-MM-dd H:m</option><option value="yy-MM-dd H:m:s">yy-MM-dd H:m:s</option>' +
  '<option value="yy-MM-dd HH:mm">yy-MM-dd HH:mm</option><option value="yy-MM-dd HH:mm:ss">yy-MM-dd HH:mm:ss</option>' +
  '<option value="yyyy-M-d H:m">yyyy-M-d H:m</option><option value="yyyy-M-d H:m:s">yyyy-M-d H:m:s</option>' +
  '<option value="yyyy-M-d HH:mm">yyyy-M-d HH:mm</option><option value="yyyy-M-d HH:mm:ss">yyyy-M-d HH:mm:ss</option>' +
  '<option value="yyyy-MM-dd H:m">yyyy-MM-dd H:m</option><option value="yyyy-MM-dd H:m:s">yyyy-MM-dd H:m:s</option>' +
  '<option value="yyyy-MM-dd HH:mm">yyyy-MM-dd HH:mm</option><option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</option>';

function FormatterOption(this: IOptionItem) {
  this.name = "formatter";
}
FormatterOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">格式化函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="' +
      (this.placeholder || "") +
      '" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
FormatterOption.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
FormatterOption.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
FormatterOption.prototype.destroy = function () {
  this.target.remove();
};

function StylerOption(this: IOptionItem) {
  this.name = "styler";
}
StylerOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">样式函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="function(value, options, target,templateData){}" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
StylerOption.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
StylerOption.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
StylerOption.prototype.destroy = function () {
  this.target.remove();
};

function FooterFormatterOption(this: IOptionItem) {
  this.name = "footerFormatter";
}
FooterFormatterOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">表格脚函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="function(options,rows,data){ return \'<tr></tr>\' };" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
FooterFormatterOption.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
FooterFormatterOption.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
FooterFormatterOption.prototype.destroy = function () {
  this.target.remove();
};

function GridColumnsFooterFormatterOption(this: IOptionItem) {
  this.name = "gridColumnsFooterFormatter";
}
GridColumnsFooterFormatterOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">多组表格脚函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="function(options,rows,data){ return \'\' };" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
GridColumnsFooterFormatterOption.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
GridColumnsFooterFormatterOption.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
GridColumnsFooterFormatterOption.prototype.destroy = function () {
  this.target.remove();
};

function RowStylerOption(this: IOptionItem) {
  this.name = "rowStyler";
}
RowStylerOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">行样式函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="请输入标题" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
RowStylerOption.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
RowStylerOption.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
RowStylerOption.prototype.destroy = function () {
  this.target.remove();
};

function AlignOption(this: IOptionItem) {
  this.name = "align";
}
AlignOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">单元格左右对齐</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="left">居左</option>' +
      '<option value="center">居中</option><option value="right">居右</option>' +
      '<option value="justify">两端对齐</option></select></div></div>',
  );
  return this.target;
};
AlignOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
AlignOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
AlignOption.prototype.destroy = function () {
  this.target.remove();
};

function VAlignOption(this: IOptionItem) {
  this.name = "vAlign";
}
VAlignOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">单元格上下对齐</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="top">上</option>' +
      '<option value="middle">中</option><option value="bottom">居右</option>' +
      "</select></div></div>",
  );
  return this.target;
};
VAlignOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
VAlignOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
VAlignOption.prototype.destroy = function () {
  this.target.remove();
};

function HAlignOption(this: IOptionItem) {
  this.name = "halign";
}
HAlignOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表格头单元格左右对齐</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="left">居左</option>' +
      '<option value="center">居中</option><option value="right">居右</option>' +
      '<option value="justify">两端对齐</option></select></div></div>',
  );
  return this.target;
};
HAlignOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
HAlignOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
HAlignOption.prototype.destroy = function () {
  this.target.remove();
};

function Styler2Option() {
  this.name = "styler2";
}
Styler2Option.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">单元格样式函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="function(value,row,index,options){ return {color:\'red\'} };" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
Styler2Option.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
Styler2Option.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
Styler2Option.prototype.destroy = function () {
  this.target.remove();
};

function Formatter2Option() {
  this.name = "formatter2";
}
Formatter2Option.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div class="kuprint-option-item-label">单元格格式化函数</div>' +
      '<div class="kuprint-option-item-field">' +
      '<textarea style="height:80px;" placeholder="function(value,row,index,options){ return \'\' };" class="auto-submit"></textarea></div></div>',
  );
  return this.target;
};
Formatter2Option.prototype.getValue = function () {
  return this.target.find("textarea").val() || undefined;
};
Formatter2Option.prototype.setValue = function (v) {
  this.target.find("textarea").val(v);
};
Formatter2Option.prototype.destroy = function () {
  this.target.remove();
};

function AutoCompletionOption(this: IOptionItem) {
  this.name = "autoCompletion";
}
AutoCompletionOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">自动补全</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="true">是</option>' +
      '<option value="false">否</option></select></div></div>',
  );
  return this.target;
};
AutoCompletionOption.prototype.getValue = function () {
  if (this.target.find("select").val() === "true") return true;
};
AutoCompletionOption.prototype.setValue = function (v) {
  this.target.find("select").val((v == null ? "" : v).toString());
};
AutoCompletionOption.prototype.destroy = function () {
  this.target.remove();
};

export default [
  new BarcodeModeOption(),
  new ColorOption(),
  new TextDecorationOption(),
  new FieldOption(),
  new TitleOption(),
  new TestDataOption(),
  new SrcOption(),
  new DataTypeOption(),
  new FormatterOption(),
  new StylerOption(),
  new FooterFormatterOption(),
  new GridColumnsFooterFormatterOption(),
  new RowStylerOption(),
  new AlignOption(),
  new VAlignOption(),
  new HAlignOption(),
  new Styler2Option(),
  new Formatter2Option(),
  new AutoCompletionOption(),
  new BackgroundColorOption(),
  new OrientOption(),
  new TextContentVerticalAlignOption(),
  new TransformOption(),
  new OptionsGroupOption(),
];
