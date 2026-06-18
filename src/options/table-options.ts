import type { IOptionItem } from "./types.js";
// ============================================================
// options/table-options.js — table options配置项
// ============================================================

import { TableColumn } from "../table/column.js";

function TableBorderOption(this: IOptionItem) {
  this.name = "tableBorder";
}
TableBorderOption.prototype.css = function (target, value) {
  if (target.find("table").length) {
    if (value === "border") {
      target.find("table").css("border", "1px solid");
      return "border:1px solid";
    }
    if (value === "noBorder") {
      target.find("table").css("border", "0px solid");
    } else {
      target.find("table")[0].style.border = "";
    }
  }
  return null;
};
TableBorderOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表格边框</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="border">有边框</option>' +
      '<option value="noBorder">无边框</option></select></div></div>',
  );
  return this.target;
};
TableBorderOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TableBorderOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TableBorderOption.prototype.destroy = function () {
  this.target.remove();
};

function TableHeaderBorderOption(this: IOptionItem) {
  this.name = "tableHeaderBorder";
}
TableHeaderBorderOption.prototype.css = function (target, value) {
  if (target.find("thead tr").length) {
    if (value === "border") {
      target.find("thead tr").css("border", "1px solid");
      return "border:1pt solid";
    }
    if (value === "noBorder") {
      target.find("thead tr").css("border", "0px solid");
    } else if (value === "topBorder") {
      target.find("thead tr").css("border", "0px solid");
      target.find("thead tr").css("border-top", "1px solid");
    } else if (value === "bottomBorder") {
      target.find("thead tr").css("border", "0px solid");
      target.find("thead tr").css("border-bottom", "1px solid");
    } else if (value === "topBottomBorder") {
      target.find("thead tr").css("border", "0px solid");
      target.find("thead tr").css("border-top", "1px solid");
      target.find("thead tr").css("border-bottom", "1px solid");
    } else {
      target.find("thead tr").each(function (i, el) {
        el.style.border = "";
      });
    }
  }
  return null;
};
TableHeaderBorderOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表头边框</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="border">有边框</option>' +
      '<option value="noBorder">无边框</option><option value="topBorder">上边框</option>' +
      '<option value="bottomBorder">下边框</option><option value="topBottomBorder">上下边框</option>' +
      "</select></div></div>",
  );
  return this.target;
};
TableHeaderBorderOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TableHeaderBorderOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TableHeaderBorderOption.prototype.destroy = function () {
  this.target.remove();
};

function TableHeaderCellBorderOption(this: IOptionItem) {
  this.name = "tableHeaderCellBorder";
}
TableHeaderCellBorderOption.prototype.css = function (target, value) {
  if (target.find("thead tr td").length) {
    if (value === "border") {
      target.find("thead tr td").css("border", "1px solid");
      return "border:1px solid";
    }
    if (value === "noBorder") {
      target.find("thead tr td").css("border", "0px solid");
    } else {
      target.find("thead tr td").each(function (i, el) {
        el.style.border = "";
      });
    }
  }
  return null;
};
TableHeaderCellBorderOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表头单元格边框</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="border">有边框</option>' +
      '<option value="noBorder">无边框</option></select></div></div>',
  );
  return this.target;
};
TableHeaderCellBorderOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TableHeaderCellBorderOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TableHeaderCellBorderOption.prototype.destroy = function () {
  this.target.remove();
};

function TableHeaderRowHeightOption(this: IOptionItem) {
  this.name = "tableHeaderRowHeight";
}
TableHeaderRowHeightOption.prototype.css = function (target, value) {
  if (target.find("thead tr td").length) {
    if (value) {
      target.find("thead tr td").css("height", value + "pt");
    } else {
      target.find("thead tr td").each(function (i, el) {
        el.style.height = "";
      });
    }
  }
  return null;
};
TableHeaderRowHeightOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表头行高</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option>' +
      '<option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option>' +
      '<option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option>' +
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
      "</select></div></div>",
  );
  return this.target;
};
TableHeaderRowHeightOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
TableHeaderRowHeightOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
TableHeaderRowHeightOption.prototype.destroy = function () {
  this.target.remove();
};

function TableHeaderFontSizeOption(this: IOptionItem) {
  this.name = "tableHeaderFontSize";
}
TableHeaderFontSizeOption.prototype.css = function (target, value) {
  if (target.find("thead").length) {
    if (value) {
      target.find("thead").css("font-size", value + "pt");
    } else {
      target.find("thead").each(function (i, el) {
        el.style.fontSize = "";
      });
    }
  }
  return null;
};
TableHeaderFontSizeOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表头字体大小</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option>' +
      '<option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option>' +
      '<option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option>' +
      '<option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option>' +
      '<option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option>' +
      '<option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option>' +
      '<option value="21.75">21.75pt</option></select></div></div>',
  );
  return this.target;
};
TableHeaderFontSizeOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
TableHeaderFontSizeOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
TableHeaderFontSizeOption.prototype.destroy = function () {
  this.target.remove();
};

function TableHeaderFontWeightOption(this: IOptionItem) {
  this.name = "tableHeaderFontWeight";
}
TableHeaderFontWeightOption.prototype.css = function (target, value) {
  if (target.find("thead").length) {
    if (value) {
      target.find("thead tr td").css("font-weight", value);
    } else {
      target.find("thead tr td").each(function (i, el) {
        el.style.fontWeight = "";
      });
    }
  }
  return null;
};
TableHeaderFontWeightOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表头字体粗细</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="lighter">更细</option>' +
      '<option value="bold">粗体</option><option value="bolder">粗体+</option>' +
      '<option value="100">100</option><option value="200">200</option>' +
      '<option value="300">300</option><option value="400">400</option>' +
      '<option value="500">500</option><option value="600">600</option>' +
      '<option value="700">700</option><option value="800">800</option>' +
      '<option value="900">900</option></select></div></div>',
  );
  return this.target;
};
TableHeaderFontWeightOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v || undefined;
};
TableHeaderFontWeightOption.prototype.setValue = function (v) {
  if (v) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
TableHeaderFontWeightOption.prototype.destroy = function () {
  this.target.remove();
};

function TableBodyCellBorderOption(this: IOptionItem) {
  this.name = "tableBodyCellBorder";
}
TableBodyCellBorderOption.prototype.css = function (target, value) {
  if (target.find("tbody tr td").length) {
    if (value === "border") {
      target.find("tbody tr td").css("border", "1px solid");
      return "border:1px solid";
    }
    if (value === "noBorder") {
      target.find("tbody tr td").css("border", "0px solid");
    } else {
      target.find("tbody tr td").each(function (i, el) {
        el.style.border = "";
      });
    }
  }
  return null;
};
TableBodyCellBorderOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表体单元格</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="border">有边框</option>' +
      '<option value="noBorder">无边框</option></select></div></div>',
  );
  return this.target;
};
TableBodyCellBorderOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TableBodyCellBorderOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TableBodyCellBorderOption.prototype.destroy = function () {
  this.target.remove();
};

function TableBodyRowHeightOption(this: IOptionItem) {
  this.name = "tableBodyRowHeight";
}
TableBodyRowHeightOption.prototype.css = function (target, value) {
  if (target.find("tbody tr td").length) {
    if (value) {
      target.find("tbody tr td").css("height", value + "pt");
    } else {
      target.find("tbody tr td").each(function (i, el) {
        el.style.height = "";
      });
    }
  }
  return null;
};
TableBodyRowHeightOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表体行高</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option>' +
      '<option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option>' +
      '<option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option>' +
      '<option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option>' +
      '<option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option>' +
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
      "</select></div></div>",
  );
  return this.target;
};
TableBodyRowHeightOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
TableBodyRowHeightOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
TableBodyRowHeightOption.prototype.destroy = function () {
  this.target.remove();
};

function TableHeaderBackgroundOption(this: IOptionItem) {
  this.name = "tableHeaderBackground";
}
TableHeaderBackgroundOption.prototype.css = function (target, value) {
  if (target.find("thead").length) {
    if (value) {
      target.find("thead").css("background-color", value);
    } else {
      target.find("thead").each(function (i, el) {
        el.style.backgroundColor = "";
      });
    }
  }
  return null;
};
TableHeaderBackgroundOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表头背景</div>' +
      '<div class="kuprint-option-item-field"><input type="text" class="auto-submit" /></div></div>',
  );
  return this.target;
};
TableHeaderBackgroundOption.prototype.getValue = function () {
  var v = this.target.find("input").val();
  return v ? v.toString() : undefined;
};
TableHeaderBackgroundOption.prototype.setValue = function (v) {
  this.target.find("input").minicolors({ defaultValue: v || "", theme: "bootstrap" });
  this.target.find("input").val(v);
};
TableHeaderBackgroundOption.prototype.destroy = function () {
  this.target.remove();
};

function TableBodyRowBorderOption(this: IOptionItem) {
  this.name = "tableBodyRowBorder";
}
TableBodyRowBorderOption.prototype.css = function (target, value) {
  if (target.find("tbody tr").length) {
    if (value === "border") {
      target.find("tbody tr").css("border", "1px solid");
    } else if (value === "noBorder") {
      target.find("tbody tr").css("border", "0px solid");
    } else if (value === "topBorder") {
      target.find("tbody tr").css("border", "0px solid");
      target.find("tbody tr").css("border-top", "1px solid");
    } else if (value === "bottomBorder") {
      target.find("tbody tr").css("border", "0px solid");
      target.find("tbody tr").css("border-bottom", "1px solid");
    } else if (value === "topBottomBorder") {
      target.find("tbody tr").css("border", "0px solid");
      target.find("tbody tr").css("border-top", "1px solid");
      target.find("tbody tr").css("border-bottom", "1px solid");
    } else {
      target.find("tbody tr").each(function (i, el) {
        el.style.border = "";
      });
    }
  }
  return null;
};
TableBodyRowBorderOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表体行边框</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="border">有边框</option>' +
      '<option value="noBorder">无边框</option><option value="topBorder">上边框</option>' +
      '<option value="bottomBorder">下边框</option><option value="topBottomBorder">上下边框</option>' +
      "</select></div></div>",
  );
  return this.target;
};
TableBodyRowBorderOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TableBodyRowBorderOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TableBodyRowBorderOption.prototype.destroy = function () {
  this.target.remove();
};

function ColumnsOption(this: IOptionItem) {
  this.name = "columns";
}
ColumnsOption.prototype.createTarget = function () {
  $('<div class="indicator"></div>').appendTo("body");
  this.target = $(
    '<div class="kuprint-option-item kuprint-option-item-row">' +
      '<div><ul class="kuprint-option-table-selected-columns"></ul></div></div>',
  );
  return this.target;
};
ColumnsOption.prototype.getValue = function () {
  return this.buildData();
};
ColumnsOption.prototype.setValue = function (value, options, printElementType) {
  var self = this;
  this.value = value;
  this.options = options;
  this.printElementType = printElementType;
  var unselected = printElementType.columns[0]
    .filter(function (col) {
      return (
        value[0].columns.filter(function (vc) {
          return col.columnId === vc.columnId;
        }).length === 0
      );
    })
    .map(function (col) {
      var c = new (TableColumn as any)(col);
      c.checked = false;
      return c;
    });
  this.allColumns = value[0].columns.concat(unselected);
  if (value && value.length === 1) {
    this.target.find("ul").html(
      this.allColumns
        .map(function (col) {
          return (
            '<li class="kuprint-option-table-selected-item">' +
            '<div class="hi-pretty p-default">' +
            (col.checked
              ? '<input type="checkbox" checked column-id="' + (col.columnId || "") + '" />'
              : '<input type="checkbox" column-id="' + (col.columnId || "") + '" />') +
            '<div class="state"><label></label></div></div>' +
            '<span class="column-title">' +
            (col.title || col.descTitle || "") +
            "</span></li>"
          );
        })
        .join(""),
    );
    this.target.find("input").change(function () {
      self.submit();
    });
    if (this.printElementType.columnDisplayIndexEditable) {
      this.target
        .find("li")
        .hidraggable({
          revert: true,
          handle: ".column-title",
          moveUnit: "pt",
          deltaX: 0,
          deltaY: 0,
        })
        .hidroppable({
          onDragOver: function () {
            $(this).css("border-bottom-color", "red");
          },
          onDragLeave: function () {
            $(this).css("border-bottom-color", "");
          },
          onDrop: function (e, el) {
            $(el).insertAfter(this);
            $(this).css("border-bottom-color", "");
            self.submit();
          },
        });
    }
  }
};
ColumnsOption.prototype.buildData = function () {
  var self = this;
  var result = [];
  this.allColumns.forEach(function (col) {
    col.checked = false;
  });
  var inputs = this.printElementType.columnDisplayEditable
    ? this.target.find("input:checked")
    : this.target.find("input");
  inputs.each(function (idx, el) {
    var columnId = $(el).attr("column-id");
    var colMap = self.options.makeColumnObj();
    if (colMap[columnId]) {
      colMap[columnId].checked = true;
      result.push(colMap[columnId]);
    } else {
      var col = self.printElementType.getColumnByColumnId(columnId);
      if (col) {
        var c = new (TableColumn as any)(col);
        c.checked = true;
        result.push(c);
      }
    }
  });
  this.value[0].columns = result;
  return this.value;
};
ColumnsOption.prototype.destroy = function () {
  this.target.remove();
};

function GridColumnsOption(this: IOptionItem) {
  this.name = "gridColumns";
}
GridColumnsOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">一行多组</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="2">一行二列</option>' +
      '<option value="3">一行三列</option><option value="4">一行四列</option>' +
      "</select></div></div>",
  );
  return this.target;
};
GridColumnsOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
GridColumnsOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
GridColumnsOption.prototype.destroy = function () {
  this.target.remove();
};

function GridColumnsGutterOption(this: IOptionItem) {
  this.name = "gridColumnsGutter";
}
GridColumnsGutterOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">一行多组间隔</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="1.5">1.5pt</option>' +
      '<option value="2.25">2.25pt</option><option value="3">3pt</option>' +
      '<option value="3.75">3.75pt</option><option value="4.5">4.5pt</option>' +
      '<option value="5.25">5.25pt</option><option value="6">6pt</option>' +
      '<option value="6.75">6.75pt</option><option value="7.25">7.25pt</option>' +
      '<option value="8.5">8.5pt</option><option value="9">9pt</option>' +
      "</select></div></div>",
  );
  return this.target;
};
GridColumnsGutterOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? parseFloat(v.toString()) : undefined;
};
GridColumnsGutterOption.prototype.css = function (target, value) {
  if (target && target.length) {
    if (value) {
      target
        .find(".table-grid-row")
        .css("margin-left", "-" + value + "pt")
        .css("margin-right", "-" + value + "pt");
      target
        .find(".tableGridColumnsGutterRow")
        .css("padding-left", value + "pt")
        .css("padding-right", value + "pt");
      return null;
    }
    target.find(".table-grid-row").each(function (i, el) {
      el.style.marginLeft = "";
      el.style.marginRight = "";
    });
    target.find(".tableGridColumnsGutterRow").each(function (i, el) {
      el.style.paddingLeft = "";
      el.style.paddingRight = "";
    });
  }
  return null;
};
GridColumnsGutterOption.prototype.setValue = function (v) {
  if (v !== undefined && v !== null) {
    if (!this.target.find('option[value="' + v + '"]').length) {
      this.target.find("select").prepend('<option value="' + v + '">' + v + "</option>");
    }
    this.target.find("select").val(v);
  }
};
GridColumnsGutterOption.prototype.destroy = function () {
  this.target.remove();
};

function TableFooterRepeatOption(this: IOptionItem) {
  this.name = "tableFooterRepeat";
}
TableFooterRepeatOption.prototype.createTarget = function () {
  this.target = $(
    '<div class="kuprint-option-item">' +
      '<div class="kuprint-option-item-label">表格脚显示</div>' +
      '<div class="kuprint-option-item-field"><select class="auto-submit">' +
      '<option value="">默认</option><option value="no">不显示</option>' +
      '<option value="page">每页显示</option><option value="last">最后显示</option>' +
      "</select></div></div>",
  );
  return this.target;
};
TableFooterRepeatOption.prototype.getValue = function () {
  var v = this.target.find("select").val();
  return v ? v.toString() : undefined;
};
TableFooterRepeatOption.prototype.setValue = function (v) {
  this.target.find("select").val(v);
};
TableFooterRepeatOption.prototype.destroy = function () {
  this.target.remove();
};

export default [
  new TableBorderOption(),
  new TableHeaderBorderOption(),
  new TableHeaderCellBorderOption(),
  new TableHeaderRowHeightOption(),
  new TableHeaderFontSizeOption(),
  new TableHeaderFontWeightOption(),
  new TableBodyCellBorderOption(),
  new TableBodyRowHeightOption(),
  new TableHeaderBackgroundOption(),
  new TableBodyRowBorderOption(),
  new ColumnsOption(),
  new GridColumnsOption(),
  new GridColumnsGutterOption(),
  new TableFooterRepeatOption(),
];
