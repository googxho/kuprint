// ============================================================
// options/border-layout-options.js — border layout options配置项
// ============================================================

function BorderWidthOption() {
  this.name = "borderWidth";
}
BorderWidthOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">边框大小</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option>' +
      '<option value="0.75">0.75pt</option><option value="1.5">1.5pt</option>' +
      '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
      '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
      '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
      '<option value="6.75">6.75pt</option></select></div></div>',
  );
  return this.target;
};
BorderWidthOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-width", value + "pt");
      return "border-width:" + value + "pt";
    }
    target[0].style.borderWidth = "";
  }
  return null;
};
BorderWidthOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
BorderWidthOption.prototype.setValue = function (v) {
  if (v) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
BorderWidthOption.prototype.destroy = function () {
  this.target.remove();
};

function BorderColorOption() {
  this.name = "borderColor";
}
BorderColorOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-color", value);
      return "border-color:" + value;
    }
    target[0].style.borderColor = "";
  }
  return null;
};
BorderColorOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">边框颜色</div>' +
      '<div class="kuprint-option-item-field"><input type="text" class="auto-submit" /></div></div>',
  );
  return this.target;
};
BorderColorOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? v.toString() : undefined;
};
BorderColorOption.prototype.setValue = function (v) {
  this.target.find("input").minicolors({ defaultValue: v || "", theme: "bootstrap" });
  this.target.find("input").val(v);
};
BorderColorOption.prototype.destroy = function () {
  this.target.remove();
};

function BorderTopOption() {
  this.name = "borderTop";
}
BorderTopOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-top-style", value);
      target.css("border-top-width", "1px");
    } else {
      target[0].style.borderTopStyle = "";
      target[0].style.borderTopWidth = "";
    }
  }
  return null;
};
BorderTopOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">上边框</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">否</option><option value="solid">实线</option>' +
      '<option value="dotted">虚线</option></select></div></div>',
  );
  return this.target;
};
BorderTopOption.prototype.getValue = function () {
  return this.target.find("select").val() || undefined;
};
BorderTopOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
BorderTopOption.prototype.destroy = function () {
  this.target.remove();
};

function BorderLeftOption() {
  this.name = "borderLeft";
}
BorderLeftOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-left-style", value);
      target.css("border-left-width", "1px");
    } else {
      target[0].style.borderLeftStyle = "";
      target[0].style.borderLeftWidth = "";
    }
  }
  return null;
};
BorderLeftOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">左边框</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">否</option><option value="solid">实线</option>' +
      '<option value="dotted">虚线</option></select></div></div>',
  );
  return this.target;
};
BorderLeftOption.prototype.getValue = function () {
  return this.target.find("select").val() || undefined;
};
BorderLeftOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
BorderLeftOption.prototype.destroy = function () {
  this.target.remove();
};

function BorderRightOption() {
  this.name = "borderRight";
}
BorderRightOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-right-style", value);
      target.css("border-right-width", "1px");
    } else {
      target[0].style.borderRightStyle = "";
      target[0].style.borderRightWidth = "";
    }
  }
  return null;
};
BorderRightOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">右边框</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">否</option><option value="solid">实线</option>' +
      '<option value="dotted">虚线</option></select></div></div>',
  );
  return this.target;
};
BorderRightOption.prototype.getValue = function () {
  return this.target.find("select").val() || undefined;
};
BorderRightOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
BorderRightOption.prototype.destroy = function () {
  this.target.remove();
};

function BorderBottomOption() {
  this.name = "borderBottom";
}
BorderBottomOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-bottom-style", value);
      target.css("border-bottom-width", "1px");
    } else {
      target[0].style.borderBottomStyle = "";
      target[0].style.borderBottomWidth = "";
    }
  }
  return null;
};
BorderBottomOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">下边框</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">否</option><option value="solid">实线</option>' +
      '<option value="dotted">虚线</option></select></div></div>',
  );
  return this.target;
};
BorderBottomOption.prototype.getValue = function () {
  return this.target.find("select").val() || undefined;
};
BorderBottomOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
BorderBottomOption.prototype.destroy = function () {
  this.target.remove();
};

function ContentPaddingTopOption() {
  this.name = "contentPaddingTop";
}
ContentPaddingTopOption.prototype.css = function (target, value) {
  var content = target.find(".kuprint-printElement-content");
  if (content && content.length) {
    if (value) {
      content.css("padding-top", value + "pt");
    } else {
      content[0].style.paddingTop = "";
    }
  }
  return null;
};
ContentPaddingTopOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">上内边距</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">默认</option>' +
      '<option value="0.75">0.75pt</option><option value="1.5">1.5pt</option>' +
      '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
      '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
      '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
      '<option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option>' +
      '<option value="9.75">9.75pt</option><option value="10.5">10.5pt</option>' +
      '<option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option>' +
      '<option value="14.25">14.25pt</option><option value="15">15pt</option>' +
      '<option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option>' +
      '<option value="18.75">18.75pt</option><option value="19.5">19.5pt</option>' +
      '<option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
ContentPaddingTopOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
ContentPaddingTopOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
ContentPaddingTopOption.prototype.destroy = function () {
  this.target.remove();
};

function ContentPaddingLeftOption() {
  this.name = "contentPaddingLeft";
}
ContentPaddingLeftOption.prototype.css = function (target, value) {
  var content = target.find(".kuprint-printElement-content");
  if (content && content.length) {
    if (value) {
      content.css("padding-left", value + "pt");
    } else {
      content[0].style.paddingLeft = "";
    }
  }
  return null;
};
ContentPaddingLeftOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">左内边距</div>' +
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
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option>' +
      '<option value="14.25">14.25pt</option><option value="15">15pt</option>' +
      '<option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option>' +
      '<option value="18.75">18.75pt</option><option value="19.5">19.5pt</option>' +
      '<option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
ContentPaddingLeftOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
ContentPaddingLeftOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
ContentPaddingLeftOption.prototype.destroy = function () {
  this.target.remove();
};

function ContentPaddingRightOption() {
  this.name = "contentPaddingRight";
}
ContentPaddingRightOption.prototype.css = function (target, value) {
  var content = target.find(".kuprint-printElement-content");
  if (content && content.length) {
    if (value) {
      content.css("padding-right", value + "pt");
    } else {
      content[0].style.paddingRight = "";
    }
  }
  return null;
};
ContentPaddingRightOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">右内边距</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">默认</option>' +
      '<option value="0.75">0.75pt</option><option value="1.5">1.5pt</option>' +
      '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
      '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
      '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
      '<option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option>' +
      '<option value="9.75">9.75pt</option><option value="10.5">10.5pt</option>' +
      '<option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option>' +
      '<option value="14.25">14.25pt</option><option value="15">15pt</option>' +
      '<option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option>' +
      '<option value="18.75">18.75pt</option><option value="19.5">19.5pt</option>' +
      '<option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
ContentPaddingRightOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
ContentPaddingRightOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
ContentPaddingRightOption.prototype.destroy = function () {
  this.target.remove();
};

function ContentPaddingBottomOption() {
  this.name = "contentPaddingBottom";
}
ContentPaddingBottomOption.prototype.css = function (target, value) {
  var content = target.find(".kuprint-printElement-content");
  if (content && content.length) {
    if (value) {
      content.css("padding-bottom", value + "pt");
    } else {
      content[0].style.paddingBottom = "";
    }
  }
  return null;
};
ContentPaddingBottomOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">下内边距</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">默认</option>' +
      '<option value="0.75">0.75pt</option><option value="1.5">1.5pt</option>' +
      '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
      '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
      '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
      '<option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option>' +
      '<option value="9.75">9.75pt</option><option value="10.5">10.5pt</option>' +
      '<option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option>' +
      '<option value="14.25">14.25pt</option><option value="15">15pt</option>' +
      '<option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option>' +
      '<option value="18.75">18.75pt</option><option value="19.5">19.5pt</option>' +
      '<option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
ContentPaddingBottomOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
ContentPaddingBottomOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
ContentPaddingBottomOption.prototype.destroy = function () {
  this.target.remove();
};

function BorderStyleOption() {
  this.name = "borderStyle";
}
BorderStyleOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("border-style", value);
    } else {
      target[0].style.borderStyle = "";
    }
  }
  return null;
};
BorderStyleOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">边框样式</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="solid">实线</option>' +
      '<option value="dotted">虚线</option></select></div></div>',
  );
  return this.target;
};
BorderStyleOption.prototype.getValue = function () {
  return this.target.find("select").val() || undefined;
};
BorderStyleOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
BorderStyleOption.prototype.destroy = function () {
  this.target.remove();
};

function PaddingLeftOption() {
  this.name = "paddingLeft";
}
PaddingLeftOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("padding-left", value + "pt");
      return "padding-left";
    }
    target[0].style.paddingLeft = "";
  }
  return null;
};
PaddingLeftOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">左内边距</div>' +
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
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option>' +
      '<option value="14.25">14.25pt</option><option value="15">15pt</option>' +
      '<option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option>' +
      '<option value="18.75">18.75pt</option><option value="19.5">19.5pt</option>' +
      '<option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
PaddingLeftOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
PaddingLeftOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
PaddingLeftOption.prototype.destroy = function () {
  this.target.remove();
};

function PaddingRightOption() {
  this.name = "paddingRight";
}
PaddingRightOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target.css("padding-right", value + "pt");
      return "padding-right";
    }
    target[0].style.paddingRight = "";
  }
  return null;
};
PaddingRightOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">右内边距</div>' +
      '<div class="kuprint-option-item-field"><select>' +
      '<option value="">默认</option>' +
      '<option value="0.75">0.75pt</option><option value="1.5">1.5pt</option>' +
      '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
      '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
      '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
      '<option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option>' +
      '<option value="9.75">9.75pt</option><option value="10.5">10.5pt</option>' +
      '<option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option>' +
      '<option value="14.25">14.25pt</option><option value="15">15pt</option>' +
      '<option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option>' +
      '<option value="18.75">18.75pt</option><option value="19.5">19.5pt</option>' +
      '<option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
PaddingRightOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
PaddingRightOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
PaddingRightOption.prototype.destroy = function () {
  this.target.remove();
};

export default [
  new BorderWidthOption(),
  new BorderColorOption(),
  new BorderStyleOption(),
  new BorderTopOption(),
  new BorderLeftOption(),
  new BorderRightOption(),
  new BorderBottomOption(),
  new ContentPaddingTopOption(),
  new ContentPaddingLeftOption(),
  new ContentPaddingRightOption(),
  new ContentPaddingBottomOption(),
  new PaddingLeftOption(),
  new PaddingRightOption(),
];
