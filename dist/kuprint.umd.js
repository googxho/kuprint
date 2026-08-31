(function (H) {
  typeof define == "function" && define.amd ? define([], H) : H();
})(function () {
  function H(t, e) {
    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    function n() {
      this.constructor = t;
    }
    ((n.prototype = e.prototype), (t.prototype = new n()));
  }
  var f = {};
  ((f.event = (function () {
    var t = {};
    return {
      id: 0,
      on: function (e, i) {
        (t[e] || (t[e] = []), t[e].push(i));
      },
      off: function (e, i) {
        var n = t[e];
        if (n) {
          for (var o = 0; o < n.length; o++)
            if (n[o] === i) {
              t[e].splice(o, 1);
              break;
            }
        }
      },
      trigger: function (e) {
        var i = t[e];
        if (i && i.length)
          for (var n = Array.prototype.slice.call(arguments, 1), o = 0; o < i.length; o++)
            i[o].apply(this, n);
      },
      clear: function (e) {
        t[e] = [];
      },
      getId: function () {
        return ((this.id += 1), this.id);
      },
      getNameWithId: function (e) {
        return e + "-" + this.getId();
      },
    };
  })()),
    (f.form = {
      serialize: function (t) {
        var e = $(t).serializeArray(),
          i = {};
        return (
          $.each(e, function () {
            i[this.name]
              ? Object.prototype.toString.call(i[this.name]) === "[object Array]"
                ? i[this.name].push(this.value)
                : (i[this.name] = [i[this.name], this.value])
              : (i[this.name] = this.value);
          }),
          i
        );
      },
    }),
    (f.pt = {
      dpi: 0,
      toPx: function (t) {
        return t * (this.getDpi() / 72);
      },
      getDpi: function () {
        if (!this.dpi) {
          var t = document.createElement("DIV");
          ((t.style.cssText =
            "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden"),
            document.body.appendChild(t),
            (this.dpi = t.offsetHeight));
        }
        return this.dpi;
      },
    }),
    (f.px = {
      dpi: 0,
      toPt: function (t) {
        return t * (72 / this.getDpi());
      },
      getDpi: function () {
        if (!this.dpi) {
          var t = document.createElement("DIV");
          ((t.style.cssText =
            "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden"),
            document.body.appendChild(t),
            (this.dpi = t.offsetHeight));
        }
        return this.dpi;
      },
    }),
    (f.mm = {
      toPt: function (t) {
        return (72 / 25.4) * t;
      },
      toPx: function (t) {
        return f.pt.toPx(f.mm.toPt(t));
      },
    }),
    (f.throttle = function (t, e, i) {
      var n,
        o,
        r,
        a = null,
        p = 0;
      i || (i = {});
      var s = function () {
        ((p = i.leading === !1 ? 0 : Date.now()),
          (a = null),
          (r = t.apply(n, o)),
          a || (n = o = null));
      };
      return function () {
        var l = Date.now();
        !p && i.leading !== !1 && (p = l);
        var u = e - (l - p);
        return (
          (n = this),
          (o = arguments),
          u <= 0 || u > e
            ? (a && (clearTimeout(a), (a = null)),
              (p = l),
              (r = t.apply(n, o)),
              a || (n = o = null))
            : !a && i.trailing !== !1 && (a = setTimeout(s, u)),
          r
        );
      };
    }),
    (f.debounce = function (t, e, i) {
      var n,
        o,
        r,
        a,
        p,
        s = function () {
          var l = Date.now() - a;
          l < e && l >= 0
            ? (n = setTimeout(s, e - l))
            : ((n = null), i || ((p = t.apply(r, o)), n || (r = o = null)));
        };
      return function () {
        ((r = this), (o = arguments), (a = Date.now()));
        var l = i && !n;
        return (n || (n = setTimeout(s, e)), l && ((p = t.apply(r, o)), (r = o = null)), p);
      };
    }),
    (f.toUtf8 = function (t) {
      for (var e = "", i = t.length, n = 0; n < i; n++) {
        var o = t.charCodeAt(n);
        o >= 1 && o <= 127
          ? (e += t.charAt(n))
          : o > 2047
            ? ((e += String.fromCharCode(224 | ((o >> 12) & 15))),
              (e += String.fromCharCode(128 | ((o >> 6) & 63))),
              (e += String.fromCharCode(128 | ((o >> 0) & 63))))
            : ((e += String.fromCharCode(192 | ((o >> 6) & 31))),
              (e += String.fromCharCode(128 | ((o >> 0) & 63))));
      }
      return e;
    }),
    (f.groupBy = function (t, e, i) {
      var n = {};
      return (
        t.forEach(function (o) {
          var r = JSON.stringify(i(o));
          (n[r] ||
            ((n[r] = { rows: [] }),
            e.forEach(function (a) {
              n[r][a] = o[a];
            })),
            n[r].rows.push(o));
        }),
        Object.keys(n).map(function (o) {
          return n[o];
        })
      );
    }),
    (f.orderBy = function (t, e) {
      if (t.length <= 1) return t;
      for (
        var i = Math.floor(t.length / 2), n = t.splice(i, 1)[0], o = [], r = [], a = 0;
        a < t.length;
        a++
      )
        e(t[a]) < e(n) ? o.push(t[a]) : r.push(t[a]);
      return f.orderBy(o, e).concat([n], f.orderBy(r, e));
    }),
    (f.dateFormat = function (t, e) {
      if (!t) return "";
      try {
        var i = typeof t == "string" ? new Date(t) : t,
          n = {
            "M+": i.getMonth() + 1,
            "d+": i.getDate(),
            "H+": i.getHours(),
            "m+": i.getMinutes(),
            "s+": i.getSeconds(),
            "q+": Math.floor((i.getMonth() + 3) / 3),
            S: i.getMilliseconds(),
          };
        /(y+)/.test(e) &&
          (e = e.replace(RegExp.$1, (i.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var o in n)
          new RegExp("(" + o + ")").test(e) &&
            (e = e.replace(
              RegExp.$1,
              RegExp.$1.length === 1 ? n[o] : ("00" + n[o]).substr(("" + n[o]).length),
            ));
        return e;
      } catch (r) {
        return (console.log(r), "");
      }
    }));
  var qe = {
    replaceEnterAndNewline: function (t, e) {
      return t.replace(/\r|\n/g, e);
    },
    replaceTab: function (t, e) {
      return t.replace(/\t/g, e);
    },
    replaceEnterAndNewlineAndTab: function (t, e) {
      return t.replace(/[\r\n\t]/g, e);
    },
  };
  function J() {
    this.name = "lineHeight";
  }
  ((J.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("line-height", e + "pt"), "line-height:" + e + "pt");
      t[0].style.lineHeight = "";
    }
    return null;
  }),
    (J.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">字体行高</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option><option value="22.5">22.5pt</option><option value="23.25">23.25pt</option><option value="24">24pt</option><option value="24.75">24.75pt</option><option value="25.5">25.5pt</option><option value="26.25">26.25pt</option><option value="27">27pt</option><option value="27.75">27.75pt</option><option value="28.5">28.5pt</option><option value="29.25">29.25pt</option><option value="30">30pt</option><option value="30.75">30.75pt</option><option value="31.5">31.5pt</option><option value="32.25">32.25pt</option><option value="33">33pt</option><option value="33.75">33.75pt</option><option value="34.5">34.5pt</option><option value="35.25">35.25pt</option><option value="36">36pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (J.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (J.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (J.prototype.destroy = function () {
      this.target.remove();
    }));
  function Q() {
    this.name = "fontFamily";
  }
  ((Q.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">字体</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="SimSun">宋体</option><option value="Microsoft YaHei">微软雅黑</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Q.prototype.css = function (t, e) {
      if (t && t.length) {
        if (e) return (t.css("font-family", e), "font-family:" + e);
        t[0].style.fontFamily = "";
      }
      return null;
    }),
    (Q.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (Q.prototype.setValue = function (t) {
      t &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Q.prototype.destroy = function () {
      this.target.remove();
    }));
  function _() {
    this.name = "fontSize";
  }
  ((_.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("font-size", e + "pt"), "font-size:" + e + "pt");
      t[0].style.fontSize = "";
    }
    return null;
  }),
    (_.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">字体大小</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (_.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (_.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (_.prototype.destroy = function () {
      this.target.remove();
    }));
  function Z() {
    this.name = "fontWeight";
  }
  ((Z.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("font-weight", e), "font-weight:" + e);
      t[0].style.fontWeight = "";
    }
    return null;
  }),
    (Z.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">字体粗细</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="lighter">更细</option><option value="bold">粗体</option><option value="bolder">粗体+</option><option value="100">100</option><option value="200">200</option><option value="300">300</option><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Z.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (Z.prototype.setValue = function (t) {
      t &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Z.prototype.destroy = function () {
      this.target.remove();
    }));
  function tt() {
    this.name = "letterSpacing";
  }
  ((tt.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("letter-spacing", e + "pt"), "letter-spacing:" + e + "pt");
      t[0].style.letterSpacing = "";
    }
    return null;
  }),
    (tt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">字间距</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (tt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (tt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (tt.prototype.destroy = function () {
      this.target.remove();
    }));
  function et() {
    this.name = "textAlign";
  }
  ((et.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e)
        return (
          t.css("text-align", e),
          e === "justify"
            ? (t.css("text-align-last", "justify"), t.css("text-justify", "distribute-all-lines"))
            : ((t[0].style.textAlignLast = ""), (t[0].style.textJustify = "")),
          "text-align:" + e
        );
      ((t[0].style.textAlign = ""), (t[0].style.textAlignLast = ""), (t[0].style.textJustify = ""));
    }
    return null;
  }),
    (et.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">左右对齐</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="">居左</option><option value="center">居中</option><option value="right">居右</option><option value="justify">两端对齐</option></select></div></div>',
        )),
        this.target
      );
    }),
    (et.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (et.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (et.prototype.destroy = function () {
      this.target.remove();
    }));
  function Wt() {
    this.name = "hideTitle";
  }
  ((Wt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">标题显示隐藏</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="false">显示</option><option value="true">隐藏</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Wt.prototype.getValue = function () {
      if (this.target.find("select").val() === "true") return !0;
    }),
    (Wt.prototype.setValue = function (t) {
      this.target.find("select").val((t ?? "").toString());
    }),
    (Wt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Gt() {
    this.name = "textType";
  }
  ((Gt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">打印类型</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="">文本</option><option value="barcode">条形码</option><option value="qrcode">二维码</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Gt.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (Gt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Gt.prototype.destroy = function () {
      this.target.remove();
    }));
  var gi = [new J(), new Q(), new _(), new Z(), new tt(), new et(), new Wt(), new Gt()],
    mi = function () {};
  function b(t) {
    ((t = t || {}),
      (this.left = t.left),
      (this.top = t.top),
      (this.topInDesign = this.top),
      (this.height = t.height),
      (this.width = t.width),
      this.init(t));
  }
  ((b.prototype.setDefault = function (t) {
    ((this.defaultOptions = t), this.initSize());
  }),
    (b.prototype.initSize = function () {
      (this.width || this.setWidth(this.defaultOptions.width),
        this.height || this.setHeight(this.defaultOptions.height));
    }),
    (b.prototype.initSizeByHtml = function (t, e) {
      (this.width || this.setWidth(t), this.height || this.setHeight(e));
    }),
    (b.prototype.getLeft = function () {
      return this.left;
    }),
    (b.prototype.displayLeft = function () {
      return this.left + "pt";
    }),
    (b.prototype.setLeft = function (t) {
      t != null && (this.left = t);
    }),
    (b.prototype.getTop = function () {
      return this.top;
    }),
    (b.prototype.getTopInDesign = function () {
      return this.topInDesign;
    }),
    (b.prototype.displayTop = function () {
      return this.top + "pt";
    }),
    (b.prototype.setTop = function (t) {
      t != null && (this.top = t);
    }),
    (b.prototype.copyDesignTopFromTop = function () {
      this.topInDesign = this.top;
    }),
    (b.prototype.getHeight = function () {
      return this.height;
    }),
    (b.prototype.displayHeight = function () {
      return this.height + "pt";
    }),
    (b.prototype.setHeight = function (t) {
      t != null && (this.height = t);
    }),
    (b.prototype.getWidth = function () {
      return this.width;
    }),
    (b.prototype.displayWidth = function () {
      return this.width + "pt";
    }),
    (b.prototype.setWidth = function (t) {
      t != null && (this.width = t);
    }),
    (b.prototype.getValueFromOptionsOrDefault = function (t) {
      return this[t] == null ? this.defaultOptions[t] : this[t];
    }),
    (b.prototype.getPrintElementOptionEntity = function () {
      var t = new mi(),
        e = this;
      return (
        Object.keys(this)
          .filter(function (i) {
            return i !== "topInDesign";
          })
          .forEach(function (i) {
            if (
              ((typeof e[i] == "number" || typeof e[i] == "string" || typeof e[i] == "boolean") &&
                (t[i] = e[i]),
              i === "style")
            ) {
              t.style = {};
              var n = e[i];
              n &&
                Object.keys(n).forEach(function (o) {
                  (typeof n[o] == "number" || typeof n[o] == "string") && (t.style[o] = n[o]);
                });
            }
          }),
        t
      );
    }),
    (b.prototype.init = function (t) {
      var e = this;
      t &&
        Object.keys(t).forEach(function (i) {
          e[i] = t[i];
        });
    }));
  var ze = {
    id: 1,
    createId: function () {
      return ((this.id += 1), this.id);
    },
  };
  function jt() {}
  ((jt.prototype.init = function (t, e) {
    var i = this;
    ((this.tableOptions = e),
      (this.title = t.title),
      (this.field = t.field),
      t
        .getTarget()
        .unbind("dblclick.hitable")
        .bind("dblclick.hitable", function () {
          ((t.isEditing = !0), i.beginEdit(t));
        }));
  }),
    (jt.prototype.getDisplayHtml = function () {
      return this.title;
    }),
    (jt.prototype.beginEdit = function (t) {
      var e = this;
      ((this.editor = X.Instance.createEditor("text")),
        t.getTarget().html(""),
        this.editor.init(t),
        (this.title || this.field) &&
          this.editor.setValue(
            this.tableOptions.options.isEnableEditField
              ? (this.title || "") + "#" + (this.field || "")
              : this.title || "",
          ),
        $(this.editor.target).keydown(function (i) {
          i.keyCode === 13 && e.endEdit(t);
        }),
        $(this.editor.target).blur(function () {
          e.endEdit(t);
        }),
        this.tableOptions.editingCell &&
          this.tableOptions.editingCell.id !== t.id &&
          this.tableOptions.editingCell.innerElement.endEdit(this.tableOptions.editingCell),
        (this.tableOptions.editingCell = t));
    }),
    (jt.prototype.endEdit = function (t) {
      var e = this.editor.getValue();
      if (e)
        if (this.tableOptions.options.isEnableEditField) {
          var i = e.split("#");
          ((t.title = this.title = i[0]), i.length > 1 && (t.field = this.field = i[1]));
        } else t.title = this.title = e;
      else
        this.tableOptions.options.isEnableEditField
          ? ((t.title = this.title = ""), (t.field = this.field = ""))
          : (t.title = this.title = "");
      (this.editor.destroy(), t.getTarget().html(this.title));
    }));
  function Xt() {}
  ((Xt.prototype.init = function (t) {
    ((this.target = $('<input type="text" class="hitable-editor-text" value="" />')),
      t.getTarget().append(this.target),
      this.target.focus());
  }),
    (Xt.prototype.getValue = function () {
      return this.target.val();
    }),
    (Xt.prototype.setValue = function (t) {
      this.target.val(t);
    }),
    (Xt.prototype.destroy = function () {
      this.target.remove();
    }));
  var X = function () {
    this.text = new Xt();
  };
  (Object.defineProperty(X, "Instance", {
    get: function () {
      var t = X;
      return t._instance || (t._instance = new X());
    },
    enumerable: !0,
    configurable: !0,
  }),
    (X.prototype.createEditor = function (t) {
      return $.extend({}, X.Instance[t]);
    }));
  function W(t) {
    var e = k.call(this) || this;
    return (
      (t = t || {}),
      (e.width = t.width ? parseFloat(t.width.toString()) : 100),
      (e.title = t.title),
      (e.descTitle = t.descTitle),
      (e.field = t.field),
      (e.fixed = t.fixed),
      (e.rowspan = t.rowspan ? parseInt(t.rowspan) : 1),
      (e.colspan = t.colspan ? parseInt(t.colspan) : 1),
      (e.align = t.align),
      (e.halign = t.halign),
      (e.vAlign = t.vAlign),
      (e.formatter = t.formatter),
      (e.styler = t.styler),
      (e.formatter2 = t.formatter2),
      (e.styler2 = t.styler2),
      (e.checkbox = t.checkbox),
      (e.checked = t.checked != 0),
      (e.columnId = t.columnId || t.field),
      e
    );
  }
  ((W.prototype.css = function () {}), H(W, k));
  var Le = function (t) {
      ((this.x = t.x), (this.y = t.y), (this.height = t.height), (this.width = t.width));
    },
    vi = function (t) {
      this.rect = t;
    },
    Ue = function (t, e) {
      ((this.rowIndex = t), (this.cell = e));
    };
  function A(t, e) {
    ((this.selectedCells = []), (this.rows = t), (this.tableTarget = e));
  }
  ((A.prototype.clear = function () {
    this.tableTarget.find("td").removeClass("selected");
  }),
    (A.prototype.setSingleSelect = function (t) {
      ((this.startCell = t), (this.selectedCells = []));
    }),
    (A.prototype.getSingleSelect = function () {
      if (this.selectedCells.length) {
        if (this.selectedCells.length === 1)
          return this.selectedCells[0].length === 1 ? this.selectedCells[0][0] : void 0;
        if (this.selectedCells.length > 1) return;
      }
      return this.startCell;
    }),
    (A.prototype.singleSelectByXY = function (t, e) {
      var i = this.getCellByXY(t, e);
      i && (this.clear(), i.cell.select(), (this.startCell = i), (this.selectedCells = []));
    }),
    (A.prototype.multipleSelectByXY = function (t, e) {
      this.clear();
      var i = [];
      if (this.startCell) {
        var n = this.getCellByXY(t, e);
        if (n) {
          var o = Ke.mergeRect(this.startCell.cell.getTableRect(), n.cell.getTableRect());
          this.selectByRect(new vi(o), i);
        }
      }
      this.selectedCells = i;
    }),
    (A.prototype.selectByRect = function (t, e) {
      var i = this;
      (this.rows.forEach(function (n, o) {
        var r = [];
        (n.columns.forEach(function (a) {
          a.isInRect(t) && (r.push(new Ue(o, a)), a.select());
        }),
          r.length && e.push(r));
      }),
        t.changed && ((t.changed = !1), e.splice(0, e.length), i.selectByRect(t, e)));
    }),
    (A.prototype.getSelectedCells = function () {
      return this.selectedCells;
    }),
    (A.prototype.getCellByXY = function (t, e) {
      var i;
      return (
        this.rows.forEach(function (n, o) {
          var r = n.columns.filter(function (a) {
            return a.isXYinCell(t, e);
          });
          r.length && (i = new Ue(o, r[0]));
        }),
        i
      );
    }));
  var Ke = {
      mergeRect: function (t, e) {
        var i = Math.min(t.x, e.x),
          n = Math.min(t.y, e.y);
        return new Le({
          x: i,
          y: n,
          height: Math.max(t.y + t.height, e.y + e.height) - n,
          width: Math.max(t.x + t.width, e.x + e.width) - i,
        });
      },
      Rect: function (t, e, i, n) {
        return {
          minX: t < i ? t : i,
          minY: e < n ? e : n,
          maxX: t < i ? i : t,
          maxY: e < n ? n : e,
        };
      },
    },
    z = function (t) {
      ((this.printLine = t.printLine),
        (this.target = t.target),
        (this.referenceElement = t.referenceElement));
    };
  function G(t) {
    ((this.top = t.top),
      (this.left = t.left),
      (this.height = t.height),
      (this.width = t.width),
      (this.bottomInLastPaper = t.bottomInLastPaper),
      (this.beginPrintPaperIndex = t.beginPrintPaperIndex),
      (this.printTopInPaper = t.printTopInPaper),
      (this.endPrintPaperIndex = t.endPrintPaperIndex));
  }
  G.prototype.isPositionLeftOrRight = function (t) {
    return this.top <= t && this.top + this.height > t;
  };
  function R() {
    this.id = ze.createId();
  }
  ((R.prototype.init = function (t, e, i) {
    ((this.isHead = i),
      (this.target = e || $("<tr></tr>")),
      (this.tableOptions = t),
      this.initCells(this.columns));
  }),
    (R.prototype.getTarget = function () {
      return this.target;
    }),
    (R.prototype.initCells = function (t) {
      var e = this;
      t
        ? t.forEach(function (i, n) {
            i.init(e.target.find("td:eq(" + n + ")"), e.tableOptions, e.id, e.isHead);
          })
        : ((this.columns = []),
          this.target.find("td").each(function (i, n) {
            var o = new k();
            (o.init($(n), e.tableOptions, e.id, e.isHead), e.columns.push(o));
          }));
    }),
    (R.prototype.removeCell = function (t) {
      var e = this.columns.indexOf(t);
      (this.columns[e].getTarget().remove(), this.columns.splice(e, 1));
    }),
    (R.prototype.createTableCell = function (t, e) {
      var i = new k();
      return (
        i.init($("<td></td>"), this.tableOptions, this.id, this.isHead),
        t > 1 && (i.getTarget().attr("rowspan", t), (i.rowspan = t)),
        e > 1 && (i.getTarget().attr("colspan", e), (i.colspan = e)),
        i
      );
    }),
    (R.prototype.insertToTargetCellLeft = function (t, e) {
      var i = this.columns.indexOf(t);
      (t.getTarget().before(e.getTarget()), this.columns.splice(i, 0, e));
    }),
    (R.prototype.insertToTargetCellRight = function (t, e) {
      var i = this.columns.indexOf(t);
      (this.columns[i].getTarget().after(e.getTarget()), this.columns.splice(i + 1, 0, e));
    }),
    (R.prototype.insertCellToFirst = function (t) {
      (this.target.prepend(t.getTarget()), this.columns.splice(0, 0, t));
    }),
    (R.prototype.insertCellToLast = function (t) {
      (this.columns.push(t), this.target.append(t.getTarget()));
    }),
    (R.prototype.getPrintElementOptionEntity = function () {
      var t = [];
      return (
        this.columns.forEach(function (e) {
          t.push(e.getEntity());
        }),
        t
      );
    }));
  function it(t) {
    var e = R.call(this) || this;
    return (
      (e.columns = []),
      t && t.constructor === Array
        ? (t || []).forEach(function (i) {
            e.columns.push(new W(i));
          })
        : t &&
          t.columns &&
          (t.columns || []).forEach(function (i) {
            e.columns.push(new W(i));
          }),
      e
    );
  }
  ((it.prototype.getPrintElementOptionEntity = function () {
    var t = [];
    return (
      this.columns.forEach(function (e) {
        t.push(e.getEntity());
      }),
      t
    );
  }),
    H(it, R));
  var yi = function () {
    this.rowColumns = [];
  };
  function Je(t, e) {
    ((this.gridColumns = t), (this.target = e));
  }
  Je.prototype.getByIndex = function (t) {
    return this.target.find(".hi-grid-col:eq(" + t + ")");
  };
  var bi = function (t) {
    ((this.title = t.title),
      (this.field = t.field),
      (this.width = t.width),
      (this.align = t.align),
      (this.halign = t.halign),
      (this.vAlign = t.vAlign),
      (this.colspan = t.colspan),
      (this.rowspan = t.rowspan),
      (this.checked = t.checked),
      (this.columnId = t.columnId),
      (this.formatter2 = t.formatter2),
      (this.styler2 = t.styler2));
  };
  function k() {
    this.id = ze.createId();
  }
  ((k.prototype.init = function (t, e, i, n) {
    ((this.isHead = n), (this.rowId = i), (this.isEditing = !1));
    var o = /^[0-9]*$/;
    ((this.target = t), (this.tableOptions = e));
    var r = this.target.attr("colspan");
    this.colspan = o.test(r) ? parseInt(r) : 1;
    var a = this.target.attr("rowspan");
    ((this.rowspan = o.test(a) ? parseInt(a) : 1),
      this.initEvent(),
      this.isHead && this.initInnerElement());
  }),
    (k.prototype.beginEdit = function () {
      if (
        !this.isEditing &&
        this.tableOptions.isEnableEdit &&
        this.tableOptions.onBeforEdit(this)
      ) {
        var t = this.getValue();
        ((this.editor = X.Instance.createEditor("text")),
          (this.isEditing = !0),
          (this.tableOptions.editingCell = this),
          this.target.html(""),
          this.editor.init(this),
          this.editor.setValue(t));
      }
    }),
    (k.prototype.endEdit = function () {
      this.isEditing = !1;
      var t = this.editor.getValue();
      (this.editor.destroy(), this.target.html(t));
    }),
    (k.prototype.getTarget = function () {
      return this.target;
    }),
    (k.prototype.getValue = function () {
      return this.target.html();
    }),
    (k.prototype.setValue = function () {}),
    (k.prototype.initInnerElement = function () {
      ((this.innerElement = new jt()), this.innerElement.init(this, this.tableOptions));
    }),
    (k.prototype.initEvent = function () {}),
    (k.prototype.isXYinCell = function (t, e) {
      return this.isOverlap(new Le({ x: t, y: e, height: 0, width: 0 }));
    }),
    (k.prototype.getTableRect = function () {
      var t = this.target.offset();
      return new Le({
        x: t.left,
        y: t.top,
        height: this.target[0].offsetHeight,
        width: this.target[0].offsetWidth,
      });
    }),
    (k.prototype.isOverlap = function (t) {
      var e = this.getTableRect();
      return (
        t.x + t.width > e.x && e.x + e.width > t.x && t.y + t.height > e.y && e.y + e.height > t.y
      );
    }),
    (k.prototype.isInRect = function (t) {
      var e = t.rect,
        i = this.getTableRect();
      if (
        e.x + e.width > i.x &&
        i.x + i.width > e.x &&
        e.y + e.height > i.y &&
        i.y + i.height > e.y
      ) {
        var n = Ke.mergeRect(e, i);
        if (JSON.stringify(e) !== JSON.stringify(n)) return ((t.changed = !0), (t.rect = n), !0);
      }
      return !1;
    }),
    (k.prototype.isSelected = function () {
      return this.target.hasClass("selected");
    }),
    (k.prototype.select = function () {
      this.target.addClass("selected");
    }),
    (k.prototype.isHeader = function () {
      return !1;
    }),
    (k.prototype.setAlign = function (t) {
      ((this.align = t),
        t ? this.target.css("text-align", t) : (this.target[0].style.textAlign = ""));
    }),
    (k.prototype.setVAlign = function (t) {
      ((this.vAlign = t),
        t ? this.target.css("vertical-align", t) : (this.target[0].style.verticalAlign = ""));
    }),
    (k.prototype.getEntity = function () {
      return new bi(this);
    }));
  function nt() {
    this.name = "tableBorder";
  }
  ((nt.prototype.css = function (t, e) {
    if (t.find("table").length) {
      if (e === "border") return (t.find("table").css("border", "1px solid"), "border:1px solid");
      e === "noBorder"
        ? t.find("table").css("border", "0px solid")
        : (t.find("table")[0].style.border = "");
    }
    return null;
  }),
    (nt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表格边框</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="border">有边框</option><option value="noBorder">无边框</option></select></div></div>',
        )),
        this.target
      );
    }),
    (nt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (nt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (nt.prototype.destroy = function () {
      this.target.remove();
    }));
  function ot() {
    this.name = "tableHeaderBorder";
  }
  ((ot.prototype.css = function (t, e) {
    if (t.find("thead tr").length) {
      if (e === "border")
        return (t.find("thead tr").css("border", "1px solid"), "border:1pt solid");
      e === "noBorder"
        ? t.find("thead tr").css("border", "0px solid")
        : e === "topBorder"
          ? (t.find("thead tr").css("border", "0px solid"),
            t.find("thead tr").css("border-top", "1px solid"))
          : e === "bottomBorder"
            ? (t.find("thead tr").css("border", "0px solid"),
              t.find("thead tr").css("border-bottom", "1px solid"))
            : e === "topBottomBorder"
              ? (t.find("thead tr").css("border", "0px solid"),
                t.find("thead tr").css("border-top", "1px solid"),
                t.find("thead tr").css("border-bottom", "1px solid"))
              : t.find("thead tr").each(function (i, n) {
                  n.style.border = "";
                });
    }
    return null;
  }),
    (ot.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表头边框</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="border">有边框</option><option value="noBorder">无边框</option><option value="topBorder">上边框</option><option value="bottomBorder">下边框</option><option value="topBottomBorder">上下边框</option></select></div></div>',
        )),
        this.target
      );
    }),
    (ot.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (ot.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (ot.prototype.destroy = function () {
      this.target.remove();
    }));
  function rt() {
    this.name = "tableHeaderCellBorder";
  }
  ((rt.prototype.css = function (t, e) {
    if (t.find("thead tr td").length) {
      if (e === "border")
        return (t.find("thead tr td").css("border", "1px solid"), "border:1px solid");
      e === "noBorder"
        ? t.find("thead tr td").css("border", "0px solid")
        : t.find("thead tr td").each(function (i, n) {
            n.style.border = "";
          });
    }
    return null;
  }),
    (rt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表头单元格边框</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="border">有边框</option><option value="noBorder">无边框</option></select></div></div>',
        )),
        this.target
      );
    }),
    (rt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (rt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (rt.prototype.destroy = function () {
      this.target.remove();
    }));
  function at() {
    this.name = "tableHeaderRowHeight";
  }
  ((at.prototype.css = function (t, e) {
    return (
      t.find("thead tr td").length &&
        (e
          ? t.find("thead tr td").css("height", e + "pt")
          : t.find("thead tr td").each(function (i, n) {
              n.style.height = "";
            })),
      null
    );
  }),
    (at.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表头行高</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option><option value="22.5">22.5pt</option><option value="23.25">23.25pt</option><option value="24">24pt</option><option value="24.75">24.75pt</option><option value="25.5">25.5pt</option><option value="26.25">26.25pt</option><option value="27">27pt</option><option value="27.75">27.75pt</option><option value="28.5">28.5pt</option><option value="29.25">29.25pt</option><option value="30">30pt</option><option value="30.75">30.75pt</option><option value="31.5">31.5pt</option><option value="32.25">32.25pt</option><option value="33">33pt</option><option value="33.75">33.75pt</option><option value="34.5">34.5pt</option><option value="35.25">35.25pt</option><option value="36">36pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (at.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (at.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (at.prototype.destroy = function () {
      this.target.remove();
    }));
  function st() {
    this.name = "tableHeaderFontSize";
  }
  ((st.prototype.css = function (t, e) {
    return (
      t.find("thead").length &&
        (e
          ? t.find("thead").css("font-size", e + "pt")
          : t.find("thead").each(function (i, n) {
              n.style.fontSize = "";
            })),
      null
    );
  }),
    (st.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表头字体大小</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (st.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (st.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (st.prototype.destroy = function () {
      this.target.remove();
    }));
  function pt() {
    this.name = "tableHeaderFontWeight";
  }
  ((pt.prototype.css = function (t, e) {
    return (
      t.find("thead").length &&
        (e
          ? t.find("thead tr td").css("font-weight", e)
          : t.find("thead tr td").each(function (i, n) {
              n.style.fontWeight = "";
            })),
      null
    );
  }),
    (pt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表头字体粗细</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="lighter">更细</option><option value="bold">粗体</option><option value="bolder">粗体+</option><option value="100">100</option><option value="200">200</option><option value="300">300</option><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></div></div>',
        )),
        this.target
      );
    }),
    (pt.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (pt.prototype.setValue = function (t) {
      t &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (pt.prototype.destroy = function () {
      this.target.remove();
    }));
  function lt() {
    this.name = "tableBodyCellBorder";
  }
  ((lt.prototype.css = function (t, e) {
    if (t.find("tbody tr td").length) {
      if (e === "border")
        return (t.find("tbody tr td").css("border", "1px solid"), "border:1px solid");
      e === "noBorder"
        ? t.find("tbody tr td").css("border", "0px solid")
        : t.find("tbody tr td").each(function (i, n) {
            n.style.border = "";
          });
    }
    return null;
  }),
    (lt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表体单元格</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="border">有边框</option><option value="noBorder">无边框</option></select></div></div>',
        )),
        this.target
      );
    }),
    (lt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (lt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (lt.prototype.destroy = function () {
      this.target.remove();
    }));
  function ut() {
    this.name = "tableBodyRowHeight";
  }
  ((ut.prototype.css = function (t, e) {
    return (
      t.find("tbody tr td").length &&
        (e
          ? t.find("tbody tr td").css("height", e + "pt")
          : t.find("tbody tr td").each(function (i, n) {
              n.style.height = "";
            })),
      null
    );
  }),
    (ut.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表体行高</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option><option value="22.5">22.5pt</option><option value="23.25">23.25pt</option><option value="24">24pt</option><option value="24.75">24.75pt</option><option value="25.5">25.5pt</option><option value="26.25">26.25pt</option><option value="27">27pt</option><option value="27.75">27.75pt</option><option value="28.5">28.5pt</option><option value="29.25">29.25pt</option><option value="30">30pt</option><option value="30.75">30.75pt</option><option value="31.5">31.5pt</option><option value="32.25">32.25pt</option><option value="33">33pt</option><option value="33.75">33.75pt</option><option value="34.5">34.5pt</option><option value="35.25">35.25pt</option><option value="36">36pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (ut.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (ut.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (ut.prototype.destroy = function () {
      this.target.remove();
    }));
  function dt() {
    this.name = "tableHeaderBackground";
  }
  ((dt.prototype.css = function (t, e) {
    return (
      t.find("thead").length &&
        (e
          ? t.find("thead").css("background-color", e)
          : t.find("thead").each(function (i, n) {
              n.style.backgroundColor = "";
            })),
      null
    );
  }),
    (dt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表头背景</div><div class="kuprint-option-item-field"><input type="text" class="auto-submit" /></div></div>',
        )),
        this.target
      );
    }),
    (dt.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    (dt.prototype.setValue = function (t) {
      (this.target.find("input").minicolors({ defaultValue: t || "", theme: "bootstrap" }),
        this.target.find("input").val(t));
    }),
    (dt.prototype.destroy = function () {
      this.target.remove();
    }));
  function ht() {
    this.name = "tableBodyRowBorder";
  }
  ((ht.prototype.css = function (t, e) {
    return (
      t.find("tbody tr").length &&
        (e === "border"
          ? t.find("tbody tr").css("border", "1px solid")
          : e === "noBorder"
            ? t.find("tbody tr").css("border", "0px solid")
            : e === "topBorder"
              ? (t.find("tbody tr").css("border", "0px solid"),
                t.find("tbody tr").css("border-top", "1px solid"))
              : e === "bottomBorder"
                ? (t.find("tbody tr").css("border", "0px solid"),
                  t.find("tbody tr").css("border-bottom", "1px solid"))
                : e === "topBottomBorder"
                  ? (t.find("tbody tr").css("border", "0px solid"),
                    t.find("tbody tr").css("border-top", "1px solid"),
                    t.find("tbody tr").css("border-bottom", "1px solid"))
                  : t.find("tbody tr").each(function (i, n) {
                      n.style.border = "";
                    })),
      null
    );
  }),
    (ht.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表体行边框</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="border">有边框</option><option value="noBorder">无边框</option><option value="topBorder">上边框</option><option value="bottomBorder">下边框</option><option value="topBottomBorder">上下边框</option></select></div></div>',
        )),
        this.target
      );
    }),
    (ht.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (ht.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (ht.prototype.destroy = function () {
      this.target.remove();
    }));
  function ft() {
    this.name = "columns";
  }
  ((ft.prototype.createTarget = function () {
    return (
      $('<div class="indicator"></div>').appendTo("body"),
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div><ul class="kuprint-option-table-selected-columns"></ul></div></div>',
      )),
      this.target
    );
  }),
    (ft.prototype.getValue = function () {
      return this.buildData();
    }),
    (ft.prototype.setValue = function (t, e, i) {
      var n = this;
      ((this.value = t), (this.options = e), (this.printElementType = i));
      var o = i.columns[0]
        .filter(function (r) {
          return (
            t[0].columns.filter(function (a) {
              return r.columnId === a.columnId;
            }).length === 0
          );
        })
        .map(function (r) {
          var a = new k(r);
          return ((a.checked = !1), a);
        });
      ((this.allColumns = t[0].columns.concat(o)),
        t &&
          t.length === 1 &&
          (this.target.find("ul").html(
            this.allColumns
              .map(function (r) {
                return (
                  '<li class="kuprint-option-table-selected-item"><div class="hi-pretty p-default">' +
                  (r.checked
                    ? '<input type="checkbox" checked column-id="' + (r.columnId || "") + '" />'
                    : '<input type="checkbox" column-id="' + (r.columnId || "") + '" />') +
                  '<div class="state"><label></label></div></div><span class="column-title">' +
                  (r.title || r.descTitle || "") +
                  "</span></li>"
                );
              })
              .join(""),
          ),
          this.target.find("input").change(function () {
            n.submit();
          }),
          this.printElementType.columnDisplayIndexEditable &&
            this.target
              .find("li")
              .hidraggable({
                revert: !0,
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
                onDrop: function (r, a) {
                  ($(a).insertAfter(this), $(this).css("border-bottom-color", ""), n.submit());
                },
              })));
    }),
    (ft.prototype.buildData = function () {
      var t = this,
        e = [];
      return (
        this.allColumns.forEach(function (i) {
          i.checked = !1;
        }),
        (this.printElementType.columnDisplayEditable
          ? this.target.find("input:checked")
          : this.target.find("input")
        ).each(function (i, n) {
          var o = $(n).attr("column-id"),
            r = t.options.makeColumnObj();
          if (r[o]) ((r[o].checked = !0), e.push(r[o]));
          else {
            var a = t.printElementType.getColumnByColumnId(o);
            if (a) {
              var p = new k(a);
              ((p.checked = !0), e.push(p));
            }
          }
        }),
        (this.value[0].columns = e),
        this.value
      );
    }),
    (ft.prototype.destroy = function () {
      this.target.remove();
    }));
  function Yt() {
    this.name = "gridColumns";
  }
  ((Yt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">一行多组</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="2">一行二列</option><option value="3">一行三列</option><option value="4">一行四列</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Yt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Yt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Yt.prototype.destroy = function () {
      this.target.remove();
    }));
  function ct() {
    this.name = "gridColumnsGutter";
  }
  ((ct.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">一行多组间隔</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.25">7.25pt</option><option value="8.5">8.5pt</option><option value="9">9pt</option></select></div></div>',
      )),
      this.target
    );
  }),
    (ct.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (ct.prototype.css = function (t, e) {
      if (t && t.length) {
        if (e)
          return (
            t
              .find(".table-grid-row")
              .css("margin-left", "-" + e + "pt")
              .css("margin-right", "-" + e + "pt"),
            t
              .find(".tableGridColumnsGutterRow")
              .css("padding-left", e + "pt")
              .css("padding-right", e + "pt"),
            null
          );
        (t.find(".table-grid-row").each(function (i, n) {
          ((n.style.marginLeft = ""), (n.style.marginRight = ""));
        }),
          t.find(".tableGridColumnsGutterRow").each(function (i, n) {
            ((n.style.paddingLeft = ""), (n.style.paddingRight = ""));
          }));
      }
      return null;
    }),
    (ct.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (ct.prototype.destroy = function () {
      this.target.remove();
    }));
  function qt() {
    this.name = "tableFooterRepeat";
  }
  ((qt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表格脚显示</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="no">不显示</option><option value="page">每页显示</option><option value="last">最后显示</option></select></div></div>',
      )),
      this.target
    );
  }),
    (qt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (qt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (qt.prototype.destroy = function () {
      this.target.remove();
    }));
  var Ti = [
    new nt(),
    new ot(),
    new rt(),
    new at(),
    new st(),
    new pt(),
    new lt(),
    new ut(),
    new dt(),
    new ht(),
    new ft(),
    new Yt(),
    new ct(),
    new qt(),
  ];
  function gt() {
    this.name = "borderWidth";
  }
  ((gt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">边框大小</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option></select></div></div>',
      )),
      this.target
    );
  }),
    (gt.prototype.css = function (t, e) {
      if (t && t.length) {
        if (e) return (t.css("border-width", e + "pt"), "border-width:" + e + "pt");
        t[0].style.borderWidth = "";
      }
      return null;
    }),
    (gt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (gt.prototype.setValue = function (t) {
      t &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (gt.prototype.destroy = function () {
      this.target.remove();
    }));
  function mt() {
    this.name = "borderColor";
  }
  ((mt.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("border-color", e), "border-color:" + e);
      t[0].style.borderColor = "";
    }
    return null;
  }),
    (mt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">边框颜色</div><div class="kuprint-option-item-field"><input type="text" class="auto-submit" /></div></div>',
        )),
        this.target
      );
    }),
    (mt.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    (mt.prototype.setValue = function (t) {
      (this.target.find("input").minicolors({ defaultValue: t || "", theme: "bootstrap" }),
        this.target.find("input").val(t));
    }),
    (mt.prototype.destroy = function () {
      this.target.remove();
    }));
  function vt() {
    this.name = "borderTop";
  }
  ((vt.prototype.css = function (t, e) {
    return (
      t &&
        t.length &&
        (e
          ? (t.css("border-top-style", e), t.css("border-top-width", "1px"))
          : ((t[0].style.borderTopStyle = ""), (t[0].style.borderTopWidth = ""))),
      null
    );
  }),
    (vt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">上边框</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">否</option><option value="solid">实线</option><option value="dotted">虚线</option></select></div></div>',
        )),
        this.target
      );
    }),
    (vt.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (vt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (vt.prototype.destroy = function () {
      this.target.remove();
    }));
  function yt() {
    this.name = "borderLeft";
  }
  ((yt.prototype.css = function (t, e) {
    return (
      t &&
        t.length &&
        (e
          ? (t.css("border-left-style", e), t.css("border-left-width", "1px"))
          : ((t[0].style.borderLeftStyle = ""), (t[0].style.borderLeftWidth = ""))),
      null
    );
  }),
    (yt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">左边框</div><div class="kuprint-option-item-field"><select><option value="">否</option><option value="solid">实线</option><option value="dotted">虚线</option></select></div></div>',
        )),
        this.target
      );
    }),
    (yt.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (yt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (yt.prototype.destroy = function () {
      this.target.remove();
    }));
  function bt() {
    this.name = "borderRight";
  }
  ((bt.prototype.css = function (t, e) {
    return (
      t &&
        t.length &&
        (e
          ? (t.css("border-right-style", e), t.css("border-right-width", "1px"))
          : ((t[0].style.borderRightStyle = ""), (t[0].style.borderRightWidth = ""))),
      null
    );
  }),
    (bt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">右边框</div><div class="kuprint-option-item-field"><select><option value="">否</option><option value="solid">实线</option><option value="dotted">虚线</option></select></div></div>',
        )),
        this.target
      );
    }),
    (bt.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (bt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (bt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Tt() {
    this.name = "borderBottom";
  }
  ((Tt.prototype.css = function (t, e) {
    return (
      t &&
        t.length &&
        (e
          ? (t.css("border-bottom-style", e), t.css("border-bottom-width", "1px"))
          : ((t[0].style.borderBottomStyle = ""), (t[0].style.borderBottomWidth = ""))),
      null
    );
  }),
    (Tt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">下边框</div><div class="kuprint-option-item-field"><select><option value="">否</option><option value="solid">实线</option><option value="dotted">虚线</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Tt.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (Tt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Tt.prototype.destroy = function () {
      this.target.remove();
    }));
  function wt() {
    this.name = "contentPaddingTop";
  }
  ((wt.prototype.css = function (t, e) {
    var i = t.find(".kuprint-printElement-content");
    return (
      i && i.length && (e ? i.css("padding-top", e + "pt") : (i[0].style.paddingTop = "")), null
    );
  }),
    (wt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">上内边距</div><div class="kuprint-option-item-field"><select><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (wt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (wt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (wt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Et() {
    this.name = "contentPaddingLeft";
  }
  ((Et.prototype.css = function (t, e) {
    var i = t.find(".kuprint-printElement-content");
    return (
      i && i.length && (e ? i.css("padding-left", e + "pt") : (i[0].style.paddingLeft = "")), null
    );
  }),
    (Et.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">左内边距</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Et.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Et.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Et.prototype.destroy = function () {
      this.target.remove();
    }));
  function Pt() {
    this.name = "contentPaddingRight";
  }
  ((Pt.prototype.css = function (t, e) {
    var i = t.find(".kuprint-printElement-content");
    return (
      i && i.length && (e ? i.css("padding-right", e + "pt") : (i[0].style.paddingRight = "")), null
    );
  }),
    (Pt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">右内边距</div><div class="kuprint-option-item-field"><select><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Pt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Pt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Pt.prototype.destroy = function () {
      this.target.remove();
    }));
  function xt() {
    this.name = "contentPaddingBottom";
  }
  ((xt.prototype.css = function (t, e) {
    var i = t.find(".kuprint-printElement-content");
    return (
      i && i.length && (e ? i.css("padding-bottom", e + "pt") : (i[0].style.paddingBottom = "")),
      null
    );
  }),
    (xt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">下内边距</div><div class="kuprint-option-item-field"><select><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (xt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (xt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (xt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Ct() {
    this.name = "borderStyle";
  }
  ((Ct.prototype.css = function (t, e) {
    return (t && t.length && (e ? t.css("border-style", e) : (t[0].style.borderStyle = "")), null);
  }),
    (Ct.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">边框样式</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="solid">实线</option><option value="dotted">虚线</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Ct.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (Ct.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Ct.prototype.destroy = function () {
      this.target.remove();
    }));
  function kt() {
    this.name = "paddingLeft";
  }
  ((kt.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("padding-left", e + "pt"), "padding-left");
      t[0].style.paddingLeft = "";
    }
    return null;
  }),
    (kt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">左内边距</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (kt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (kt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (kt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Ht() {
    this.name = "paddingRight";
  }
  ((Ht.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("padding-right", e + "pt"), "padding-right");
      t[0].style.paddingRight = "";
    }
    return null;
  }),
    (Ht.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">右内边距</div><div class="kuprint-option-item-field"><select><option value="">默认</option><option value="0.75">0.75pt</option><option value="1.5">1.5pt</option><option value="2.25">2.25pt</option><option value="3">3pt</option><option value="3.75">3.75pt</option><option value="4.5">4.5pt</option><option value="5.25">5.25pt</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13.5pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Ht.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Ht.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Ht.prototype.destroy = function () {
      this.target.remove();
    }));
  var wi = [
    new gt(),
    new mt(),
    new Ct(),
    new vt(),
    new yt(),
    new bt(),
    new Tt(),
    new wt(),
    new Et(),
    new Pt(),
    new xt(),
    new kt(),
    new Ht(),
  ];
  function Ut() {
    this.name = "barcodeMode";
  }
  ((Ut.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">条形码格式</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="CODE128A">CODE128A</option><option value="CODE128B">CODE128B</option><option value="CODE128C">CODE128C</option><option value="CODE39">CODE39</option><option value="EAN-13">EAN-13</option><option value="EAN-8">EAN-8</option><option value="EAN-5">EAN-5</option><option value="EAN-2">EAN-2</option><option value="UPC（A）">UPC（A）</option><option value="ITF">ITF</option><option value="ITF-14">ITF-14</option><option value="MSI">MSI</option><option value="MSI10">MSI10</option><option value="MSI11">MSI11</option><option value="MSI1010">MSI1010</option><option value="MSI1110">MSI1110</option><option value="Pharmacode">Pharmacode</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Ut.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (Ut.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Ut.prototype.destroy = function () {
      this.target.remove();
    }));
  function Ot() {
    this.name = "color";
  }
  ((Ot.prototype.css = function (t, e) {
    if (t && t.length) {
      if (e) return (t.css("color", e), "color:" + e);
      t[0].style.color = "";
    }
    return null;
  }),
    (Ot.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">字体颜色</div><div class="kuprint-option-item-field"><input type="text" class="auto-submit"/></div></div>',
        )),
        this.target
      );
    }),
    (Ot.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    (Ot.prototype.setValue = function (t) {
      (this.target.find("input").minicolors({ defaultValue: t || "", theme: "bootstrap" }),
        this.target.find("input").val(t));
    }),
    (Ot.prototype.destroy = function () {
      this.target.remove();
    }));
  function It() {
    this.name = "textDecoration";
  }
  ((It.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">文本修饰</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="underline">下划线</option><option value="overline">上划线</option><option value="line-through">穿梭线</option></select></div></div>',
      )),
      this.target
    );
  }),
    (It.prototype.css = function (t, e) {
      if (t && t.length) {
        if (e) return (t.css("text-decoration", e), "text-decoration:" + e);
        t[0].style.textDecoration = "";
      }
      return null;
    }),
    (It.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (It.prototype.setValue = function (t) {
      t &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (It.prototype.destroy = function () {
      this.target.remove();
    }));
  function Kt() {
    this.name = "field";
  }
  ((Kt.prototype.createTarget = function (t) {
    var e = t ? t.getFields() : void 0;
    if (e) {
      this.isSelect = !0;
      var i =
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">字段名</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">请选择字段</option>';
      (e.forEach(function (n, o) {
        i += '<option value="' + n + '">' + n + "</option>";
      }),
        (i += "</select></div></div>"),
        (this.target = $(i)));
    } else
      ((this.isSelect = !1),
        (this.target = $(
          '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">字段名</div><div class="kuprint-option-item-field"><input type="text" placeholder="请输入字段名" class="auto-submit"></div></div>',
        )));
    return this.target;
  }),
    (Kt.prototype.getValue = function () {
      return (
        (this.isSelect ? this.target.find("select").val() : this.target.find("input").val()) ||
        void 0
      );
    }),
    (Kt.prototype.setValue = function (t) {
      this.isSelect
        ? t &&
          (this.target.find('option[value="' + t + '"]').length ||
            this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
          this.target.find("select").val(t))
        : this.target.find("input").val(t);
    }),
    (Kt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Jt() {
    this.name = "title";
  }
  ((Jt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">标题</div><div class="kuprint-option-item-field"><textarea style="height:50px;" placeholder="请输入标题" class="auto-submit"></textarea></div></div>',
      )),
      this.target
    );
  }),
    (Jt.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (Jt.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (Jt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Qt() {
    this.name = "testData";
  }
  ((Qt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">测试数据</div><div class="kuprint-option-item-field"><input type="text" placeholder="仅字段名称存在时有效" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (Qt.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    (Qt.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (Qt.prototype.destroy = function () {
      this.target.remove();
    }));
  function $t() {
    this.name = "src";
  }
  (($t.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">图片地址</div><div class="kuprint-option-item-field"><input type="text" placeholder="请输入图片地址" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    ($t.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    ($t.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    ($t.prototype.destroy = function () {
      this.target.remove();
    }));
  function St() {
    this.name = "transform";
  }
  ((St.prototype.css = function (t, e) {
    if (t && t.length) {
      var i = t.find(".kuprint-printElement-content");
      e
        ? i.length &&
          (i.css("transform", "rotate(" + e + "deg)"),
          i.css("-webkit-transform", "rotate(" + e + "deg)"))
        : i.length && (i[0].style.transform = "");
    }
    return null;
  }),
    (St.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">旋转角度</div><div class="kuprint-option-item-field"><input type="text" class="auto-submit"/></div></div>',
        )),
        this.target
      );
    }),
    (St.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (St.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (St.prototype.destroy = function () {
      this.target.remove();
    }));
  function _t() {
    this.name = "optionsGroup";
  }
  ((_t.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">边框设置</div></div>',
      )),
      this.target
    );
  }),
    (_t.prototype.getValue = function () {}),
    (_t.prototype.setValue = function () {}),
    (_t.prototype.destroy = function () {
      this.target.remove();
    }));
  function Ft() {
    this.name = "backgroundColor";
  }
  ((Ft.prototype.css = function (t, e) {
    return (
      t && t.length && (e ? t.css("background-color", e) : (t[0].style.backgroundColor = "")), null
    );
  }),
    (Ft.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">背景颜色</div><div class="kuprint-option-item-field"><input type="text" class="auto-submit"/></div></div>',
        )),
        this.target
      );
    }),
    (Ft.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    (Ft.prototype.setValue = function (t) {
      (this.target.find("input").minicolors({ defaultValue: t || "", theme: "bootstrap" }),
        this.target.find("input").val(t));
    }),
    (Ft.prototype.destroy = function () {
      this.target.remove();
    }));
  function Zt() {
    this.name = "orient";
  }
  ((Zt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">纸张方向(仅自定义纸质有效)</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="1">纵向</option><option value="2">横向</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Zt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Zt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Zt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Rt() {
    this.name = "textContentVerticalAlign";
  }
  ((Rt.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">上下对齐</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="middle">垂直居中</option><option value="bottom">底部</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Rt.prototype.css = function (t, e) {
      if (t && t.length) {
        if (e)
          return (
            e === "middle" && t.addClass("kuprint-text-content-middle"),
            e === "bottom" && t.addClass("kuprint-text-content-bottom"),
            ""
          );
        (t.removeClass("kuprint-text-content-middle"),
          t.removeClass("kuprint-text-content-bottom"));
      }
      return null;
    }),
    (Rt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (Rt.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Rt.prototype.destroy = function () {
      this.target.remove();
    }));
  function Dt() {
    this.name = "dataType";
  }
  ((Dt.prototype.createTarget = function () {
    var t = this;
    return (
      (this.target = $(
        '<div class="kuprint-option-item-row"><div class="kuprint-option-item"><div class="kuprint-option-item-label">数据类型</div><div class="kuprint-option-item-field"><select class="kuprint-option-item-datatype"><option value="">默认</option><option value="datetime">日期时间</option><option value="boolean">布尔</option></select></div></div><div class="kuprint-option-item"><div class="kuprint-option-item-label">格式</div><div class="kuprint-option-item-field"><select class="auto-submit kuprint-option-item-datatype-select-format"><option value="">默认</option></select><input class="auto-submit kuprint-option-item-datatype-input-format" type="text" data-type="boolean" placeholder="true:false"></div></div></div>',
      )),
      $(this.target.find(".kuprint-option-item-datatype")).change(function () {
        var e = $(t.target.find(".kuprint-option-item-datatype")).val();
        (t.loadFormatSelectByDataType(e), t.submit(t.getValue()));
      }),
      this.target
    );
  }),
    (Dt.prototype.getValue = function () {
      var t = this.target.find(".kuprint-option-item-datatype").val();
      return t
        ? {
            dataType: t,
            format: this.target.find(".kuprint-option-item-datatype-format").val() || void 0,
          }
        : { dataType: void 0, format: void 0 };
    }),
    (Dt.prototype.setValue = function (t, e) {
      (this.target.find(".kuprint-option-item-datatype").val(e.dataType || ""),
        this.loadFormatSelectByDataType(e.dataType),
        this.target.find(".kuprint-option-item-datatype-format").val(e.format || ""));
    }),
    (Dt.prototype.destroy = function () {
      this.target.remove();
    }),
    (Dt.prototype.loadFormatSelectByDataType = function (t) {
      t === "boolean"
        ? (this.target
            .find(".kuprint-option-item-datatype-select-format")
            .removeClass("kuprint-option-item-datatype-format")
            .hide()
            .val(""),
          this.target
            .find(".kuprint-option-item-datatype-input-format")
            .addClass("kuprint-option-item-datatype-format")
            .show())
        : t === "datetime"
          ? (this.target
              .find(".kuprint-option-item-datatype-select-format")
              .addClass("kuprint-option-item-datatype-format")
              .show(),
            this.target
              .find(".kuprint-option-item-datatype-input-format")
              .removeClass("kuprint-option-item-datatype-format")
              .hide()
              .val(""),
            this.target
              .find(".kuprint-option-item-datatype-select-format")
              .html('<option value="">默认</option>' + Ei))
          : (this.target.find(".kuprint-option-item-datatype-select-format").show(),
            this.target.find(".kuprint-option-item-datatype-input-format").hide().val(""),
            this.target
              .find(".kuprint-option-item-datatype-format")
              .html('<option value="">默认</option>'));
    }));
  var Ei =
    '<option value="M/d">M/d</option><option value="MM/dd">MM/dd</option><option value="yy/M/d">yy/M/d</option><option value="yy/MM/dd">yy/MM/dd</option><option value="yyyy/M/d">yyyy/M/d</option><option value="yyyy/MM/dd">yyyy/MM/dd</option><option value="yy/M/d H:m">yy/M/d H:m</option><option value="yy/M/d H:m:s">yy/M/d H:m:s</option><option value="yy/M/d HH:mm">yy/M/d HH:mm</option><option value="yy/M/d HH:mm:ss">yy/M/d HH:mm:ss</option><option value="yy/MM/dd H:m">yy/MM/dd H:m</option><option value="yy/MM/dd H:m:s">yy/MM/dd H:m:s</option><option value="yy/MM/dd HH:mm">yy/MM/dd HH:mm</option><option value="yy/MM/dd HH:mm:ss">yy/MM/dd HH:mm:ss</option><option value="yyyy/M/d H:m">yyyy/M/dd H:m</option><option value="yyyy/M/d H:m:s">yyyy/M/d H:m:s</option><option value="yyyy/M/d HH:mm">yyyy/M/d HH:mm</option><option value="yyyy/M/d HH:mm:ss">yyyy/M/d HH:mm:ss</option><option value="yyyy/MM/dd H:m">yyyy/MM/dd H:m</option><option value="yyyy/MM/dd H:m:s">yyyy/MM/dd H:m:s</option><option value="yyyy/MM/dd HH:mm">yyyy/MM/dd HH:mm</option><option value="yyyy/MM/dd HH:mm:ss">yyyy/MM/dd HH:mm:ss</option><option value="M-d">M-d</option><option value="MM-dd">MM-dd</option><option value="yy-M-d">yy-M-d</option><option value="yy-MM-dd">yy-MM-dd</option><option value="yyyy-M-d">yyyy-M-d</option><option value="yyyy-MM-dd">yyyy-MM-dd</option><option value="yy-M-d H:m">yy-M-d H:m</option><option value="yy-M-d H:m:s">yy-M-d H:m:s</option><option value="yy-M-d HH:mm">yy-M-d HH:mm</option><option value="yy-M-d HH:mm:ss">yy-M-d HH:mm:ss</option><option value="yy-MM-dd H:m">yy-MM-dd H:m</option><option value="yy-MM-dd H:m:s">yy-MM-dd H:m:s</option><option value="yy-MM-dd HH:mm">yy-MM-dd HH:mm</option><option value="yy-MM-dd HH:mm:ss">yy-MM-dd HH:mm:ss</option><option value="yyyy-M-d H:m">yyyy-M-d H:m</option><option value="yyyy-M-d H:m:s">yyyy-M-d H:m:s</option><option value="yyyy-M-d HH:mm">yyyy-M-d HH:mm</option><option value="yyyy-M-d HH:mm:ss">yyyy-M-d HH:mm:ss</option><option value="yyyy-MM-dd H:m">yyyy-MM-dd H:m</option><option value="yyyy-MM-dd H:m:s">yyyy-MM-dd H:m:s</option><option value="yyyy-MM-dd HH:mm">yyyy-MM-dd HH:mm</option><option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</option>';
  function te() {
    this.name = "formatter";
  }
  ((te.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">格式化函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="' +
          (this.placeholder || "") +
          '" class="auto-submit"></textarea></div></div>',
      )),
      this.target
    );
  }),
    (te.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (te.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (te.prototype.destroy = function () {
      this.target.remove();
    }));
  function ee() {
    this.name = "styler";
  }
  ((ee.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">样式函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="function(value, options, target,templateData){}" class="auto-submit"></textarea></div></div>',
      )),
      this.target
    );
  }),
    (ee.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (ee.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (ee.prototype.destroy = function () {
      this.target.remove();
    }));
  function ie() {
    this.name = "footerFormatter";
  }
  ((ie.prototype.createTarget = function () {
    return (
      (this.target = $(
        `<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">表格脚函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="function(options,rows,data){ return '<tr></tr>' };" class="auto-submit"></textarea></div></div>`,
      )),
      this.target
    );
  }),
    (ie.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (ie.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (ie.prototype.destroy = function () {
      this.target.remove();
    }));
  function ne() {
    this.name = "gridColumnsFooterFormatter";
  }
  ((ne.prototype.createTarget = function () {
    return (
      (this.target = $(
        `<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">多组表格脚函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="function(options,rows,data){ return '' };" class="auto-submit"></textarea></div></div>`,
      )),
      this.target
    );
  }),
    (ne.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (ne.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (ne.prototype.destroy = function () {
      this.target.remove();
    }));
  function oe() {
    this.name = "rowStyler";
  }
  ((oe.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">行样式函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="请输入标题" class="auto-submit"></textarea></div></div>',
      )),
      this.target
    );
  }),
    (oe.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (oe.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (oe.prototype.destroy = function () {
      this.target.remove();
    }));
  function re() {
    this.name = "align";
  }
  ((re.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">单元格左右对齐</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="left">居左</option><option value="center">居中</option><option value="right">居右</option><option value="justify">两端对齐</option></select></div></div>',
      )),
      this.target
    );
  }),
    (re.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (re.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (re.prototype.destroy = function () {
      this.target.remove();
    }));
  function ae() {
    this.name = "vAlign";
  }
  ((ae.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">单元格上下对齐</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="top">上</option><option value="middle">中</option><option value="bottom">居右</option></select></div></div>',
      )),
      this.target
    );
  }),
    (ae.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (ae.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (ae.prototype.destroy = function () {
      this.target.remove();
    }));
  function se() {
    this.name = "halign";
  }
  ((se.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">表格头单元格左右对齐</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="left">居左</option><option value="center">居中</option><option value="right">居右</option><option value="justify">两端对齐</option></select></div></div>',
      )),
      this.target
    );
  }),
    (se.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (se.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (se.prototype.destroy = function () {
      this.target.remove();
    }));
  function pe() {
    this.name = "styler2";
  }
  ((pe.prototype.createTarget = function () {
    return (
      (this.target = $(
        `<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">单元格样式函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="function(value,row,index,options){ return {color:'red'} };" class="auto-submit"></textarea></div></div>`,
      )),
      this.target
    );
  }),
    (pe.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (pe.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (pe.prototype.destroy = function () {
      this.target.remove();
    }));
  function le() {
    this.name = "formatter2";
  }
  ((le.prototype.createTarget = function () {
    return (
      (this.target = $(
        `<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">单元格格式化函数</div><div class="kuprint-option-item-field"><textarea style="height:80px;" placeholder="function(value,row,index,options){ return '' };" class="auto-submit"></textarea></div></div>`,
      )),
      this.target
    );
  }),
    (le.prototype.getValue = function () {
      return this.target.find("textarea").val() || void 0;
    }),
    (le.prototype.setValue = function (t) {
      this.target.find("textarea").val(t);
    }),
    (le.prototype.destroy = function () {
      this.target.remove();
    }));
  function ue() {
    this.name = "autoCompletion";
  }
  ((ue.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">自动补全</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="true">是</option><option value="false">否</option></select></div></div>',
      )),
      this.target
    );
  }),
    (ue.prototype.getValue = function () {
      if (this.target.find("select").val() === "true") return !0;
    }),
    (ue.prototype.setValue = function (t) {
      this.target.find("select").val((t ?? "").toString());
    }),
    (ue.prototype.destroy = function () {
      this.target.remove();
    }));
  var Pi = [
    new Ut(),
    new Ot(),
    new It(),
    new Kt(),
    new Jt(),
    new Qt(),
    new $t(),
    new Dt(),
    new te(),
    new ee(),
    new ie(),
    new ne(),
    new oe(),
    new re(),
    new ae(),
    new se(),
    new pe(),
    new le(),
    new ue(),
    new Ft(),
    new Zt(),
    new Rt(),
    new St(),
    new _t(),
  ];
  function de() {
    this.name = "paperNumberFormat";
  }
  ((de.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">页码格式</div><div class="kuprint-option-item-field"><input type="text" placeholder="paperNo-paperCount" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (de.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? t.toString() : void 0;
    }),
    (de.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (de.prototype.destroy = function () {
      this.target.remove();
    }));
  function he() {
    this.name = "paperNumberDisabled";
  }
  ((he.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">启用/禁用</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="false">启用</option><option value="true">禁用</option></select></div></div>',
      )),
      this.target
    );
  }),
    (he.prototype.getValue = function () {
      if (this.target.find("select").val() === "true") return !0;
    }),
    (he.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (he.prototype.destroy = function () {
      this.target.remove();
    }));
  function Bt() {
    this.name = "longTextIndent";
  }
  ((Bt.prototype.css = function (t, e) {
    return null;
  }),
    (Bt.prototype.createTarget = function () {
      return (
        (this.target = $(
          '<div class="kuprint-option-item"><div class="kuprint-option-item-label">每行缩进</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="6">6pt</option><option value="6.75">6.75pt</option><option value="7.5">7.5pt</option><option value="8.25">8.25pt</option><option value="9">9pt</option><option value="9.75">9.75pt</option><option value="10.5">10.5pt</option><option value="11.25">11.25pt</option><option value="12">12pt</option><option value="12.75">12.75pt</option><option value="13.5">13pt</option><option value="14.25">14.25pt</option><option value="15">15pt</option><option value="15.75">15.75pt</option><option value="16.5">16.5pt</option><option value="17.25">17.25pt</option><option value="18">18pt</option><option value="18.75">18.75pt</option><option value="19.5">19.5pt</option><option value="20.25">20.25pt</option><option value="21">21pt</option><option value="21.75">21.75pt</option><option value="22.5">22.5pt</option><option value="23.25">23.25pt</option><option value="24">24pt</option><option value="24.75">24.75pt</option><option value="25.5">25.5pt</option><option value="26.25">26.25pt</option><option value="27">27pt</option><option value="27.75">27.75pt</option><option value="28.5">28.5pt</option><option value="29.25">29.25pt</option><option value="30">30pt</option><option value="30.75">30.75pt</option><option value="31.5">31.5pt</option><option value="32.25">32.25pt</option><option value="33">33pt</option><option value="33.75">33.75pt</option><option value="34.5">34.5pt</option><option value="35.25">35.25pt</option><option value="36">36pt</option></select></div></div>',
        )),
        this.target
      );
    }),
    (Bt.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Bt.prototype.setValue = function (t) {
      t != null &&
        (this.target.find('option[value="' + t + '"]').length ||
          this.target.find("select").prepend('<option value="' + t + '">' + t + "</option>"),
        this.target.find("select").val(t));
    }),
    (Bt.prototype.destroy = function () {
      this.target.remove();
    }));
  function fe() {
    this.name = "showInPage";
  }
  ((fe.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">显示规则</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="first">首页</option><option value="odd">奇数页</option><option value="even">偶数页</option><option value="last">尾页</option></select></div></div>',
      )),
      this.target
    );
  }),
    (fe.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (fe.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (fe.prototype.destroy = function () {
      this.target.remove();
    }));
  function ce() {
    this.name = "panelPaperRule";
  }
  ((ce.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">打印规则</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="odd">保持奇数</option><option value="even">保持偶数</option></select></div></div>',
      )),
      this.target
    );
  }),
    (ce.prototype.getValue = function () {
      var t = this.target.find("select").val();
      return t ? t.toString() : void 0;
    }),
    (ce.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (ce.prototype.destroy = function () {
      this.target.remove();
    }));
  function ge() {
    this.name = "leftSpaceRemoved";
  }
  ((ge.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">移除段落左侧空白</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="true">移除</option><option value="false">不移除</option></select></div></div>',
      )),
      this.target
    );
  }),
    (ge.prototype.getValue = function () {
      if (this.target.find("select").val() === "false") return !1;
    }),
    (ge.prototype.setValue = function (t) {
      this.target.find("select").val((t ?? "").toString());
    }),
    (ge.prototype.destroy = function () {
      this.target.remove();
    }));
  function me() {
    this.name = "firstPaperFooter";
  }
  ((me.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">首页页尾</div><div class="kuprint-option-item-field"><input type="text" placeholder="首页页尾" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (me.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (me.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (me.prototype.destroy = function () {
      this.target.remove();
    }));
  function ve() {
    this.name = "lastPaperFooter";
  }
  ((ve.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">尾页页尾</div><div class="kuprint-option-item-field"><input type="text" placeholder="尾页页尾" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (ve.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (ve.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (ve.prototype.destroy = function () {
      this.target.remove();
    }));
  function ye() {
    this.name = "evenPaperFooter";
  }
  ((ye.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">偶数页页尾</div><div class="kuprint-option-item-field"><input type="text" placeholder="偶数页页尾" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (ye.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (ye.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (ye.prototype.destroy = function () {
      this.target.remove();
    }));
  function be() {
    this.name = "oddPaperFooter";
  }
  ((be.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">奇数页页尾</div><div class="kuprint-option-item-field"><input type="text" placeholder="奇数页页尾" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (be.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (be.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (be.prototype.destroy = function () {
      this.target.remove();
    }));
  function Te() {
    this.name = "fixed";
  }
  ((Te.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">位置固定</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="false">否</option><option value="true">是</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Te.prototype.getValue = function () {
      if (this.target.find("select").val() === "true") return !0;
    }),
    (Te.prototype.setValue = function (t) {
      this.target.find("select").val((t ?? "").toString());
    }),
    (Te.prototype.destroy = function () {
      this.target.remove();
    }));
  function we() {
    this.name = "axis";
  }
  ((we.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">拖动方向</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="v">横向</option><option value="h">竖向</option></select></div></div>',
      )),
      this.target
    );
  }),
    (we.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (we.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (we.prototype.destroy = function () {
      this.target.remove();
    }));
  function Ee() {
    this.name = "topOffset";
  }
  ((Ee.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">顶部偏移</div><div class="kuprint-option-item-field"><input type="text" placeholder="偏移量pt" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (Ee.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Ee.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (Ee.prototype.destroy = function () {
      this.target.remove();
    }));
  function Pe() {
    this.name = "leftOffset";
  }
  ((Pe.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">左偏移</div><div class="kuprint-option-item-field"><input type="text" placeholder="偏移量pt" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (Pe.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (Pe.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (Pe.prototype.destroy = function () {
      this.target.remove();
    }));
  function xe() {
    this.name = "lHeight";
  }
  ((xe.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label">最低高度</div><div class="kuprint-option-item-field"><input type="text" placeholder="文本过短或为空时的高度" class="auto-submit"></div></div>',
      )),
      this.target
    );
  }),
    (xe.prototype.getValue = function () {
      var t = this.target.find("input").val();
      return t ? parseFloat(t.toString()) : void 0;
    }),
    (xe.prototype.setValue = function (t) {
      this.target.find("input").val(t);
    }),
    (xe.prototype.destroy = function () {
      this.target.remove();
    }));
  function Ce() {
    this.name = "unShowInPage";
  }
  ((Ce.prototype.createTarget = function () {
    return (
      (this.target = $(
        '<div class="kuprint-option-item"><div class="kuprint-option-item-label">隐藏规则</div><div class="kuprint-option-item-field"><select class="auto-submit"><option value="">默认</option><option value="first">首页</option><option value="last">尾页</option></select></div></div>',
      )),
      this.target
    );
  }),
    (Ce.prototype.getValue = function () {
      return this.target.find("select").val() || void 0;
    }),
    (Ce.prototype.setValue = function (t) {
      this.target.find("select").val(t);
    }),
    (Ce.prototype.destroy = function () {
      this.target.remove();
    }));
  var xi = [
      new de(),
      new he(),
      new Bt(),
      new fe(),
      new ce(),
      new ge(),
      new me(),
      new ve(),
      new ye(),
      new be(),
      new Te(),
      new we(),
      new Ee(),
      new Pe(),
      new xe(),
      new Ce(),
    ],
    Ve = [].concat(gi, Ti, wi, Pi, xi),
    ke = {
      init: function () {
        if (!this.printElementOptionItems) {
          this.printElementOptionItems = {};
          for (var t = 0; t < Ve.length; t++) this.printElementOptionItems[Ve[t].name] = Ve[t];
        }
      },
      registerItem: function (t) {
        if (!t.name) throw new Error("styleItem must have name");
        (this.init(), (this.printElementOptionItems[t.name] = t));
      },
      getItem: function (t) {
        return (this.init(), this.printElementOptionItems[t]);
      },
    },
    S = function () {
      ((this.providers = []),
        (this.movingDistance = 1.5),
        (this.paperHeightTrim = 1),
        (this.text = {
          supportOptions: [
            { name: "title", hidden: !1, title: "" },
            { name: "field", hidden: !1 },
            { name: "testData", hidden: !1 },
            { name: "dataType", hidden: !1 },
            { name: "fontFamily", hidden: !1 },
            { name: "fontSize", hidden: !1 },
            { name: "fontWeight", hidden: !1 },
            { name: "letterSpacing", hidden: !1 },
            { name: "color", hidden: !1 },
            { name: "textDecoration", hidden: !1 },
            { name: "textAlign", hidden: !1 },
            { name: "textContentVerticalAlign", hidden: !1 },
            { name: "lineHeight", hidden: !1 },
            { name: "textType", hidden: !1 },
            { name: "barcodeMode", hidden: !1 },
            { name: "hideTitle", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "unShowInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "optionsGroup", hidden: !1 },
            { name: "borderLeft", hidden: !1 },
            { name: "borderTop", hidden: !1 },
            { name: "borderRight", hidden: !1 },
            { name: "borderBottom", hidden: !1 },
            { name: "borderWidth", hidden: !1 },
            { name: "borderColor", hidden: !1 },
            { name: "contentPaddingLeft", hidden: !1 },
            { name: "contentPaddingTop", hidden: !1 },
            { name: "contentPaddingRight", hidden: !1 },
            { name: "contentPaddingBottom", hidden: !1 },
            { name: "backgroundColor", hidden: !1 },
            { name: "formatter", hidden: !1 },
            { name: "styler", hidden: !1 },
          ],
          default: {
            fontFamily: void 0,
            fontSize: void 0,
            fontWeight: "",
            letterSpacing: void 0,
            textAlign: void 0,
            textType: "text",
            hideTitle: !1,
            height: 9.75,
            lineHeight: void 0,
            width: 120,
          },
        }),
        (this.image = {
          supportOptions: [
            { name: "field", hidden: !1 },
            { name: "src", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "formatter", hidden: !1 },
            { name: "styler", hidden: !1 },
          ],
          default: {},
        }),
        (this.longText = {
          supportOptions: [
            { name: "title", hidden: !1 },
            { name: "field", hidden: !1 },
            { name: "testData", hidden: !1 },
            { name: "fontFamily", hidden: !1 },
            { name: "fontSize", hidden: !1 },
            { name: "fontWeight", hidden: !1 },
            { name: "letterSpacing", hidden: !1 },
            { name: "textAlign", hidden: !1 },
            { name: "lineHeight", hidden: !1 },
            { name: "color", hidden: !1 },
            { name: "hideTitle", hidden: !1 },
            { name: "longTextIndent", hidden: !1 },
            { name: "leftSpaceRemoved", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "unShowInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "lHeight", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "optionsGroup", hidden: !1 },
            { name: "borderLeft", hidden: !1 },
            { name: "borderTop", hidden: !1 },
            { name: "borderRight", hidden: !1 },
            { name: "borderBottom", hidden: !1 },
            { name: "borderWidth", hidden: !1 },
            { name: "borderColor", hidden: !1 },
            { name: "contentPaddingLeft", hidden: !1 },
            { name: "contentPaddingTop", hidden: !1 },
            { name: "contentPaddingRight", hidden: !1 },
            { name: "contentPaddingBottom", hidden: !1 },
            { name: "backgroundColor", hidden: !1 },
            { name: "formatter", hidden: !1 },
            { name: "styler", hidden: !1 },
          ],
          default: {
            fontFamily: void 0,
            fontSize: void 0,
            fontWeight: "",
            letterSpacing: void 0,
            textAlign: void 0,
            hideTitle: !1,
            height: 42,
            lineHeight: void 0,
            width: 550,
          },
        }),
        (this.table = {
          supportOptions: [
            { name: "field", hidden: !1 },
            { name: "fontFamily", hidden: !1 },
            { name: "fontSize", hidden: !1 },
            { name: "lineHeight", hidden: !1 },
            { name: "textAlign", hidden: !1 },
            { name: "gridColumns", hidden: !1 },
            { name: "gridColumnsGutter", hidden: !1 },
            { name: "tableBorder", hidden: !1 },
            { name: "tableHeaderBorder", hidden: !1 },
            { name: "tableHeaderCellBorder", hidden: !1 },
            { name: "tableHeaderRowHeight", hidden: !1 },
            { name: "tableHeaderBackground", hidden: !1 },
            { name: "tableHeaderFontSize", hidden: !1 },
            { name: "tableHeaderFontWeight", hidden: !1 },
            { name: "tableBodyRowHeight", hidden: !1 },
            { name: "tableBodyRowBorder", hidden: !1 },
            { name: "tableBodyCellBorder", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "lHeight", hidden: !1 },
            { name: "autoCompletion", hidden: !1 },
            { name: "columns", hidden: !1 },
            { name: "styler", hidden: !1 },
            { name: "rowStyler", hidden: !1 },
            { name: "tableFooterRepeat", hidden: !1 },
            { name: "footerFormatter", hidden: !1 },
            { name: "gridColumnsFooterFormatter", hidden: !1 },
          ],
          default: {
            fontFamily: void 0,
            fontSize: void 0,
            fontWeight: "",
            textAlign: void 0,
            tableBorder: void 0,
            tableHeaderBorder: void 0,
            tableHeaderCellBorder: void 0,
            tableHeaderBackground: void 0,
            tableHeaderRowHeight: void 0,
            tableHeaderFontWeight: void 0,
            tableBodyCellBorder: void 0,
            tableBodyRowHeight: void 0,
            letterSpacing: "",
            lineHeight: void 0,
            width: 550,
          },
        }),
        (this.tableCustom = {
          supportOptions: [
            { name: "field", hidden: !1 },
            { name: "fontFamily", hidden: !1 },
            { name: "fontSize", hidden: !1 },
            { name: "textAlign", hidden: !1 },
            { name: "tableBorder", hidden: !1 },
            { name: "tableHeaderBorder", hidden: !1 },
            { name: "tableHeaderCellBorder", hidden: !1 },
            { name: "tableHeaderRowHeight", hidden: !1 },
            { name: "tableHeaderFontSize", hidden: !1 },
            { name: "tableHeaderFontWeight", hidden: !1 },
            { name: "tableHeaderBackground", hidden: !1 },
            { name: "tableBodyRowHeight", hidden: !1 },
            { name: "tableBodyRowBorder", hidden: !1 },
            { name: "tableBodyCellBorder", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "lHeight", hidden: !1 },
            { name: "autoCompletion", hidden: !1 },
            { name: "tableFooterRepeat", hidden: !1 },
          ],
          default: {
            fontFamily: void 0,
            fontSize: void 0,
            fontWeight: "",
            textAlign: void 0,
            tableBorder: void 0,
            tableHeaderBorder: void 0,
            tableHeaderCellBorder: void 0,
            tableHeaderBackground: void 0,
            tableHeaderRowHeight: void 0,
            tableHeaderFontWeight: void 0,
            tableBodyCellBorder: void 0,
            tableBodyRowHeight: void 0,
            letterSpacing: "",
            lineHeight: void 0,
            width: 550,
          },
        }),
        (this.hline = {
          supportOptions: [
            { name: "borderColor", hidden: !1 },
            { name: "borderWidth", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "borderStyle", hidden: !1 },
          ],
          default: { borderWidth: 0.75, height: 9, width: 90 },
        }),
        (this.vline = {
          supportOptions: [
            { name: "borderColor", hidden: !1 },
            { name: "borderWidth", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "borderStyle", hidden: !1 },
          ],
          default: { borderWidth: void 0, height: 90, width: 9 },
        }),
        (this.rect = {
          supportOptions: [
            { name: "borderColor", hidden: !1 },
            { name: "borderWidth", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "borderStyle", hidden: !1 },
          ],
          default: { borderWidth: void 0, height: 90, width: 90 },
        }),
        (this.oval = {
          supportOptions: [
            { name: "borderColor", hidden: !1 },
            { name: "borderWidth", hidden: !1 },
            { name: "showInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "transform", hidden: !1 },
            { name: "borderStyle", hidden: !1 },
          ],
          default: { borderWidth: void 0, height: 90, width: 90 },
        }),
        (this.html = {
          supportOptions: [
            { name: "showInPage", hidden: !1 },
            { name: "unShowInPage", hidden: !1 },
            { name: "fixed", hidden: !1 },
            { name: "axis", hidden: !1 },
            { name: "formatter", hidden: !1 },
          ],
          default: { height: 90, width: 90 },
        }),
        (this.tableColumn = {
          supportOptions: [
            { name: "title", hidden: !1 },
            { name: "align", hidden: !1 },
            { name: "halign", hidden: !1 },
            { name: "vAlign", hidden: !1 },
            { name: "paddingLeft", hidden: !1 },
            { name: "paddingRight", hidden: !1 },
            { name: "formatter2", hidden: !1 },
            { name: "styler2", hidden: !1 },
          ],
          default: { height: 90, width: 90 },
        }));
    };
  ((S.prototype.init = function (t) {
    t && $.extend(this, t);
  }),
    Object.defineProperty(S, "instance", {
      get: function () {
        var t = S;
        return (
          t._instance ||
            ((t._instance = new S()),
            window.KUPRINT_CONFIG && $.extend(t._instance, window.KUPRINT_CONFIG),
            t._instance.optionItems &&
              t._instance.optionItems.forEach(function (e) {
                ke.registerItem(e);
              })),
          t._instance
        );
      },
      enumerable: !0,
      configurable: !0,
    }));
  function Qe(t) {
    this.printElement = t;
  }
  Qe.prototype.updatePosition = function (t, e) {
    ((this.left = t), (this.top = e));
  };
  var C = function () {
    ((this.printTemplateContainer = {}),
      (this.A1 = { width: 841, height: 594 }),
      (this.A2 = { width: 420, height: 594 }),
      (this.A3 = { width: 420, height: 297 }),
      (this.A4 = { width: 210, height: 297 }),
      (this.A5 = { width: 210, height: 148 }),
      (this.A6 = { width: 105, height: 148 }),
      (this.A7 = { width: 105, height: 74 }),
      (this.A8 = { width: 52, height: 74 }),
      (this.B1 = { width: 1e3, height: 707 }),
      (this.B2 = { width: 500, height: 707 }),
      (this.B3 = { width: 500, height: 353 }),
      (this.B4 = { width: 250, height: 353 }),
      (this.B5 = { width: 250, height: 176 }),
      (this.B6 = { width: 125, height: 176 }),
      (this.B7 = { width: 125, height: 88 }),
      (this.B8 = { width: 62, height: 88 }),
      (this.dragLengthCNum = function (t, e) {
        var i = 0.75 * t;
        return (e && (e = e), Math.round(i / e) * e);
      }));
  };
  (Object.defineProperty(C, "instance", {
    get: function () {
      var t = C;
      return (t._instance || (t._instance = new C()), t._instance);
    },
    enumerable: !0,
    configurable: !0,
  }),
    (C.prototype.getDragingPrintElement = function () {
      return C.instance.dragingPrintElement;
    }),
    (C.prototype.setDragingPrintElement = function (t) {
      C.instance.dragingPrintElement = new Qe(t);
    }),
    (C.prototype.guid = function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
        var e = (Math.random() * 16) | 0;
        return (t === "x" ? e : (e & 3) | 8).toString(16);
      });
    }),
    (C.prototype.imageToBase64 = function (t) {
      if (t.attr("src").indexOf("base64") === -1)
        try {
          var e = document.createElement("canvas"),
            i = new Image();
          ((i.src = t.attr("src")),
            (e.width = i.width),
            (e.height = i.height),
            e.getContext("2d").drawImage(i, 0, 0),
            t.attr("src", e.toDataURL("image/png")));
        } catch {
          try {
            this.xhrLoadImage(t);
          } catch (o) {
            console.log(o);
          }
        }
    }),
    (C.prototype.xhrLoadImage = function () {}),
    (C.prototype.transformImg = function (t) {
      var e = this;
      t.each(function (i, n) {
        e.imageToBase64($(n));
      });
    }),
    (C.prototype.getPrintTemplateById = function (t) {
      return C.instance.printTemplateContainer[t];
    }),
    (C.prototype.setPrintTemplateById = function (t, e) {
      C.instance.printTemplateContainer[t] = e;
    }));
  var Ci = yi,
    E = {
      createTableHead: function (t, e) {
        for (
          var i = E.reconsitutionTableColumnTree(t),
            n = $("<thead></thead>"),
            o = E.getColumnsWidth(i, e),
            r = 0;
          r < i.totalLayer;
          r++
        ) {
          var a = $("<tr></tr>");
          (i[r].forEach(function (p) {
            var s = $("<td></td>");
            (p.id && s.attr("id", p.id),
              p.columnId && s.attr("column-id", p.columnId),
              (p.align || p.halign) && s.css("text-align", p.halign || p.align),
              p.vAlign && s.css("vertical-align", p.vAlign),
              p.colspan > 1 && s.attr("colspan", p.colspan),
              p.rowspan > 1 && s.attr("rowspan", p.rowspan),
              s.html(p.title),
              o[p.id]
                ? ((p.hasWidth = !0),
                  (p.targetWidth = o[p.id]),
                  s.attr("haswidth", "haswidth"),
                  s.css("width", o[p.id] + "pt"))
                : (p.hasWidth = !1),
              a.append(s));
          }),
            n.append(a));
        }
        return (E.syncTargetWidthToOption(t), n);
      },
      createTableFooter: function (t, e, i, n, o, r) {
        var a = $("<tfoot></tfoot>"),
          p = E.getFooterFormatter(i, n);
        return (p && a.append(p(i, e, o, r)), a);
      },
      createTableRow: function (t, e, i, n) {
        var o = E.reconsitutionTableColumnTree(t),
          r = $("<tbody></tbody>"),
          a = e || [];
        return (
          n.groupFields && n.groupFields.length
            ? f
                .groupBy(a, n.groupFields, function (p) {
                  var s = {};
                  return (
                    n.groupFields.forEach(function (l) {
                      s[l] = p[l];
                    }),
                    s
                  );
                })
                .forEach(function (p) {
                  if (n.groupFormatter) {
                    var s = $("<tr><td colspan=" + o.colspan + "></td></tr>");
                    (s.find("td").append(n.groupFormatter(p, i)), r.append(s));
                  }
                  if (
                    (p.rows.forEach(function (u) {
                      r.append(E.createRowTarget(o, u, i, n));
                    }),
                    n.groupFooterFormatter)
                  ) {
                    var l = $("<tr><td colspan=" + o.colspan + "></td></tr>");
                    (l.find("td").append(n.groupFooterFormatter(p, i)), r.append(l));
                  }
                })
            : a.forEach(function (p) {
                r.append(E.createRowTarget(o, p, i, n));
              }),
          r
        );
      },
      createRowTarget: function (t, e, i, n) {
        var o = $("<tr></tr>");
        (o.data("rowData", e),
          t.rowColumns.forEach(function (p, s) {
            var l = $("<td></td>");
            (p.field && l.attr("field", p.field),
              p.align && l.css("text-align", p.align),
              p.vAlign && l.css("vertical-align", p.vAlign));
            var u = E.getColumnFormatter(p),
              h = u ? u(e[p.field], e, s, i) : e[p.field];
            l.html(h);
            var d = E.getColumnStyler(p);
            if (d) {
              var c = d(e[p.field], e, s, i);
              c &&
                Object.keys(c).forEach(function (m) {
                  l.css(m, c[m]);
                });
            }
            o.append(l);
          }));
        var r = E.getRowStyler(i, n);
        if (r) {
          var a = r(e, i);
          a &&
            Object.keys(a).forEach(function (p) {
              o.css(p, a[p]);
            });
        }
        return o;
      },
      createEmptyRowTarget: function (t) {
        var e = E.reconsitutionTableColumnTree(t),
          i = $("<tr></tr>");
        return (
          e.rowColumns.forEach(function (n) {
            var o = $("<td></td>");
            (n.field && o.attr("field", n.field),
              n.align && o.css("text-align", n.align),
              n.vAlign && o.css("vertical-align", n.vAlign),
              i.append(o));
          }),
          i
        );
      },
      getColumnsWidth: function (t, e) {
        var i = {},
          n = E.allAutoWidth(t),
          o = E.allFixedWidth(t);
        return (
          t.rowColumns.forEach(function (r) {
            if (r.fixed) i[r.id] = r.width;
            else {
              var a = e - o;
              i[r.id] = (r.width / n) * (a > 0 ? a : 0);
            }
          }),
          i
        );
      },
      resizeTableCellWidth: function (t, e, i) {
        var n = E.reconsitutionTableColumnTree(e),
          o = E.getColumnsWidth(n, i);
        t.find("thead tr td[haswidth]").each(function (r, a) {
          var p = $(a).attr("id");
          $(a).css("width", o[p] + "pt");
        });
      },
      allAutoWidth: function (t) {
        var e = 0;
        return (
          t.rowColumns.forEach(function (i) {
            e += i.fixed ? 0 : i.width;
          }),
          e
        );
      },
      allFixedWidth: function (t) {
        var e = 0;
        return (
          t.rowColumns.forEach(function (i) {
            e += i.fixed ? i.width : 0;
          }),
          e
        );
      },
      reconsitutionTableColumnTree: function (t, e, i) {
        var n = e || new Ci();
        n.colspan = 0;
        for (var o = 0; o < t.length; o++)
          ((n.totalLayer = o + 1),
            (n[o] = t[o].columns),
            o === 0 &&
              t[o].columns.forEach(function (r) {
                n.colspan += r.colspan;
              }));
        return ((n.rowColumns = E.getOrderedColumns(n)), n);
      },
      syncTargetWidthToOption: function (t) {
        t.forEach(function (e) {
          e.columns.forEach(function (i) {
            i.hasWidth && (i.width = i.targetWidth);
          });
        });
      },
      getFooterFormatter: function (t, e) {
        var i;
        if ((e.footerFormatter && (i = e.footerFormatter), t.footerFormatter))
          try {
            i = new Function("return (" + t.footerFormatter + ")")();
          } catch (n) {
            console.log(n);
          }
        return i;
      },
      getRowStyler: function (t, e) {
        var i;
        if ((e.rowStyler && (i = e.rowStyler), t.rowStyler))
          try {
            i = new Function("return (" + t.rowStyler + ")")();
          } catch (n) {
            console.log(n);
          }
        return i;
      },
      getColumnStyler: function (t) {
        var e;
        if ((t.styler && (e = t.styler), t.styler2))
          try {
            e = new Function("return (" + t.styler2 + ")")();
          } catch (i) {
            console.log(i);
          }
        return e;
      },
      getColumnFormatter: function (t) {
        var e;
        if ((t.formatter && (e = t.formatter), t.formatter2))
          try {
            e = new Function("return (" + t.formatter2 + ")")();
          } catch (i) {
            console.log(i);
          }
        return e;
      },
      getOrderedColumns: function (t) {
        for (var e = {}, i = 0; i < t.totalLayer; i++)
          t[i].forEach(function (n) {
            for (var o = 0; o < n.rowspan; o++) {
              var r = i + o;
              (e[r] || (e[r] = []), e[r].push(n));
            }
          });
        return e[t.totalLayer - 1];
      },
    },
    Mt = C,
    zt = S;
  function g(t) {
    ((this.printElementType = t), (this.id = Mt.instance.guid()));
  }
  ((g.prototype.getConfigOptionsByName = function (t) {
    return zt.instance[t];
  }),
    (g.prototype.getProxyTarget = function (t) {
      t && this.SetProxyTargetOption(t);
      var e = this.getData(),
        i = this.createTarget(this.getTitle(), e);
      return (this.updateTargetSize(i), this.css(i, e), i);
    }),
    (g.prototype.SetProxyTargetOption = function (t) {
      (this.options.getPrintElementOptionEntity(), $.extend(this.options, t));
    }),
    (g.prototype.showInPage = function (t, e) {
      var i = this.options.showInPage,
        n = this.options.unShowInPage;
      if (i) {
        if (i === "first") return t === 0;
        if (t === e - 1 && n === "last") return !1;
        if (i === "odd") return (t !== 0 || n !== "first") && t % 2 === 0;
        if (i === "even") return t % 2 === 1;
        if (i === "last") return t === e - 1;
      }
      return (t !== 0 || n !== "first") && (t !== e - 1 || n !== "last");
    }),
    (g.prototype.setTemplateId = function (t) {
      this.templateId = t;
    }),
    (g.prototype.setPanel = function (t) {
      this.panel = t;
    }),
    (g.prototype.getField = function () {
      return this.options.field || this.printElementType.field;
    }),
    (g.prototype.getTitle = function () {
      return this.printElementType.title;
    }),
    (g.prototype.updateSizeAndPositionOptions = function (t, e, i, n) {
      (this.options.setLeft(t),
        this.options.setTop(e),
        this.options.copyDesignTopFromTop(),
        this.options.setWidth(i),
        this.options.setHeight(n),
        f.event.trigger("kuprintTemplateDataChanged_" + this.templateId));
    }),
    (g.prototype.initSizeByHtml = function (t) {
      if (t && t.length) {
        this.createTempContainer();
        var e = t.clone();
        (this.getTempContainer().append(e),
          this.options.initSizeByHtml(
            parseInt(f.px.toPt(e.width()).toString()),
            parseInt(f.px.toPt(e.height()).toString()),
          ),
          this.removeTempContainer());
      }
    }),
    (g.prototype.updateTargetSize = function (t) {
      (t.css("width", this.options.displayWidth()), t.css("height", this.options.displayHeight()));
    }),
    (g.prototype.updateTargetWidth = function (t) {
      t.css("width", this.options.displayWidth());
    }),
    (g.prototype.getDesignTarget = function (t) {
      var e = this;
      return (
        (this.designTarget = this.getHtml(t)[0].target),
        (this.designPaper = t),
        this.designTarget.click(function () {
          f.event.trigger(e.getPrintElementSelectEventKey(), { printElement: e });
        }),
        this.designTarget
      );
    }),
    (g.prototype.getPrintElementSelectEventKey = function () {
      return "PrintElementSelectEventKey_" + this.templateId;
    }),
    (g.prototype.design = function (t, e) {
      var i = this;
      (this.designTarget.hidraggable({
        axis: i.options.axis && t && t.axisEnabled ? i.options.axis : void 0,
        onDrag: function (n, o, r) {
          (i.updateSizeAndPositionOptions(o, r), i.createLineOfPosition(e));
        },
        moveUnit: "pt",
        minMove: zt.instance.movingDistance,
        onBeforeDrag: function () {
          ((Mt.instance.draging = !0), i.designTarget.focus(), i.createLineOfPosition(e));
        },
        onStopDrag: function () {
          ((Mt.instance.draging = !1), i.removeLineOfPosition());
        },
      }),
        this.designTarget.hireizeable({
          showPoints: i.getReizeableShowPoints(),
          onBeforeResize: function () {
            Mt.instance.draging = !0;
          },
          onResize: function (n, o, r, a, p) {
            (i.onResize(n, o, r, a, p), i.createLineOfPosition(e));
          },
          onStopResize: function () {
            ((Mt.instance.draging = !1), i.removeLineOfPosition());
          },
        }),
        this.bingCopyEvent(this.designTarget),
        this.bingKeyboardMoveEvent(this.designTarget, e));
    }),
    (g.prototype.getPrintElementEntity = function (t) {
      return t
        ? new $e(
            void 0,
            this.options.getPrintElementOptionEntity(),
            this.printElementType.getPrintElementTypeEntity(),
          )
        : new $e(this.printElementType.tid, this.options.getPrintElementOptionEntity(), void 0);
    }),
    (g.prototype.submitOption = function () {
      var t = this;
      (this.getPrintElementOptionItems().forEach(function (e) {
        var i = e.getValue();
        i && typeof i == "object"
          ? Object.keys(i).forEach(function (n) {
              t.options[n] = i[n];
            })
          : (t.options[e.name] = i);
      }),
        this.updateDesignViewFromOptions(),
        f.event.trigger("kuprintTemplateDataChanged_" + this.templateId));
    }),
    (g.prototype.getReizeableShowPoints = function () {
      return ["s", "e"];
    }),
    (g.prototype.onResize = function (t, e, i, n, o) {
      this.updateSizeAndPositionOptions(o, n, i, e);
    }),
    (g.prototype.getOrderIndex = function () {
      return this.options.getTop();
    }),
    (g.prototype.getHtml = function (t, e, i) {
      var n = 0;
      this.setCurrenttemplateData(e);
      var o = [],
        r = this.getBeginPrintTopInPaperByReferenceElement(t),
        a = t.getPaperFooter(n);
      !this.isHeaderOrFooter() &&
        !this.isFixed() &&
        r > a &&
        (o.push(new z({ target: void 0, printLine: void 0 })),
        (r = r - a + t.paperHeader),
        n++,
        (a = t.getPaperFooter(n)));
      var p = this.getData(e),
        s = this.createTarget(this.getTitle(), p, i);
      return (
        this.updateTargetSize(s),
        this.css(s, p),
        s.css("position", "absolute"),
        s.css("left", this.options.displayLeft()),
        s.css("top", r + "pt"),
        o.push(new z({ target: s, printLine: r + this.options.getHeight() })),
        o
      );
    }),
    (g.prototype.getHtml2 = function (t, e, i) {
      var n = 0;
      this.setCurrenttemplateData(e);
      var o = [],
        r = this.getBeginPrintTopInPaperByReferenceElement(t),
        a = t.getPaperFooter(n);
      !this.isHeaderOrFooter() &&
        !this.isFixed() &&
        (r > a &&
          (o.push(new z({ target: void 0, printLine: void 0 })),
          (r = r - a + t.paperHeader),
          n++,
          (a = t.getPaperFooter(n))),
        r <= a &&
          r + this.options.getHeight() > a &&
          (o.push(new z({ target: void 0, printLine: void 0 })),
          (r = t.paperHeader),
          n++,
          (a = t.getPaperFooter(n))));
      var p = this.getData(e),
        s = this.createTarget(this.getTitle(), p);
      return (
        this.updateTargetSize(s),
        this.css(s, p),
        s.css("position", "absolute"),
        s.css("left", this.options.displayLeft()),
        s.css("top", r + "pt"),
        o.push(
          new z({
            target: s,
            printLine: r + this.options.getHeight(),
            referenceElement: new G({
              top: this.options.getTop(),
              left: this.options.getLeft(),
              height: this.options.getHeight(),
              width: this.options.getWidth(),
              beginPrintPaperIndex: t.index,
              bottomInLastPaper: r + this.options.getHeight(),
              printTopInPaper: r,
            }),
          }),
        ),
        o
      );
    }),
    (g.prototype.getBeginPrintTopInPaperByReferenceElement = function (t) {
      var e = this.options.getTop();
      if (this.isHeaderOrFooter() || this.isFixed()) return e;
      var i = t.referenceElement;
      return i.isPositionLeftOrRight(e)
        ? i.printTopInPaper + (e - i.top)
        : i.bottomInLastPaper + (e - (i.top + i.height));
    }),
    (g.prototype.css = function (t, e) {
      var i = this,
        n = [],
        o = this.getConfigOptions();
      if (o) {
        var r = o.supportOptions;
        r &&
          r.forEach(function (a) {
            var p = ke.getItem(a.name);
            if (p && p.css) {
              var s = p.css(t, i.options.getValueFromOptionsOrDefault(a.name));
              s && n.push(s);
            }
          });
      }
      this.stylerCss(t, e);
    }),
    (g.prototype.stylerCss = function (t, e) {
      var i = this.getStyler();
      if (i) {
        var n = i(e, this.options, t, this._currenttemplateData);
        n &&
          Object.keys(n).forEach(function (o) {
            t.css(o, n[o]);
          });
      }
    }),
    (g.prototype.getData = function (t) {
      return t ? t[this.getField()] || "" : this.printElementType.getData();
    }),
    (g.prototype.getPrintElementOptionItems = function () {
      if (this._printElementOptionItems) return this._printElementOptionItems;
      var t = [],
        e = this.getConfigOptions();
      if (e) {
        var i = e.supportOptions;
        i &&
          i
            .filter(function (n) {
              return !n.hidden;
            })
            .forEach(function (n) {
              var o = ke.getItem(n.name);
              t.push(o);
            });
      }
      return (
        (this._printElementOptionItems = this.filterOptionItems(t.concat())),
        this._printElementOptionItems
      );
    }),
    (g.prototype.getPrintElementOptionItemsByName = function (t) {
      var e = [],
        i = this.getConfigOptionsByName(t);
      if (i) {
        var n = i.supportOptions;
        n &&
          n
            .filter(function (o) {
              return !o.hidden;
            })
            .forEach(function (o) {
              e.push(ke.getItem(o.name));
            });
      }
      return e.concat();
    }),
    (g.prototype.filterOptionItems = function (t) {
      return this.printElementType.field
        ? t.filter(function (e) {
            return e.name !== "field";
          })
        : t;
    }),
    (g.prototype.createTempContainer = function () {
      (this.removeTempContainer(),
        $("body").append(
          $(
            '<div class="kuprint_temp_Container kuprint-printPaper" style="overflow:hidden;height:0px;box-sizing:border-box;"></div>',
          ),
        ));
    }),
    (g.prototype.removeTempContainer = function () {
      $(".kuprint_temp_Container").remove();
    }),
    (g.prototype.getTempContainer = function () {
      return $(".kuprint_temp_Container");
    }),
    (g.prototype.isHeaderOrFooter = function () {
      return (
        this.options.getTopInDesign() < this.panel.paperHeader ||
        this.options.getTopInDesign() >= this.panel.paperFooter
      );
    }),
    (g.prototype.delete = function () {
      this.designTarget && this.designTarget.remove();
    }),
    (g.prototype.setCurrenttemplateData = function (t) {
      this._currenttemplateData = t;
    }),
    (g.prototype.isFixed = function () {
      return this.options.fixed;
    }),
    (g.prototype.onRendered = function (t, e) {
      this.printElementType &&
        this.printElementType.onRendered &&
        this.printElementType.onRendered(e, this.options, t.getTarget());
    }),
    (g.prototype.createLineOfPosition = function (t) {
      var e = $(".toplineOfPosition" + this.id),
        i = $(".leftlineOfPosition" + this.id),
        n = $(".rightlineOfPosition" + this.id),
        o = $(".bottomlineOfPosition" + this.id);
      (e.length
        ? e.css("top", this.options.displayTop())
        : ((e = $(
            '<div class="toplineOfPosition' +
              this.id +
              '" style="border:0;border-top:1px dashed rgb(169,169,169);position:absolute;width:100%;"></div>',
          )),
          e.css("top", this.options.displayTop()),
          e.css("width", t.displayWidth()),
          this.designTarget.parents(".kuprint-printPaper-content").append(e)),
        i.length
          ? i.css("left", this.options.displayLeft())
          : ((i = $(
              '<div class="leftlineOfPosition' +
                this.id +
                '" style="border:0;border-left:1px dashed rgb(169,169,169);position:absolute;height:100%;"></div>',
            )),
            i.css("left", this.options.displayLeft()),
            i.css("height", t.displayHeight()),
            this.designTarget.parents(".kuprint-printPaper-content").append(i)),
        n.length
          ? n.css("left", this.options.getLeft() + this.options.getWidth() + "pt")
          : ((n = $(
              '<div class="rightlineOfPosition' +
                this.id +
                '" style="border:0;border-left:1px dashed rgb(169,169,169);position:absolute;height:100%;"></div>',
            )),
            n.css("left", this.options.getLeft() + this.options.getWidth() + "pt"),
            n.css("height", t.displayHeight()),
            this.designTarget.parents(".kuprint-printPaper-content").append(n)),
        o.length
          ? o.css("top", this.options.getTop() + this.options.getHeight() + "pt")
          : ((o = $(
              '<div class="bottomlineOfPosition' +
                this.id +
                '" style="border:0;border-top:1px dashed rgb(169,169,169);position:absolute;width:100%;"></div>',
            )),
            o.css("top", this.options.getTop() + this.options.getHeight() + "pt"),
            o.css("width", t.displayWidth()),
            this.designTarget.parents(".kuprint-printPaper-content").append(o)));
    }),
    (g.prototype.removeLineOfPosition = function () {
      ($(".toplineOfPosition" + this.id).remove(),
        $(".leftlineOfPosition" + this.id).remove(),
        $(".rightlineOfPosition" + this.id).remove(),
        $(".bottomlineOfPosition" + this.id).remove());
    }),
    (g.prototype.getFields = function () {
      var t = this.printElementType.getFields();
      return (t || (t = Mt.instance.getPrintTemplateById(this.templateId).getFields()), t);
    }),
    (g.prototype.bingCopyEvent = function () {}),
    (g.prototype.getFormatter = function () {
      var t;
      if (
        (this.printElementType.formatter && (t = this.printElementType.formatter),
        this.options.formatter)
      )
        try {
          t = new Function("return (" + this.options.formatter + ")")();
        } catch (e) {
          console.log(e);
        }
      return t;
    }),
    (g.prototype.getStyler = function () {
      var t;
      if ((this.printElementType.styler && (t = this.printElementType.styler), this.options.styler))
        try {
          t = new Function("return (" + this.options.styler + ")")();
        } catch (e) {
          console.log(e);
        }
      return t;
    }),
    (g.prototype.bingKeyboardMoveEvent = function (t, e) {
      var i = this;
      (t.attr("tabindex", "1"),
        t.keydown(function (n) {
          var o, r;
          switch (n.keyCode) {
            case 37:
              ((o = i.options.getLeft()),
                i.updateSizeAndPositionOptions(o - zt.instance.movingDistance),
                t.css("left", i.options.displayLeft()),
                i.createLineOfPosition(e),
                n.preventDefault());
              break;
            case 38:
              ((r = i.options.getTop()),
                i.updateSizeAndPositionOptions(void 0, r - zt.instance.movingDistance),
                t.css("top", i.options.displayTop()),
                i.createLineOfPosition(e),
                n.preventDefault());
              break;
            case 39:
              ((o = i.options.getLeft()),
                i.updateSizeAndPositionOptions(o + zt.instance.movingDistance),
                t.css("left", i.options.displayLeft()),
                i.createLineOfPosition(e),
                n.preventDefault());
              break;
            case 40:
              ((r = i.options.getTop()),
                i.updateSizeAndPositionOptions(void 0, r + zt.instance.movingDistance),
                t.css("top", i.options.displayTop()),
                i.createLineOfPosition(e),
                n.preventDefault());
              break;
          }
        }));
    }),
    (g.prototype.inRect = function (t) {
      var e = this.designTarget.offset();
      return t.minX < e.left && t.minY < e.top && t.maxX > e.left && t.maxY > e.top;
    }),
    (g.prototype.multipleSelect = function (t) {
      t
        ? this.designTarget.addClass("multipleSelect")
        : this.designTarget.removeClass("multipleSelect");
    }),
    (g.prototype.updatePositionByMultipleSelect = function (t, e) {
      (this.updateSizeAndPositionOptions(t + this.options.getLeft(), e + this.options.getTop()),
        this.designTarget.css("left", this.options.displayLeft()),
        this.designTarget.css("top", this.options.displayTop()));
    }));
  var $e = function (t, e, i) {
      ((this.tid = t), (this.options = e), (this.printElementType = i));
    },
    ki = function (t) {
      ((this.table = t.table),
        (this.isEnableEdit = t.isEnableEdit),
        (this.trs = t.trs),
        (this.resizeRow = t.resizeRow),
        (this.resizeColumn = t.resizeColumn),
        (this.isEnableEditField = t.isEnableEditField),
        (this.isEnableContextMenu = t.isEnableContextMenu),
        (this.isEnableInsertRow = t.isEnableInsertRow),
        (this.isEnableDeleteRow = t.isEnableDeleteRow),
        (this.isEnableInsertColumn = t.isEnableInsertColumn),
        (this.isEnableDeleteColumn = t.isEnableDeleteColumn),
        (this.isEnableMergeCell = t.isEnableMergeCell),
        (this.columnResizable = t.columnResizable),
        (this.columnAlignEditable = t.columnAlignEditable));
    },
    Hi = (function () {
      function t(e) {
        this.options = new ki(e);
      }
      return (
        (t.prototype.enableEdit = function () {
          return this.options.isEnableEdit;
        }),
        (t.prototype.disableEdit = function () {
          return this.options.isEnableEdit;
        }),
        (t.prototype.isEnableEdit = function () {
          return this.options.isEnableEdit;
        }),
        t
      );
    })(),
    _e = function (t) {
      ((this.cell = t.cell),
        (this.link = t.link),
        (this.linkType = t.linkType),
        (this.bottom = t.bottom),
        (this.rightMost = t.rightMost),
        (this.rowLevel = t.rowLevel),
        (this.columnLevel = t.columnLevel),
        (this.indexInTableGridRow = t.indexInTableGridRow),
        (this.indexInTableGridColumn = t.indexInTableGridColumn));
    },
    Ze = {
      getLeftTableCell: function (t, e) {
        var i;
        return (
          t.forEach(function (n, o) {
            n.cell && o < e && (i = n.cell);
          }),
          i
        );
      },
      getIndex: function (t, e) {
        var i;
        return (
          t.forEach(function (n, o) {
            n.cell && n.cell.id === e && (i = o);
          }),
          i
        );
      },
    },
    ti = function (t, e) {
      ((this.target = t), (this.grips = e));
    },
    ei = function (t) {
      this.target = t;
    },
    Oi = function () {
      this.rowColumns = [];
    },
    ii = {
      getColumnsWidth: function (t, e) {
        var i = {},
          n = ii.allAutoWidth(t);
        return (
          t.rowColumns.forEach(function (o) {
            i[o.id] = (o.width / n) * (e > 0 ? e : 0);
          }),
          i
        );
      },
      resizeTableCellWeight: function (t) {
        t.forEach(function (e) {
          e.columns.forEach(function (i) {
            i.hasWidth && $(i.getTarget()).css("width", i.width + "pt");
          });
        });
      },
      allAutoWidth: function (t) {
        var e = 0;
        return (
          t.rowColumns.forEach(function (i) {
            e += i.width;
          }),
          e
        );
      },
      reconsitutionTableColumnTree: function (t, e) {
        for (var i = e || new Oi(), n = 0; n < t.length; n++)
          ((i.totalLayer = n + 1),
            (i[n] = t[n].columns),
            (i.rowColumns = i.rowColumns.concat(
              i[n].filter(function (o) {
                return o.rowspan === t.length - n;
              }),
            )));
        return i;
      },
    },
    Ii = (function () {
      function t(e) {
        ((this.signature = "HiTresizer"),
          (this.hitable = e),
          (this.rows = e.rows),
          (this.target = e.target));
      }
      return (
        (t.prototype.init = function () {
          (this.addResizeRowAndColumn(),
            this.hitable.optionsCoat.options.resizeColumn && this.createColumnGrips(),
            this.hitable.optionsCoat.options.resizeRow && this.createRowGrips());
        }),
        (t.prototype.resizeTableCellWidth = function () {
          ii.resizeTableCellWeight(this.rows);
        }),
        (t.prototype.addResizeRowAndColumn = function () {}),
        (t.prototype.createColumnGrips = function () {
          var e = this,
            i = [],
            n = $('<div class="columngrips"/>');
          (n.width(this.target.width()),
            this.rows.forEach(function (o) {
              o.columns.forEach(function (r, a) {
                if (r.getTarget().attr("haswidth")) {
                  var p = $('<div class="columngrip"><div class="gripResizer"></div></div>');
                  n.append(p);
                  var s = new ei(p);
                  (i.length > 0 && (i[i.length - 1].nextGrip = s),
                    i.push(s),
                    e.syncGrips(r, s),
                    $(p).hidraggable({
                      axis: "h",
                      onDrag: function () {},
                      moveUnit: "pt",
                      minMove: 1,
                      onBeforeDrag: function () {
                        if (((C.instance.draging = !0), !s.nextGrip)) return !1;
                        ((e.dragingGrip = s),
                          (e.dragingGrip.left = parseFloat(
                            e.dragingGrip.target.css("left").replace("px", ""),
                          )),
                          s.target.addClass("columngripDraging"));
                      },
                      onStopDrag: function () {
                        C.instance.draging = !1;
                        var l = parseFloat(e.dragingGrip.target.css("left").replace("px", "")),
                          u = f.px.toPt(l - e.dragingGrip.left);
                        ((s.cell.width = s.cell.width + u),
                          (s.nextGrip.cell.width = s.nextGrip.cell.width - u),
                          e.resizeTableCellWidth(),
                          s.target.removeClass("columngripDraging"),
                          e.updateColumnGrips());
                      },
                    }));
                }
              });
            }),
            this.target.before(n),
            (this.cgripContainer = new ti(n, i)));
        }),
        (t.prototype.updateColumnGrips = function () {
          this.cgripContainer && (this.cgripContainer.target.remove(), this.createColumnGrips());
        }),
        (t.prototype.updateRowGrips = function () {
          this.rgripContainer && (this.rgripContainer.target.remove(), this.createRowGrips());
        }),
        (t.prototype.createRowGrips = function () {
          var e = this,
            i = [],
            n = $('<div class="rowgrips"/>');
          (this.rows.forEach(function (o, r) {
            var a = $('<div class="rowgrip"><div class="gripResizer"></div></div>');
            n.append(a);
            var p = new ei(a);
            (i.push(p),
              r > 0 &&
                r < e.rows.length &&
                $(a).hidraggable({
                  axis: "v",
                  onDrag: function () {},
                  moveUnit: "pt",
                  minMove: 1,
                  onBeforeDrag: function () {
                    ((e.dragingGrip = p),
                      (e.dragingGrip.top = parseFloat(
                        e.dragingGrip.target.css("top").replace("px", ""),
                      )),
                      p.target.addClass("rowgripDraging"));
                  },
                  onStopDrag: function () {
                    var s = parseFloat(e.dragingGrip.target.css("top").replace("px", "")),
                      l = f.px.toPt(
                        s - e.dragingGrip.top + e.rows[r].columns[0].getTarget().height(),
                      );
                    (e.rows[r].columns[0].getTarget().css("height", l + "pt"),
                      e.syncRowGrips(),
                      p.target.removeClass("rowgripDraging"));
                  },
                }));
          }),
            this.target.before(n),
            (this.rgripContainer = new ti(n, i)),
            this.syncRowGrips());
        }),
        (t.prototype.syncGrips = function (e, i) {
          var n = e.getTarget();
          ((i.cell = e),
            i.target.css({
              left: n.offset().left - this.target.offset().left + n.outerWidth(!1),
              height: 30,
            }));
        }),
        (t.prototype.syncRowGrips = function () {
          var e = this;
          (this.rgripContainer.target.height(this.target.height()),
            this.rows.forEach(function (i, n) {
              var o = i.columns[0].getTarget();
              e.rgripContainer.grips[n].target.css({
                top: o.offset().top - e.target.offset().top + o.outerHeight(!1),
                width: 30,
              });
            }));
        }),
        (t.prototype.addResizerHeadRow = function () {
          this.target.find("thead").prepend("");
        }),
        t
      );
    })(),
    Si = {
      init: function () {},
      updateRowGrips: function () {},
      updateColumnGrips: function () {},
    },
    ni = (function () {
      function t(e) {
        ((this.id = ze.createId()),
          (this.optionsCoat = new Hi(e)),
          (this.handle = e.handle),
          (this.target = e.table),
          this.initRows(e.rows),
          this.init(e),
          (this.tableCellSelector = new A(this.rows, this.target)),
          (this.resizer = this.optionsCoat.options.columnResizable ? new Ii(this) : Si),
          this.resizer.init());
      }
      return (
        (t.prototype.insertRow = function (e, i, n) {
          var o = i || this.tableCellSelector.getSingleSelect();
          if (o) {
            var r = o.cell,
              a = this.rows[o.rowIndex],
              p = o.rowIndex,
              s = this.getCellGrid(),
              l = new R();
            if (
              (l.init(this.optionsCoat, void 0, a.isHead),
              n && l.getTarget().addClass(n),
              e === "above")
            )
              (s[p].forEach(function (h) {
                var d = h.link || h.cell,
                  c = d.width / d.colspan;
                if (h.columnLevel === 0) {
                  var m = l.createTableCell();
                  ((m.width = c), l.insertCellToLast(m));
                } else
                  h.linkType === "column" &&
                    ((h.link.rowspan += 1), h.link.getTarget().attr("rowspan", h.link.rowspan));
              }),
                this.rows.splice(p, 0, l),
                a.getTarget().before(l.getTarget()),
                f.event.trigger("newRow" + this.id, l));
            else {
              var u = p + r.rowspan - 1;
              (s[u].forEach(function (h) {
                var d = h.link || h.cell,
                  c = d.width / d.colspan;
                if (h.bottom) {
                  var m = l.createTableCell();
                  ((m.width = c), l.insertCellToLast(m));
                } else
                  (h.cell &&
                    ((h.cell.rowspan += 1), h.cell.getTarget().attr("rowspan", h.cell.rowspan)),
                    h.linkType === "column" &&
                      ((h.link.rowspan += 1), h.link.getTarget().attr("rowspan", h.link.rowspan)));
              }),
                this.rows.splice(u + 1, 0, l),
                this.rows[u].getTarget().after(l.getTarget()),
                f.event.trigger("newRow" + this.id, l));
            }
          }
        }),
        (t.prototype.insertColumn = function (e, i, n, o) {
          var r = this,
            a = this.rows.concat(this.trRows),
            p = i || this.tableCellSelector.getSingleSelect();
          if (p) {
            var s = p.cell,
              l = p.rowIndex,
              u = this.getCellGrid(a),
              h = u[l].filter(function (m) {
                return (m.cell && m.cell.id === s.id) || (m.link && m.link.id === s.id);
              });
            if (e === "left") {
              var d = h[0].indexInTableGridRow;
              u.forEach(function (m, y) {
                var v = m[d],
                  P = m.filter(function (V, T) {
                    return T >= d && V.cell;
                  });
                if (v.rowLevel === 0) {
                  var x = a[y],
                    w = x.createTableCell();
                  if ((n && w.getTarget().addClass(n), o != null && (w.width = o), x.isHead)) {
                    if ((w.getTarget().attr("haswidth", "haswidth"), o == null)) {
                      var M = P.length ? P[0].cell.width : void 0;
                      o = M ?? w.width;
                    }
                    ((w.width = o), (w.hasWidth = !0), w.getTarget().css("width", o + "pt"));
                  }
                  (P.length ? x.insertToTargetCellLeft(P[0].cell, w) : x.insertCellToLast(w),
                    f.event.trigger("newCell" + r.id, w));
                } else
                  v.linkType === "row" &&
                    ((v.link.colspan += 1), v.link.getTarget().attr("colspan", v.link.colspan));
              });
            } else {
              var c = h[h.length - 1].indexInTableGridRow;
              u.forEach(function (m, y) {
                var v = m[c],
                  P = m.filter(function (V, T) {
                    return T <= c && V.cell;
                  });
                if (v.rightMost) {
                  var x = a[y],
                    w = x.createTableCell();
                  if ((n && w.getTarget().addClass(n), o != null && (w.width = o), x.isHead)) {
                    if ((w.getTarget().attr("haswidth", "haswidth"), o == null)) {
                      var M = P.length ? P[P.length - 1].cell.width : void 0;
                      o = M ?? w.width;
                    }
                    ((w.width = o), (w.hasWidth = !0), w.getTarget().css("width", o + "pt"));
                  }
                  (P.length
                    ? x.insertToTargetCellRight(P[P.length - 1].cell, w)
                    : x.insertCellToFirst(w),
                    f.event.trigger("newCell" + r.id, w));
                } else
                  (v.linkType === "row" &&
                    ((v.link.colspan += 1), v.link.getTarget().attr("colspan", v.link.colspan)),
                    v.cell &&
                      ((v.cell.colspan += 1), v.cell.getTarget().attr("colspan", v.cell.colspan)));
              });
            }
          }
        }),
        (t.prototype.deleteRow = function () {
          var e = this,
            i = this.tableCellSelector.getSingleSelect();
          if (i) {
            var n = i.rowIndex,
              o = this.getCellGrid(),
              r = this.rows[n];
            (o[n].forEach(function (a, p) {
              if (a.cell)
                if (a.cell.rowspan === 1) r.removeCell(a.cell);
                else {
                  r.removeCell(a.cell);
                  var s = o[n + 1].filter(function (h, d) {
                      return h.cell && d > p;
                    }),
                    l = e.rows[n + 1],
                    u = l.createTableCell(a.cell.rowspan - 1, a.cell.colspan);
                  s.length ? l.insertToTargetCellLeft(s[0].cell, u) : l.insertCellToLast(u);
                }
              else
                a.linkType === "column" &&
                  ((a.link.rowspan -= 1), a.link.getTarget().attr("rowspan", a.link.rowspan));
            }),
              r.getTarget().remove(),
              this.rows.splice(n, 1));
          }
        }),
        (t.prototype.deleteColums = function () {
          var e = this.rows.concat(this.trRows),
            i = this.tableCellSelector.getSingleSelect();
          if (i) {
            var n = i.cell,
              o = i.rowIndex,
              r = this.getCellGrid(e),
              a = r[o].filter(function (p) {
                return (p.cell && p.cell.id === n.id) || (p.link && p.link.id === n.id);
              })[0].indexInTableGridRow;
            r.forEach(function (p, s) {
              var l = p[a];
              l.cell
                ? l.cell.colspan === 1
                  ? e[s].removeCell(l.cell)
                  : ((l.cell.colspan -= 1), l.cell.getTarget().attr("colspan", l.cell.colspan))
                : l.linkType === "row" &&
                  ((l.link.colspan -= 1), l.link.getTarget().attr("colspan", l.link.colspan));
            });
          }
        }),
        (t.prototype.mergeCell = function () {
          var e = this,
            i = this.tableCellSelector.getSelectedCells();
          if (i.length) {
            var n = i[0][0].cell;
            (i.forEach(function (o, r) {
              o.forEach(function (a, p) {
                (r === 0
                  ? p !== 0 &&
                    ((n.colspan += a.cell.colspan), e.rows[a.rowIndex].removeCell(a.cell))
                  : e.rows[a.rowIndex].removeCell(a.cell),
                  p === 0 &&
                    i[0][0].rowIndex + n.rowspan - 1 < a.rowIndex &&
                    (n.rowspan += a.cell.rowspan));
              });
            }),
              n.getTarget().attr("colspan", n.colspan),
              n.getTarget().attr("rowspan", n.rowspan),
              this.tableCellSelector.setSingleSelect(i[0][0]));
          }
        }),
        (t.prototype.splitCell = function () {
          var e = this.tableCellSelector.getSingleSelect();
          if (e) {
            for (
              var i = e.cell,
                n = this.getCellGrid(),
                o = Ze.getIndex(n[e.rowIndex], i.id),
                r = e.rowIndex;
              r < e.rowIndex + i.rowspan;
              r++
            )
              for (
                var a = this.rows[r],
                  p = r === e.rowIndex ? i : Ze.getLeftTableCell(n[r], o),
                  s = 0;
                s < i.colspan;
                s++
              )
                (r === e.rowIndex && s === 0) ||
                  (p
                    ? a.insertToTargetCellRight(p, a.createTableCell())
                    : a.insertCellToFirst(a.createTableCell()));
            ((i.rowspan = 1),
              (i.colspan = 1),
              i.getTarget().attr("colspan", i.colspan),
              i.getTarget().attr("rowspan", i.rowspan));
          }
        }),
        (t.prototype.init = function (e) {
          var i = this;
          ($(this.target).addClass("hitable"),
            (this.optionsCoat.onBeforEdit = function (n) {
              return i.optionsCoat.options.onBeforEdit && e.onBeforEdit(n) === !1
                ? !1
                : (i.optionsCoat.editingCell && i.optionsCoat.editingCell.endEdit(), !0);
            }),
            $(this.target).mousedown(function () {
              i.optionsCoat.isLeftMouseButtonDown = !0;
            }),
            $(this.target).mouseup(function () {
              i.optionsCoat.isLeftMouseButtonDown = !1;
            }),
            this.initContext(),
            this.target
              .on("mousemove", function (n) {
                n.buttons === 1 && i.tableCellSelector.multipleSelectByXY(n.pageX, n.pageY);
              })
              .on("mousedown", function (n) {
                n.buttons === 1 && i.tableCellSelector.singleSelectByXY(n.pageX, n.pageY);
              }));
        }),
        (t.prototype.initRows = function (e) {
          var i = this;
          if (((this.trRows = []), e)) {
            ((this.rows = e),
              e.forEach(function (o, r) {
                o.init(i.optionsCoat, i.target.find("tr:eq(" + r + ")"), !0);
              }));
            var n = this.optionsCoat.options.trs;
            n &&
              this.initRowsByTrs(n).forEach(function (o) {
                i.trRows.push(o);
              });
          } else this.rows = this.initRowsByTrs(this.target.find("tr"));
        }),
        (t.prototype.initRowsByTrs = function (e) {
          var i = this;
          return e
            .map(function (n, o) {
              var r = new R();
              return (r.init(i.optionsCoat, $(o)), r);
            })
            .get();
        }),
        (t.prototype.enableEdit = function () {
          this.optionsCoat.enableEdit();
        }),
        (t.prototype.disableEdit = function () {
          this.optionsCoat.disableEdit();
        }),
        (t.prototype.getCellGrid = function (e) {
          var i = e || this.rows,
            n = this.getColumnStep(),
            o = [];
          return (
            i.forEach(function (r, a) {
              r.columns.forEach(function (p, s) {
                for (var l = 0; l < p.colspan; l++)
                  for (var u = 0, h = !1; u < n && !h;) {
                    if ((o[a] || (o[a] = []), !o[a][u])) {
                      o[a][u] = new _e({
                        cell: l === 0 ? p : void 0,
                        link: l !== 0 ? p : void 0,
                        linkType: l > 0 ? "row" : void 0,
                        rightMost: l === p.colspan - 1 || void 0,
                        bottom: p.rowspan - 1 === 0,
                        rowLevel: l,
                        columnLevel: 0,
                        indexInTableGridRow: u,
                        indexInTableGridColumn: a,
                      });
                      for (var d = a + 1, c = 1; c < p.rowspan; c++)
                        (o[d] || (o[d] = []),
                          (o[d][u] = new _e({
                            cell: void 0,
                            link: p,
                            linkType: l > 0 ? "rowColumn" : "column",
                            rightMost: l === p.colspan - 1 || void 0,
                            bottom: c === p.rowspan - 1,
                            rowLevel: l,
                            columnLevel: c,
                            indexInTableGridRow: u,
                            indexInTableGridColumn: d,
                          })),
                          d++);
                      h = !0;
                    }
                    u++;
                  }
              });
            }),
            o
          );
        }),
        (t.prototype.setAlign = function (e) {
          var i = this.tableCellSelector.getSingleSelect();
          i && i.cell.setAlign(e);
        }),
        (t.prototype.setVAlign = function (e) {
          var i = this.tableCellSelector.getSingleSelect();
          i && i.cell.setVAlign(e);
        }),
        (t.prototype.getColumnStep = function (e) {
          var i = 0;
          return (
            this.rows.length &&
              this.rows[e || 0].columns.forEach(function (n) {
                i += n.colspan;
              }),
            i
          );
        }),
        (t.prototype.initContext = function () {
          var e = this;
          if (!this.optionsCoat.options.isEnableContextMenu) return !1;
          $(this.handle).hicontextMenu({
            menus: [
              {
                text: "在上方插入行",
                enabled: this.optionsCoat.options.isEnableInsertRow,
                disable: function () {
                  return !e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.insertRow("above"),
                    e.resizer.updateRowGrips(),
                    f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "在下方插入行",
                borderBottom: !0,
                enabled: this.optionsCoat.options.isEnableInsertRow,
                disable: function () {
                  return !e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.insertRow("below"),
                    e.resizer.updateRowGrips(),
                    f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "向左方插入列",
                enabled: this.optionsCoat.options.isEnableInsertColumn,
                disable: function () {
                  return !e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.insertColumn("left"),
                    e.resizer.updateColumnGrips(),
                    f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "向右方插入列",
                enabled: this.optionsCoat.options.isEnableInsertColumn,
                borderBottom: !0,
                disable: function () {
                  return !e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.insertColumn("right"),
                    e.resizer.updateColumnGrips(),
                    f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "删除行",
                enabled: this.optionsCoat.options.isEnableDeleteRow,
                disable: function () {
                  return !e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.deleteRow(),
                    e.resizer.updateRowGrips(),
                    f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "删除列",
                borderBottom: !0,
                enabled: this.optionsCoat.options.isEnableDeleteColumn,
                disable: function () {
                  return !e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.deleteColums(),
                    e.resizer.updateColumnGrips(),
                    f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "对齐",
                borderBottom: !0,
                enabled: this.optionsCoat.options.columnAlignEditable,
                menus: [
                  {
                    text: "左",
                    callback: function () {
                      e.setAlign("left");
                    },
                  },
                  {
                    text: "左右居中",
                    callback: function () {
                      e.setAlign("center");
                    },
                  },
                  {
                    text: "右",
                    callback: function () {
                      e.setAlign("right");
                    },
                  },
                  {
                    text: "默认",
                    borderBottom: !0,
                    callback: function () {
                      e.setAlign("");
                    },
                  },
                  {
                    text: "上",
                    callback: function () {
                      e.setVAlign("top");
                    },
                  },
                  {
                    text: "垂直居中",
                    callback: function () {
                      e.setVAlign("middle");
                    },
                  },
                  {
                    text: "下",
                    callback: function () {
                      e.setVAlign("bottom");
                    },
                  },
                  {
                    text: "默认",
                    callback: function () {
                      e.setVAlign("");
                    },
                  },
                ],
              },
              {
                text: "合并单元格",
                enabled: this.optionsCoat.options.isEnableMergeCell,
                disable: function () {
                  return e.tableCellSelector.getSingleSelect();
                },
                callback: function () {
                  (e.mergeCell(), f.event.trigger("updateTable" + e.id));
                },
              },
              {
                text: "解开单元格",
                enabled: this.optionsCoat.options.isEnableMergeCell,
                disable: function () {
                  var i = e.tableCellSelector.getSingleSelect();
                  return !i || (i.cell.rowspan === 1 && i.cell.colspan === 1);
                },
                callback: function () {
                  (e.splitCell(), f.event.trigger("updateTable" + e.id));
                },
              },
            ].filter(function (i) {
              return i.enabled;
            }),
          });
        }),
        (t.prototype.getTableWidth = function () {
          return f.px.toPt(this.target.outerWidth(!1));
        }),
        (t.prototype.updateColumnGrips = function () {
          this.resizer.updateColumnGrips();
        }),
        (t.prototype.updateRowGrips = function () {
          this.resizer.updateRowGrips();
        }),
        t
      );
    })(),
    Ie = C,
    Ne = S,
    oi = function (t) {
      ((this.width = t.width),
        (this.title = t.title),
        (this.columnId = t.columnId),
        (this.fixed = !1),
        (this.rowspan = t.rowspan || 1),
        (this.colspan = t.colspan || 1),
        (this.align = t.align),
        (this.halign = t.halign),
        (this.vAlign = t.vAlign),
        (this.formatter2 = t.formatter2),
        (this.styler2 = t.styler2));
    },
    ri = (function (t) {
      H(e, t);
      function e(i, n) {
        var o = t.call(this, i) || this;
        return (
          (i = i || {}),
          (o.lHeight = i.lHeight),
          (o.autoCompletion = i.autoCompletion),
          (o.tableFooterRepeat = i.tableFooterRepeat),
          n &&
            ((o.columns = []),
            n.editable && i.columns && i.columns.length
              ? i.columns.forEach(function (r) {
                  var a = [];
                  (r.forEach(function (p) {
                    var s = new oi(p),
                      l = n.getColumnByColumnId(s.columnId),
                      u = l ? $.extend(l, s) : new W(s);
                    ((u.checked = !0), a.push(u));
                  }),
                    o.columns.push(new it(a)));
                })
              : n.columns.forEach(function (r) {
                  o.columns.push(
                    new it(
                      r.filter(function (a) {
                        return a.checked;
                      }),
                    ),
                  );
                })),
          o
        );
      }
      return (
        (e.prototype.getColumnByColumnId = function (i) {
          return this.makeColumnObj()[i];
        }),
        (e.prototype.makeColumnObj = function () {
          var i = {};
          return (
            this.columns &&
              this.columns.forEach(function (n) {
                n.columns.forEach(function (o) {
                  o.columnId && (i[o.columnId] = o);
                });
              }),
            i
          );
        }),
        (e.prototype.getGridColumns = function () {
          return this.gridColumns || 1;
        }),
        (e.prototype.getPrintElementOptionEntity = function () {
          var i = t.prototype.getPrintElementOptionEntity.call(this);
          return (
            this.columns &&
              ((i.columns = []),
              this.columns.forEach(function (n) {
                var o = n
                  .getPrintElementOptionEntity()
                  .filter(function (r) {
                    return r.checked;
                  })
                  .map(function (r) {
                    return new oi(r);
                  });
                i.columns.push(o);
              })),
            i
          );
        }),
        e
      );
    })(b),
    ai = (function (t) {
      H(e, t);
      function e(i, n) {
        var o = t.call(this, i) || this;
        return (
          (o.gridColumnsFooterCss = "kuprint-gridColumnsFooter"),
          (o.tableGridRowCss = "table-grid-row"),
          (o.options = new ri(n, o.printElementType)),
          o.options.setDefault(new ri(Ne.instance.table.default).getPrintElementOptionEntity()),
          o
        );
      }
      return (
        (e.prototype.getColumns = function () {
          return this.options.columns;
        }),
        (e.prototype.getColumnByColumnId = function (i) {
          return this.options.getColumnByColumnId(i);
        }),
        (e.prototype.updateDesignViewFromOptions = function () {
          if (this.designTarget) {
            this.css(this.designTarget, this.getData());
            var i = this.designTarget.find(".kuprint-printElement-table-content"),
              n = this.getHtml(this.designPaper);
            (i.html(""),
              i.append(n[0].target.find(".table-grid-row")),
              this.printElementType.editable && this.setHitable(),
              this.setColumnsOptions());
          }
        }),
        (e.prototype.css = function (i, n) {
          if ((this.getField() || !this.options.content) && !this.printElementType.formatter)
            return t.prototype.css.call(this, i, n);
        }),
        (e.prototype.getDesignTarget = function (i) {
          return (
            (this.designTarget = this.getHtml(i)[0].target),
            (this.designPaper = i),
            this.designTarget.find("td").hidroppable({
              accept: ".rn-draggable-item",
              onDrop: function () {},
              onDragEnter: function (n, o) {
                $(o).removeClass("rn-draggable-item");
              },
              onDragLeave: function (n, o) {
                $(o).addClass("rn-draggable-item");
              },
            }),
            this.designTarget
          );
        }),
        (e.prototype.getConfigOptions = function () {
          return Ne.instance.table;
        }),
        (e.prototype.createTarget = function (i, n, o) {
          for (
            var r = $(
                '<div class="kuprint-printElement kuprint-printElement-table" style="position:absolute;"><div class="kuprint-printElement-table-handle"></div><div class="kuprint-printElement-table-content" style="height:100%;width:100%"></div></div>',
              ),
              a = this.createGridColumnsStructure(o),
              p = 0;
            p < a.gridColumns;
            p++
          )
            a.getByIndex(p).append(this.getTableHtml(n, o));
          return (r.find(".kuprint-printElement-table-content").append(a.target), r);
        }),
        (e.prototype.createGridColumnsStructure = function (i) {
          for (
            var n = $('<div class="hi-grid-row table-grid-row"></div>'), o = 0;
            o < this.options.getGridColumns();
            o++
          ) {
            var r = $(
              '<div class="tableGridColumnsGutterRow hi-grid-col" style="width:' +
                100 / this.options.getGridColumns() +
                '%;"></div>',
            );
            n.append(r);
          }
          var a = this.getGridColumnsFooterFormatter();
          if (a) {
            var p = $('<div class="kuprint-gridColumnsFooter"></div>');
            (p.append(a(this.options, this.getData(i), i, [])), n.append(p));
          }
          return new Je(this.options.getGridColumns(), n);
        }),
        (e.prototype.createtempEmptyRowsTargetStructure = function (i) {
          if (this.getField()) return this.createTarget(this.printElementType.title, []);
          var n = this.createTarget(this.printElementType.title, []).clone();
          return (n.find(".kuprint-printElement-tableTarget tbody tr").remove(), n);
        }),
        (e.prototype.getTableHtml = function (i, n) {
          if (!this.getField() && this.options.content) {
            var o = $("<div></div>");
            o.append(this.options.content);
            var r = o.find("table");
            return (r.addClass("kuprint-printElement-tableTarget"), r);
          }
          if (this.printElementType.formatter)
            return (
              (o = $("<div></div>")),
              o.append(this.printElementType.formatter(i)),
              (r = o.find("table")),
              r.addClass("kuprint-printElement-tableTarget"),
              r
            );
          var a = $(
              '<table class="kuprint-printElement-tableTarget" style="border-collapse:collapse;"></table>',
            ),
            p = this.options.getWidth() / this.options.getGridColumns();
          return (
            a.append(E.createTableHead(this.getColumns(), p)),
            a.append(E.createTableRow(this.getColumns(), i, this.options, this.printElementType)),
            this.getFooterFormatter() &&
              (this.options.tableFooterRepeat === "no" ||
                (this.options.tableFooterRepeat === "last"
                  ? a
                      .find("tbody")
                      .append(
                        E.createTableFooter(
                          this.printElementType.columns,
                          i,
                          this.options,
                          this.printElementType,
                          n,
                          i,
                        ).html(),
                      )
                  : a.append(
                      E.createTableFooter(
                        this.printElementType.columns,
                        i,
                        this.options,
                        this.printElementType,
                        n,
                        [],
                      ),
                    ))),
            a
          );
        }),
        (e.prototype.getEmptyRowTarget = function () {
          return E.createEmptyRowTarget(this.getColumns());
        }),
        (e.prototype.getHtml = function (i, n) {
          this.createTempContainer();
          var o = this.getPaperHtmlResult(i, n);
          return (this.removeTempContainer(), o);
        }),
        (e.prototype.getPaperHtmlResult = function (i, n) {
          var o = [],
            r = this.getData(n),
            a = this.getTableHtml(r, n),
            p = this.createtempEmptyRowsTargetStructure(n);
          (n ? this.updateTargetWidth(p) : this.updateTargetSize(p),
            this.css(p, r),
            this.css(a, r),
            this.getTempContainer().html(""),
            this.getTempContainer().append(p));
          for (var s = this.getBeginPrintTopInPaperByReferenceElement(i), l = 0, u = !1, h; !u;) {
            var d = 0,
              c = i.getPaperFooter(l);
            l === 0 &&
              s > c &&
              ((s = s - c + i.paperHeader),
              o.push(new z({ target: void 0, printLine: void 0 })),
              (d = i.getContentHeight(l) - (s - i.paperHeader)),
              l++,
              (c = i.getPaperFooter(l)));
            var m = o.length > 0 ? o[o.length - 1].target : void 0,
              y = this.getRowsInSpecificHeight(
                n,
                d > 0 ? d : l === 0 ? c - s : i.getContentHeight(l),
                p,
                a,
                l,
                m,
              );
            u = y.isEnd;
            var v;
            (y.target &&
              (y.target.css("left", this.options.displayLeft()), (y.target[0].height = "")),
              l === 0 || d > 0
                ? (y.target && ((h = s), y.target.css("top", s + "pt")),
                  (v =
                    u && this.options.lHeight != null
                      ? s + (y.height > this.options.lHeight ? y.height : this.options.lHeight)
                      : s + y.height))
                : (y.target && ((h = i.paperHeader), y.target.css("top", i.paperHeader + "pt")),
                  (v = i.paperHeader + y.height)),
              o.push(
                new z({
                  target: y.target,
                  printLine: v,
                  referenceElement: new G({
                    top: this.options.getTop(),
                    left: this.options.getLeft(),
                    height: this.options.getHeight(),
                    width: this.options.getWidth(),
                    beginPrintPaperIndex: i.index,
                    bottomInLastPaper: v,
                    printTopInPaper: h,
                  }),
                }),
              ),
              l++);
          }
          return o;
        }),
        (e.prototype.getRowsInSpecificHeight = function (i, n, o, r, a, p) {
          var s = r.find("tbody"),
            l = f.pt.toPx(n);
          o.find(".kuprint-printElement-tableTarget tbody").html("");
          var u = o.outerHeight();
          if (u > l) return { target: void 0, length: 0, height: 0, isEnd: !1 };
          for (var h = [], d = 0; d < this.options.getGridColumns(); d++)
            for (var c = o.find(".kuprint-printElement-tableTarget:eq(" + d + ")"), m, y = []; ;) {
              if (u <= l)
                if (s.find("tr").length === 0)
                  ((m = { height: f.px.toPt(u), isEnd: !0 }),
                    i &&
                      this.options.autoCompletion &&
                      (this.autoCompletion(l, c), (u = o.outerHeight())));
                else {
                  var v = s.find("tr:lt(1)");
                  c.find("tbody").append(v);
                  var P = v.data("rowData");
                  (h.push(P),
                    y.push(P),
                    (u = o.outerHeight()),
                    u > l &&
                      (s.prepend(v),
                      h.pop(),
                      y.pop(),
                      (u = o.outerHeight()),
                      (m = { height: f.px.toPt(u), isEnd: !1 })));
                }
              if (m) {
                this.getFooterFormatter() &&
                  c.find("tfoot").length &&
                  c
                    .find("tfoot")
                    .html(
                      E.createTableFooter(
                        this.printElementType.columns,
                        this.getData(i),
                        this.options,
                        this.printElementType,
                        i,
                        y,
                      ).html(),
                    );
                break;
              }
            }
          var x = o.find(".kuprint-printElement-tableTarget tbody tr").length,
            w = this.getGridColumnsFooterFormatter();
          return (
            w && o.find(this.gridColumnsFooterCss).html(w(this.options, this.getData(i), i, h)),
            s.find("tr").length === 0
              ? x === 0 && p
                ? { target: void 0, length: 0, height: 0, isEnd: !0 }
                : { target: o.clone(), length: x, height: f.px.toPt(u), isEnd: !0 }
              : { target: o.clone(), length: x, height: f.px.toPt(u), isEnd: !1 }
          );
        }),
        (e.prototype.autoCompletion = function (i, n) {
          for (var o = this.getEmptyRowTarget(), r = n.outerHeight(), a; i > r;)
            ((a = o.clone()), n.find("tbody").append(a), (r = n.outerHeight()));
          a && a.remove();
        }),
        (e.prototype.getData = function (i) {
          if (!i) return [{}];
          var n = i[this.getField()];
          return n ? JSON.parse(JSON.stringify(n)) : [];
        }),
        (e.prototype.onResize = function (i, n, o, r, a) {
          (t.prototype.updateSizeAndPositionOptions.call(this, a, r, o, n),
            E.resizeTableCellWidth(this.designTarget, this.getColumns(), this.options.getWidth()));
        }),
        (e.prototype.getReizeableShowPoints = function () {
          return ["s", "e"];
        }),
        (e.prototype.design = function (i, n) {
          var o = this;
          ($.removeData(this.designTarget[0], "hidraggable"),
            this.designTarget.hidraggable({
              handle: this.designTarget.find(".kuprint-printElement-table-handle"),
              axis: o.options.axis && i && i.axisEnabled ? o.options.axis : void 0,
              onDrag: function (r, a, p) {
                (o.updateSizeAndPositionOptions(a, p), o.createLineOfPosition(n));
              },
              moveUnit: "pt",
              minMove: Ne.instance.movingDistance,
              onBeforeDrag: function () {
                ((Ie.instance.draging = !0), o.createLineOfPosition(n));
              },
              onStopDrag: function () {
                ((Ie.instance.draging = !1), o.removeLineOfPosition());
              },
            }),
            this.printElementType.editable && this.setHitable(),
            this.setColumnsOptions(),
            this.designTarget.hireizeable({
              showPoints: o.getReizeableShowPoints(),
              noContainer: !0,
              onBeforeResize: function () {
                Ie.instance.draging = !0;
              },
              onResize: function (r, a, p, s, l) {
                (o.onResize(r, a, p, s, l),
                  o.hitable && o.hitable.updateColumnGrips(),
                  o.createLineOfPosition(n));
              },
              onStopResize: function () {
                ((Ie.instance.draging = !1), o.removeLineOfPosition());
              },
            }),
            this.bingKeyboardMoveEvent(this.designTarget, n));
        }),
        (e.prototype.setHitable = function () {
          var i = this;
          ((this.hitable = new ni({
            table: this.designTarget.find(".kuprint-printElement-tableTarget:eq(0)"),
            rows: this.getColumns(),
            resizeRow: !1,
            resizeColumn: !0,
            trs: this.designTarget.find(".kuprint-printElement-tableTarget:eq(0) tbody tr"),
            handle: this.designTarget.find(".kuprint-printElement-tableTarget:eq(0) thead"),
            isEnableEdit: this.printElementType.editable,
            columnDisplayEditable: this.printElementType.columnDisplayEditable,
            columnDisplayIndexEditable: this.printElementType.columnDisplayIndexEditable,
            columnResizable: this.printElementType.columnResizable,
            columnAlignEditable: this.printElementType.columnAlignEditable,
            isEnableEditText: this.printElementType.columnTitleEditable,
            isEnableEditField: !1,
            isEnableContextMenu: !0,
            isEnableInsertRow: !1,
            isEnableDeleteRow: !1,
            isEnableInsertColumn: !1,
            isEnableDeleteColumn: !1,
            isEnableMergeCell: !1,
          })),
            f.event.on("updateTable" + this.hitable.id, function () {
              i.updateDesignViewFromOptions();
            }));
        }),
        (e.prototype.setColumnsOptions = function () {
          var i = this;
          this.designTarget
            .find(".kuprint-printElement-tableTarget:eq(0) thead td")
            .bind("click.kuprint", function (n) {
              var o = $(n.target).attr("column-id"),
                r = i.getColumnByColumnId(o);
              if (r) {
                var a = i.getPrintElementOptionItemsByName("tableColumn");
                f.event.trigger(i.getPrintElementSelectEventKey(), {
                  printElement: i,
                  customOptionsInput: [
                    {
                      title: r.title + "-列属性",
                      optionItems: a,
                      options: r,
                      callback: function () {
                        a.forEach(function (p) {
                          r[p.name] = p.getValue();
                        });
                      },
                    },
                  ],
                });
              } else f.event.trigger(i.getPrintElementSelectEventKey(), { printElement: i });
            });
        }),
        (e.prototype.filterOptionItems = function (i) {
          var n = t.prototype.filterOptionItems.call(this, i);
          return this.printElementType.editable && this.options.columns.length === 1
            ? n
            : i.filter(function (o) {
                return o.name !== "columns";
              });
        }),
        (e.prototype.getFooterFormatter = function () {
          var i;
          if (
            (this.printElementType.footerFormatter && (i = this.printElementType.footerFormatter),
            this.options.footerFormatter)
          )
            try {
              i = new Function("return (" + this.options.footerFormatter + ")")();
            } catch (n) {
              console.log(n);
            }
          return i;
        }),
        (e.prototype.getGridColumnsFooterFormatter = function () {
          var i;
          if (
            (this.printElementType.gridColumnsFooterFormatter &&
              (i = this.printElementType.gridColumnsFooterFormatter),
            this.options.gridColumnsFooterFormatter)
          )
            try {
              i = new Function("return (" + this.options.gridColumnsFooterFormatter + ")")();
            } catch (n) {
              console.log(n);
            }
          return i;
        }),
        e
      );
    })(g),
    Ae = b;
  function Y(t) {
    var e = Ae.call(this, t) || this;
    return (e.title && (e.title = qe.replaceEnterAndNewlineAndTab(e.title, "")), e);
  }
  (H(Y, b),
    (Y.prototype.getHideTitle = function () {
      return this.hideTitle == null ? this.defaultOptions.hideTitle : this.hideTitle;
    }),
    (Y.prototype.getTextType = function () {
      return (this.textType == null ? this.defaultOptions.textType : this.textType) || "text";
    }),
    (Y.prototype.getFontSize = function () {
      return (this.fontSize == null ? this.defaultOptions.fontSize : this.fontSize) || 9;
    }),
    (Y.prototype.getBarcodeMode = function () {
      return (
        (this.barcodeMode == null ? this.defaultOptions.barcodeMode : this.barcodeMode) || "CODE128"
      );
    }));
  function Se(t) {
    var e = Ae.call(this, t) || this;
    return ((e.leftSpaceRemoved = t.leftSpaceRemoved), e);
  }
  (H(Se, b),
    (Se.prototype.getHideTitle = function () {
      return this.hideTitle == null ? this.defaultOptions.hideTitle : this.hideTitle;
    }));
  function We(t) {
    return Ae.call(this, t) || this;
  }
  H(We, b);
  var Fi = b;
  function Fe(t) {
    var e = Fi.call(this, t) || this;
    return (
      (t = t || {}),
      t.columns
        ? ((e.columns = []),
          t.columns.forEach(function (i) {
            e.columns.push(new it(i));
          }))
        : (e.columns = [new it({ columns: [new W({ width: 100 }), new W({ width: 100 })] })]),
      (e.lHeight = t.lHeight),
      (e.autoCompletion = t.autoCompletion),
      (e.tableFooterRepeat = t.tableFooterRepeat),
      e
    );
  }
  (H(Fe, b),
    (Fe.prototype.getPrintElementOptionEntity = function () {
      var t = b.prototype.getPrintElementOptionEntity.call(this);
      return (
        (t.columns = []),
        this.columns.forEach(function (e) {
          t.columns.push(e.getPrintElementOptionEntity());
        }),
        t
      );
    }));
  var Ri = g,
    si = S;
  function L(t, e) {
    var i = Ri.call(this, t) || this;
    return (
      (i.options = new Y(e)),
      i.options.setDefault(new Y(si.instance.text.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(L, g),
    (L.prototype.getDesignTarget = function (t) {
      return g.prototype.getDesignTarget.call(this, t);
    }),
    (L.prototype.getProxyTarget = function (t) {
      t && this.SetProxyTargetOption(t);
      var e = this.getData(),
        i = this.createTarget(this.printElementType.getText(!0), e);
      return (this.updateTargetSize(i), this.css(i, e), i);
    }),
    (L.prototype.updateDesignViewFromOptions = function () {
      if (this.designTarget) {
        var t = this.getData();
        (this.css(this.designTarget, t),
          this.updateTargetText(this.designTarget, this.getTitle(), t));
      }
    }),
    (L.prototype.getConfigOptions = function () {
      return si.instance.text;
    }),
    (L.prototype.getTitle = function () {
      var t = this.options.title || this.printElementType.title || "";
      return (t && (t = qe.replaceEnterAndNewlineAndTab(t, "")), t);
    }),
    (L.prototype.getData = function (t) {
      var e = t
        ? t[this.getField()] || ""
        : this.options.testData || this.printElementType.getData() || "";
      if (this.options.format) {
        if (this.options.dataType === "datetime") return f.dateFormat(e, this.options.format);
        if (this.options.dataType === "boolean") {
          var i = this.options.format.split(":");
          if (i.length > 0) return e === !0 || e === "true" ? i[0] : i[1];
        }
      }
      return e;
    }),
    (L.prototype.updateTargetText = function (t, e, i, n) {
      var o = this.getFormatter(),
        r = t.find(".kuprint-printElement-text-content"),
        a = "";
      this.getField()
        ? (a =
            (this.options.getHideTitle() ? "" : e ? e + "：" : "") +
            (o ? o(e, i, this.options, this._currenttemplateData, t) : i))
        : (a = o ? o(e, e, this.options, this._currenttemplateData, t) : e);
      var p = this.options.getTextType();
      if (p === "text") r.html(a);
      else if (p === "barcode") {
        var s = i || a;
        r.html(
          '<svg width="100%" display="block" height="100%" class="hibarcode_imgcode" preserveAspectRatio="none slice"></svg><div class="hibarcode_displayValue"></div>',
        );
        try {
          s
            ? (window.JsBarcode(r.find(".hibarcode_imgcode")[0], s, {
                format: this.options.getBarcodeMode(),
                width: 1,
                textMargin: -1,
                lineColor: this.options.color || "#000000",
                margin: 0,
                height: parseInt(f.pt.toPx(this.options.getHeight() || 10).toString()),
                displayValue: !1,
              }),
              r.find(".hibarcode_imgcode").attr("height", "100%").attr("width", "100%"),
              this.options.hideTitle || r.find(".hibarcode_displayValue").html(s))
            : r.html("");
        } catch (d) {
          (console.log(d), r.html("此格式不支持该文本"));
        }
      } else if (p === "qrcode") {
        var l = i || a;
        r.html("");
        try {
          if (l) {
            var u = parseInt(f.pt.toPx(this.options.getWidth() || 20)),
              h = parseInt(f.pt.toPx(this.options.getHeight() || 20));
            new window.QRCode(r[0], {
              width: u,
              height: h,
              colorDark: this.options.color || "#000000",
              useSVG: !0,
            }).makeCode(l);
          }
        } catch (d) {
          (console.log(d), r.html("二维码生成失败"));
        }
      }
    }),
    (L.prototype.onResize = function (t, e, i, n, o) {
      (g.prototype.onResize.call(this, t, e, i, n, o),
        (this.options.getTextType() === "barcode" || this.options.getTextType() === "qrcode") &&
          this.updateTargetText(this.designTarget, this.getTitle(), this.getData()));
    }),
    (L.prototype.createTarget = function (t, e, i) {
      var n = $(
        '<div tabindex="1" class="kuprint-printElement kuprint-printElement-text" style="position:absolute;"><div class="kuprint-printElement-text-content kuprint-printElement-content" style="height:100%;width:100%"></div></div>',
      );
      return (this.updateTargetText(n, t, e, i), n);
    }),
    (L.prototype.getHtml = function (t, e, i) {
      return this.getHtml2(t, e, i);
    }));
  var Di = g,
    pi = S;
  function N(t, e) {
    var i = Di.call(this, t) || this;
    return (
      (i.options = new b(e)),
      i.options.setDefault(new b(pi.instance.image.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(N, g),
    (N.prototype.getReizeableShowPoints = function () {
      return ["se"];
    }),
    (N.prototype.getData = function (t) {
      var e = "";
      t
        ? (e = this.getField()
            ? t[this.getField()] || ""
            : this.options.src || this.printElementType.getData())
        : (e = this.options.src || this.printElementType.getData());
      var i = this.getFormatter();
      return (i && (e = i(e, this.options, this._currenttemplateData)), e || "");
    }),
    (N.prototype.createTarget = function (t, e) {
      var i = $(
        '<div class="kuprint-printElement kuprint-printElement-image" style="position:absolute;"><div class="kuprint-printElement-image-content" style="height:100%;width:100%"></div></div>',
      );
      return (this.updateTargetImage(i, t, e), i);
    }),
    (N.prototype.initSizeByHtml = function (t) {
      (g.prototype.initSizeByHtml.call(this, t), this.css(t, this.getData()));
    }),
    (N.prototype.getConfigOptions = function () {
      return pi.instance.image;
    }),
    (N.prototype.updateDesignViewFromOptions = function () {
      this.designTarget &&
        (this.css(this.designTarget, this.getData()),
        this.updateTargetImage(this.designTarget, this.getTitle(), this.getData()));
    }),
    (N.prototype.updateTargetImage = function (t, e, i) {
      var n = t.find(".kuprint-printElement-image-content");
      n.find("img").length
        ? n.find("img").attr("src", i)
        : n.html('<img style="width:100%;height:100%;" src="' + i + '">');
    }),
    (N.prototype.getHtml = function (t, e, i) {
      return this.getHtml2(t, e, i);
    }));
  var Ge = function (t) {
      ((this.field = t.field),
        (this.title = t.title),
        (this.type = t.type),
        (this.columns = t.columns));
    },
    li = (function () {
      function t(e) {
        var i = this;
        ((this.text = e.text),
          (this.field = e.field),
          (this.fields = e.fields),
          (this.title = e.title),
          (this.tid = e.tid),
          (this.data = e.data),
          (this.styler = e.styler),
          (this.formatter = e.formatter),
          (this.type = e.type),
          (this.options = e.options),
          (this.editable = e.editable),
          (this.columnDisplayEditable = e.columnDisplayEditable),
          (this.columnDisplayIndexEditable = e.columnDisplayIndexEditable),
          (this.columnTitleEditable = e.columnTitleEditable),
          (this.columnResizable = e.columnResizable),
          (this.columnAlignEditable = e.columnAlignEditable),
          (this.columns = []),
          (e.columns || []).forEach(function (n) {
            i.columns.push(i.createTableColumnArray(n));
          }),
          (this.rowStyler = e.rowStyler),
          (this.striped = e.striped),
          (this.groupFields = e.groupFields || []),
          (this.groupFormatter = e.groupFormatter),
          (this.groupFooterFormatter = e.groupFooterFormatter),
          (this.footerFormatter = e.footerFormatter),
          (this.gridColumnsFooterFormatter = e.gridColumnsFooterFormatter),
          (this.columnObj = this.makeColumnObj()));
      }
      return (
        (t.prototype.getText = function () {
          return this.text || this.title || "";
        }),
        (t.prototype.createPrintElement = function (e) {
          var i = this;
          return (
            this.columns &&
              this.columns.length === 0 &&
              (e.columns || []).forEach(function (n) {
                i.columns.push(i.createTableColumnArray(n));
              }),
            new ai(this, e)
          );
        }),
        (t.prototype.getData = function () {
          return [{}];
        }),
        (t.prototype.createTableColumnArray = function (e) {
          var i = [];
          return (
            e.forEach(function (n) {
              i.push(new W(n));
            }),
            i
          );
        }),
        (t.prototype.getPrintElementTypeEntity = function () {
          return new Ge({ title: this.title, type: this.type });
        }),
        (t.prototype.getFields = function () {
          return this.fields;
        }),
        (t.prototype.getOptions = function () {
          return this.options || {};
        }),
        (t.prototype.getColumnByColumnId = function (e) {
          return this.columnObj[e];
        }),
        (t.prototype.makeColumnObj = function () {
          var e = {};
          return (
            this.columns &&
              this.columns.forEach(function (i) {
                i.forEach(function (n) {
                  n.columnId && (e[n.columnId] = n);
                });
              }),
            e
          );
        }),
        t
      );
    })(),
    Bi = g,
    ui = S;
  function q(t, e) {
    var i = Bi.call(this, t) || this;
    return (
      (i.options = new We(e)),
      i.options.setDefault(new We(ui.instance.html.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(q, g),
    (q.prototype.updateDesignViewFromOptions = function () {
      this.designTarget && (this.css(this.designTarget, this.getData()), this.updateTargetHtml());
    }),
    (q.prototype.updateTargetHtml = function () {
      var t = this.getFormatter();
      if (t) {
        var e = t(this.getData(), this.options, this._currenttemplateData);
        this.designTarget.find(".kuprint-printElement-html-content").html(e);
      }
    }),
    (q.prototype.getConfigOptions = function () {
      return ui.instance.html;
    }),
    (q.prototype.createTarget = function (t, e) {
      var i = $(
          '<div class="kuprint-printElement kuprint-printElement-html" style="position:absolute;"><div class="kuprint-printElement-html-content" style="height:100%;width:100%"></div></div>',
        ),
        n = this.getFormatter();
      return (
        n
          ? i
              .find(".kuprint-printElement-html-content")
              .append(n(this.getData(), this.options, this._currenttemplateData))
          : this.options.content &&
            i.find(".kuprint-printElement-html-content").append(this.options.content),
        i
      );
    }),
    (q.prototype.getHtml = function (t, e, i) {
      return this.getHtml2(t, e, i);
    }));
  var Re = g,
    j = S;
  function U(t, e) {
    var i = Re.call(this, t) || this;
    return (
      (i.options = new b(e)),
      i.options.setDefault(new b(j.instance.vline.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(U, g),
    (U.prototype.updateDesignViewFromOptions = function () {
      this.designTarget && this.css(this.designTarget, this.getData());
    }),
    (U.prototype.getConfigOptions = function () {
      return j.instance.hline;
    }),
    (U.prototype.createTarget = function () {
      return $(
        '<div class="kuprint-printElement kuprint-printElement-vline" style="border-left:1px solid;position:absolute;"></div>',
      );
    }),
    (U.prototype.getReizeableShowPoints = function () {
      return ["s"];
    }),
    (U.prototype.getHtml = function (t, e, i) {
      return this.getHtml2(t, e, i);
    }));
  function Lt(t, e) {
    var i = Re.call(this, t) || this;
    return (
      (i.options = new b(e)),
      i.options.setDefault(new b(j.instance.hline.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(Lt, g),
    (Lt.prototype.updateDesignViewFromOptions = function () {
      this.designTarget && this.css(this.designTarget, this.getData());
    }),
    (Lt.prototype.getConfigOptions = function () {
      return j.instance.hline;
    }),
    (Lt.prototype.createTarget = function () {
      return $(
        '<div class="kuprint-printElement kuprint-printElement-hline" style="border-top:1px solid;position:absolute;"></div>',
      );
    }),
    (Lt.prototype.getReizeableShowPoints = function () {
      return ["e"];
    }));
  function Vt(t, e) {
    var i = Re.call(this, t) || this;
    return (
      (i.options = new b(e)),
      i.options.setDefault(new b(j.instance.rect.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(Vt, g),
    (Vt.prototype.updateDesignViewFromOptions = function () {
      this.designTarget && this.css(this.designTarget, this.getData());
    }),
    (Vt.prototype.getConfigOptions = function () {
      return j.instance.hline;
    }),
    (Vt.prototype.createTarget = function () {
      return $(
        '<div class="kuprint-printElement kuprint-printElement-rect" style="border:1px solid;position:absolute;"></div>',
      );
    }),
    (Vt.prototype.getHtml = function (t, e, i) {
      return this.getHtml2(t, e, i);
    }));
  function Nt(t, e) {
    var i = Re.call(this, t) || this;
    return (
      (i.options = new b(e)),
      i.options.setDefault(new b(j.instance.oval.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(Nt, g),
    (Nt.prototype.updateDesignViewFromOptions = function () {
      this.designTarget && this.css(this.designTarget, this.getData());
    }),
    (Nt.prototype.getConfigOptions = function () {
      return j.instance.hline;
    }),
    (Nt.prototype.createTarget = function () {
      return $(
        '<div class="kuprint-printElement kuprint-printElement-oval" style="border:1px solid;position:absolute;border-radius:50%;"></div>',
      );
    }),
    (Nt.prototype.getHtml = function (t, e, i) {
      return this.getHtml2(t, e, i);
    }));
  var De = C,
    je = S,
    Mi = (function (t) {
      H(e, t);
      function e(i, n) {
        var o = t.call(this, i) || this;
        return (
          (o.options = new Fe(n)),
          o.options.setDefault(
            new Fe(je.instance.tableCustom.default).getPrintElementOptionEntity(),
          ),
          (o.columns = o.options.columns),
          o
        );
      }
      return (
        (e.prototype.updateDesignViewFromOptions = function () {
          if (this.designTarget) {
            this.css(this.designTarget, this.getData());
            var i = this.designTarget.find(".kuprint-printElement-table-content"),
              n = this.getHtml(this.designPaper);
            (i.html(""),
              i.append(n[0].target.find(".kuprint-printElement-tableTarget")),
              this.setHiResizeable());
          }
        }),
        (e.prototype.getDesignTarget = function (i) {
          var n = this;
          return (
            (this.designTarget = this.getHtml(i)[0].target),
            (this.designPaper = i),
            this.designTarget.click(function () {
              f.event.trigger(n.getPrintElementSelectEventKey(), { printElement: n });
            }),
            this.designTarget.find("td").hidroppable({
              accept: ".rn-draggable-item",
              onDrop: function () {},
              onDragEnter: function (o, r) {
                $(r).removeClass("rn-draggable-item");
              },
              onDragLeave: function (o, r) {
                $(r).addClass("rn-draggable-item");
              },
            }),
            this.designTarget
          );
        }),
        (e.prototype.getConfigOptions = function () {
          return je.instance.tableCustom;
        }),
        (e.prototype.createTarget = function (i, n, o) {
          var r = $(
            '<div class="kuprint-printElement kuprint-printElement-table" style="position:absolute;"><div class="kuprint-printElement-table-handle"></div><div class="kuprint-printElement-table-content" style="height:100%;width:100%"></div></div>',
          );
          return (r.find(".kuprint-printElement-table-content").append(this.getTableHtml(n, o)), r);
        }),
        (e.prototype.getTableHtml = function (i, n) {
          var o = $(
            '<table class="kuprint-printElement-tableTarget" style="border-collapse:collapse;width:100%;"></table>',
          );
          return (
            o.append(E.createTableHead(this.columns, this.options.getWidth())),
            o.append(E.createTableRow(this.columns, i, this.options, this.printElementType)),
            this.printElementType.footerFormatter &&
              (this.options.tableFooterRepeat === "no" ||
                (this.options.tableFooterRepeat === "last"
                  ? o
                      .find("tbody")
                      .append(
                        E.createTableFooter(
                          this.printElementType.columns,
                          i,
                          this.options,
                          this.printElementType,
                          n,
                          i,
                        ).html(),
                      )
                  : o.append(
                      E.createTableFooter(
                        this.printElementType.columns,
                        i,
                        this.options,
                        this.printElementType,
                        n,
                        [],
                      ),
                    ))),
            o
          );
        }),
        (e.prototype.getHtml = function (i, n) {
          (this.setCurrenttemplateData(n), this.createTempContainer());
          var o = this.getPaperHtmlResult(i, n);
          return (this.removeTempContainer(), o);
        }),
        (e.prototype.getPaperHtmlResult = function (i, n) {
          var o = [],
            r = this.getData(n),
            a = this.getTableHtml(r, n),
            p = this.createTarget(this.printElementType.title, [], n);
          (n ? this.updateTargetWidth(p) : this.updateTargetSize(p),
            this.css(p, r),
            this.css(a, r),
            this.getTempContainer().html(""),
            this.getTempContainer().append(p));
          for (var s = this.getBeginPrintTopInPaperByReferenceElement(i), l = 0, u = !1, h; !u;) {
            var d = 0,
              c = i.getPaperFooter(l);
            l === 0 &&
              s > c &&
              ((s = s - c + i.paperHeader),
              o.push(new z({ target: void 0, printLine: void 0 })),
              l++,
              (d = i.getContentHeight(l) - (s - i.paperHeader)),
              (c = i.getPaperFooter(l)));
            var m = o.length > 0 ? o[o.length - 1].target : void 0,
              y = d > 0 ? d : l === 0 ? c - s : i.getContentHeight(l),
              v = this.getRowsInSpecificHeight(y, p, a, l, m, n);
            u = v.isEnd;
            var P;
            (v.target &&
              (v.target.css("left", this.options.displayLeft()), (v.target[0].height = "")),
              l === 0 || d > 0
                ? (v.target && ((h = s), v.target.css("top", s + "pt")),
                  (P =
                    u && this.options.lHeight != null
                      ? s + (v.height > this.options.lHeight ? v.height : this.options.lHeight)
                      : s + v.height))
                : (v.target && ((h = i.paperHeader), v.target.css("top", i.paperHeader + "pt")),
                  (P = i.paperHeader + v.height)),
              o.push(
                new z({
                  target: v.target,
                  printLine: P,
                  referenceElement: new G({
                    top: this.options.getTop(),
                    left: this.options.getLeft(),
                    height: this.options.getHeight(),
                    width: this.options.getWidth(),
                    beginPrintPaperIndex: i.index,
                    bottomInLastPaper: P,
                    printTopInPaper: h,
                  }),
                }),
              ),
              l++);
          }
          return o;
        }),
        (e.prototype.getRowsInSpecificHeight = function (i, n, o, r, a, p) {
          var s = o.find("tbody"),
            l = f.pt.toPx(i);
          n.find("tbody").html("");
          for (var u = n.outerHeight(), h = [], d; ;) {
            if (u <= l)
              if (s.find("tr").length === 0)
                (a &&
                  this.options.autoCompletion &&
                  (this.autoCompletion(l, n), (u = n.outerHeight())),
                  (d = {
                    target: n.clone(),
                    length: n.find("tbody tr").length,
                    height: f.px.toPt(u),
                    isEnd: !0,
                  }),
                  n.find("tbody tr").length === 0 &&
                    a &&
                    (d = { target: void 0, length: 0, height: 0, isEnd: !0 }));
              else {
                var c = s.find("tr:lt(1)");
                (n.find("tbody").append(c), (u = n.outerHeight()));
                var m = c.data("rowData");
                (h.push(m),
                  u > l &&
                    (s.prepend(c),
                    h.pop(),
                    (u = n.outerHeight()),
                    (d = {
                      target: n.clone(),
                      length: n.find("tbody tr").length,
                      height: f.px.toPt(u),
                      isEnd: !1,
                    })));
              }
            else d = { target: void 0, length: 0, height: 0, isEnd: !1 };
            if (d) {
              this.printElementType.footerFormatter &&
                n.find("tfoot") &&
                d.target &&
                d.target
                  .find("tfoot")
                  .html(
                    E.createTableFooter(
                      this.printElementType.columns,
                      this.getData(p),
                      this.options,
                      this.printElementType,
                      p,
                      h,
                    ).html(),
                  );
              break;
            }
          }
          return d;
        }),
        (e.prototype.getData = function (i) {
          if (!i) return [{}];
          var n = i[this.getField()];
          return n ? JSON.parse(JSON.stringify(n)) : [];
        }),
        (e.prototype.autoCompletion = function (i, n) {
          for (var o = this.getEmptyRowTarget(), r = n.outerHeight(), a; i > r;)
            ((a = o.clone()), n.find("tbody").append(a), (r = n.outerHeight()));
          a && a.remove();
        }),
        (e.prototype.getEmptyRowTarget = function () {
          return E.createEmptyRowTarget(this.columns);
        }),
        (e.prototype.onResize = function (i, n, o, r, a) {
          (t.prototype.updateSizeAndPositionOptions.call(this, a, r, o, n),
            E.resizeTableCellWidth(this.designTarget, this.columns, this.options.getWidth()));
        }),
        (e.prototype.getReizeableShowPoints = function () {
          return ["s", "e"];
        }),
        (e.prototype.design = function (i, n) {
          var o = this;
          ($.removeData(this.designTarget[0], "hidraggable"),
            this.designTarget.hidraggable({
              handle: this.designTarget.find(".kuprint-printElement-table-handle"),
              axis: o.options.axis && i && i.axisEnabled ? o.options.axis : void 0,
              onDrag: function (r, a, p) {
                (o.updateSizeAndPositionOptions(a, p), o.createLineOfPosition(n));
              },
              moveUnit: "pt",
              minMove: je.instance.movingDistance,
              onBeforeDrag: function () {
                ((De.instance.draging = !0), o.createLineOfPosition(n));
              },
              onStopDrag: function () {
                ((De.instance.draging = !1), o.removeLineOfPosition());
              },
            }),
            this.setHiResizeable(),
            this.designTarget.hireizeable({
              showPoints: o.getReizeableShowPoints(),
              noContainer: !0,
              onBeforeResize: function () {
                De.instance.draging = !0;
              },
              onResize: function (r, a, p, s, l) {
                (o.onResize(r, a, p, s, l),
                  o.hitable.updateColumnGrips(),
                  o.createLineOfPosition(n));
              },
              onStopResize: function () {
                ((De.instance.draging = !1), o.removeLineOfPosition());
              },
            }),
            this.bingKeyboardMoveEvent(this.designTarget, n));
        }),
        (e.prototype.setHiResizeable = function () {
          var i = this;
          ((this.hitable = new ni({
            table: this.designTarget.find("table"),
            rows: this.columns,
            resizeRow: !1,
            resizeColumn: !0,
            trs: $(this.designTarget).find("tbody tr"),
            handle: this.designTarget.find("table"),
            columnDisplayEditable: !0,
            columnDisplayIndexEditable: !0,
            columnResizable: !0,
            columnAlignEditable: !0,
            isEnableEdit: !0,
            isEnableEditText: !0,
            isEnableEditField: !0,
            isEnableContextMenu: !0,
            isEnableInsertRow: !0,
            isEnableDeleteRow: !0,
            isEnableInsertColumn: !0,
            isEnableDeleteColumn: !0,
            isEnableMergeCell: !0,
          })),
            f.event.on("updateTable" + this.hitable.id, function () {
              i.updateDesignViewFromOptions();
            }));
        }),
        e
      );
    })(g),
    At = C,
    di = {
      createPrintElement: function (t, e) {
        switch (t.type) {
          case "text":
            return new L(t, e);
          case "image":
            return new N(t, e);
          case "longText":
            return new F(t, e);
          case "table":
            return new ai(t, e);
          case "html":
            return new q(t, e);
          case "vline":
            return new U(t, e);
          case "hline":
            return new Lt(t, e);
          case "rect":
            return new Vt(t, e);
          case "oval":
            return new Nt(t, e);
          default:
            return;
        }
      },
    },
    hi = (function () {
      function t(e) {
        ((this.field = e.field),
          (this.fields = e.fields),
          (this.title = e.title),
          (this.text = e.text),
          (this.tid = e.tid),
          (this.data = e.data),
          (this.styler = e.styler),
          (this.formatter = e.formatter),
          (this.type = e.type),
          (this.onRendered = e.onRendered),
          (this.options = e.options));
      }
      return (
        (t.prototype.getText = function (e) {
          return e ? this.title || this.text || "" : this.text || this.title || "";
        }),
        (t.prototype.getData = function () {
          return this.data;
        }),
        (t.prototype.createPrintElement = function (e) {
          var i = {};
          return ($.extend(i, e || {}), di.createPrintElement(this, i));
        }),
        (t.prototype.getPrintElementTypeEntity = function () {
          return new Ge({ title: this.title, type: this.type });
        }),
        (t.prototype.getFields = function () {
          return this.fields;
        }),
        (t.prototype.getOptions = function () {
          return this.options || {};
        }),
        t
      );
    })(),
    zi = (function (t) {
      H(e, t);
      function e(i) {
        return t.call(this, i) || this;
      }
      return (
        (e.prototype.createPrintElement = function (i) {
          return new Mi(this, i);
        }),
        e
      );
    })(li),
    Li = (function (t) {
      H(e, t);
      function e(i) {
        return t.call(this, i) || this;
      }
      return (
        (e.prototype.createPrintElement = function (i) {
          var n = {};
          return ($.extend(n, i || {}), di.createPrintElement(this, n));
        }),
        (e.prototype.getPrintElementTypeEntity = function () {
          return new Ge({ title: this.title, type: this.type });
        }),
        e
      );
    })(hi),
    Be = {
      createPrintElementType: function (t) {
        return (
          (t.type = t.type || "text"),
          t.type === "text"
            ? new Li(t)
            : t.type === "table"
              ? new li(t)
              : t.type === "tableCustom"
                ? new zi(t)
                : new hi(t)
        );
      },
    },
    He = (function () {
      function t() {
        this.allElementTypes = [];
      }
      return (
        Object.defineProperty(t, "instance", {
          get: function () {
            return (t._instance || (t._instance = new t()), t._instance);
          },
          enumerable: !0,
          configurable: !0,
        }),
        (t.prototype.addPrintElementTypes = function (e, i) {
          var n = this;
          (this[e] ? (this[e] = this[e].concat(i)) : (this[e] = i),
            i.forEach(function (o) {
              n.allElementTypes = n.allElementTypes.concat(o.printElementTypes);
            }));
        }),
        (t.prototype.getElementTypeGroups = function (e) {
          return this[this.formatterModule(e)] || [];
        }),
        (t.prototype.getElementType = function (e) {
          var i = this.allElementTypes.filter(function (n) {
            return n.tid === e;
          });
          return i.length > 0 ? i[0] : void 0;
        }),
        (t.prototype.formatterModule = function (e) {
          return e || "_default";
        }),
        t
      );
    })(),
    Vi = function (t, e) {
      var i = this;
      ((this.name = t),
        (this.printElementTypes = []),
        e.forEach(function (n) {
          i.printElementTypes.push(Be.createPrintElementType(n));
        }));
    };
  function B() {}
  ((B.getElementTypeGroups = function (t) {
    var e = B.formatterModule(t);
    return He.instance[e] || [];
  }),
    (B.getElementType = function (t, e) {
      if (t) return He.instance.getElementType(t);
      Be.createPrintElementType({ type: e });
    }),
    (B.build = function (t, e) {
      var i = B.formatterModule(e),
        n = new Ni().createPrintElementTypeHtml(t, B.getElementTypeGroups(i));
      B.enableDrag(n);
    }),
    (B.buildByHtml = function (t) {
      B.enableDrag(t);
    }),
    (B.enableDrag = function (t) {
      t.hidraggable({
        revert: !0,
        proxy: function (e) {
          var i = At.instance.getDragingPrintElement(),
            n = i.printElement.getProxyTarget(i.printElement.printElementType.getOptions());
          return (n.appendTo("body"), n.css("z-index", "9999"), n);
        },
        moveUnit: "pt",
        minMove: 4,
        onBeforeDrag: function (e) {
          At.instance.draging = !0;
          var i = B.getElementType($(e.data.target).attr("tid"), $(e.data.target).attr("ptype"));
          return (At.instance.setDragingPrintElement(i.createPrintElement()), !0);
        },
        onDrag: function (e, i, n) {
          At.instance.getDragingPrintElement().updatePosition(i, n);
        },
        onStopDrag: function () {
          At.instance.draging = !1;
        },
      });
    }),
    (B.formatterModule = function (t) {
      return t || "_default";
    }));
  var Ni = (function () {
      function t() {}
      return (
        (t.prototype.createPrintElementTypeHtml = function (e, i) {
          var n = $('<ul class="kuprint-printElement-type"></ul>');
          return (
            i.forEach(function (o) {
              var r = $("<li></li>");
              r.append('<span class="title">' + o.name + "</span>");
              var a = $("<ul></ul>");
              (r.append(a),
                o.printElementTypes.forEach(function (p) {
                  a.append(
                    '<li><a class="ep-draggable-item" tid="' +
                      p.tid +
                      '">  ' +
                      p.getText() +
                      " </a></li>",
                  );
                }),
                n.append(r));
            }),
            $(e).append(n),
            n.find(".ep-draggable-item")
          );
        }),
        t
      );
    })(),
    Me = function (t) {
      if (((this.index = t.index), (this.paperType = t.paperType), this.paperType)) {
        var e = At.instance[this.paperType];
        t.height
          ? ((this.height = t.height), (this.width = t.width))
          : ((this.height = e.height), (this.width = e.width));
      } else ((this.height = t.height), (this.width = t.width));
      ((this.paperHeader = t.paperHeader || 0),
        (this.paperFooter = t.paperFooter || f.mm.toPt(this.height)),
        (this.printElements = t.printElements || []),
        (this.paperNumberLeft = t.paperNumberLeft),
        (this.paperNumberTop = t.paperNumberTop),
        (this.paperNumberDisabled = t.paperNumberDisabled),
        (this.paperNumberFormat = t.paperNumberFormat),
        (this.panelPaperRule = t.panelPaperRule),
        (this.rotate = t.rotate || void 0),
        (this.firstPaperFooter = t.firstPaperFooter),
        (this.evenPaperFooter = t.evenPaperFooter),
        (this.oddPaperFooter = t.oddPaperFooter),
        (this.lastPaperFooter = t.lastPaperFooter),
        (this.topOffset = t.topOffset),
        (this.fontFamily = t.fontFamily),
        (this.leftOffset = t.leftOffset),
        (this.orient = t.orient));
    },
    Ai = (function () {
      function t(e, i, n, o) {
        ((this.startX = this.minX = e),
          (this.startY = this.minY = i),
          (this.maxX = e),
          (this.maxY = i),
          (this.lastLeft = n),
          (this.lastTop = o));
      }
      return (
        (t.prototype.updateRect = function (e, i) {
          ((this.minX = this.startX < e ? this.startX : e),
            (this.minY = this.startY < i ? this.startY : i),
            (this.maxX = this.startX < e ? e : this.startX),
            (this.maxY = this.startY < i ? i : this.startY));
        }),
        (t.prototype.updatePositionByMultipleSelect = function (e, i) {
          (e != null && (this.lastLeft = this.lastLeft + e),
            i != null && (this.lastTop = this.lastTop + i),
            this.target.css({ left: this.lastLeft + "pt", top: this.lastTop + "pt" }));
        }),
        t
      );
    })(),
    fi = (function () {
      function t(e, i, n, o, r, a, p, s, l, u, h) {
        ((this.defaultPaperNumberFormat = "paperNo-paperCount"),
          (this.printLine = 0),
          (this.templateId = e),
          (this.width = f.mm.toPt(i)),
          (this.height = f.mm.toPt(n)),
          (this.mmwidth = i),
          (this.mmheight = n),
          (this.paperHeader = o),
          (this.paperFooter = r),
          (this.contentHeight = r - o),
          this.createTarget(),
          (this.index = u),
          (this.paperNumberLeft = a || parseInt((this.width - 30).toString())),
          (this.paperNumberTop = p || parseInt((this.height - 22).toString())),
          (this.paperNumberDisabled = s),
          (this.paperNumberFormat = l),
          (this.referenceElement = h
            ? $.extend({}, h)
            : new G({
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                bottomInLastPaper: 0,
                beginPrintPaperIndex: 0,
                printTopInPaper: 0,
                endPrintPaperIndex: 0,
              })));
      }
      return (
        (t.prototype.subscribePaperBaseInfoChanged = function (e) {
          this.onPaperBaseInfoChanged = e;
        }),
        (t.prototype.triggerOnPaperBaseInfoChanged = function () {
          this.onPaperBaseInfoChanged &&
            this.onPaperBaseInfoChanged({
              paperHeader: this.paperHeader,
              paperFooter: this.paperFooter,
              paperNumberLeft: this.paperNumberLeft,
              paperNumberTop: this.paperNumberTop,
              paperNumberDisabled: this.paperNumberDisabled,
              paperNumberFormat: this.paperNumberFormat,
            });
        }),
        (t.prototype.setFooter = function (e, i, n, o) {
          ((this.firstPaperFooter = e),
            (this.evenPaperFooter = i),
            (this.oddPaperFooter = n),
            (this.lastPaperFooter = o));
        }),
        (t.prototype.setOffset = function (e, i) {
          (this.setLeftOffset(e), this.setTopOffset(i));
        }),
        (t.prototype.setLeftOffset = function (e) {
          e
            ? this.paperContentTarget.css("left", e + "pt")
            : (this.paperContentTarget[0].style.left = "");
        }),
        (t.prototype.setTopOffset = function (e) {
          e
            ? this.paperContentTarget.css("top", e + "pt")
            : (this.paperContentTarget[0].style.top = "");
        }),
        (t.prototype.createTarget = function () {
          ((this.target = $(
            '<div class="kuprint-printPaper"><div class="kuprint-printPaper-content"></div></div>',
          )),
            (this.paperContentTarget = this.target.find(".kuprint-printPaper-content")),
            this.target.css("width", this.mmwidth + "mm"),
            this.target.css("height", this.mmheight - S.instance.paperHeightTrim + "mm"),
            this.target.attr("original-height", this.mmheight));
        }),
        (t.prototype.createHeaderLine = function () {
          var e = this;
          ((this.headerLineTarget = $(
            '<div class="kuprint-headerLine" style="position:absolute;width:100%;border-top:1px dashed #c9bebe;height:7pt;"></div>',
          )),
            this.headerLineTarget.css("top", (this.paperHeader || -1) + "pt"),
            this.paperHeader === 0 && this.headerLineTarget.addClass("hideheaderLinetarget"),
            this.paperContentTarget.append(this.headerLineTarget),
            this.dragHeadLineOrFootLine(this.headerLineTarget, function (i, n) {
              ((e.paperHeader = n), e.triggerOnPaperBaseInfoChanged());
            }));
        }),
        (t.prototype.createFooterLine = function () {
          var e = this;
          ((this.footerLineTarget = $(
            '<div class="kuprint-footerLine" style="position:absolute;width:100%;border-top:1px dashed #c9bebe;height:7pt;"></div>',
          )),
            this.footerLineTarget.css("top", parseInt(this.paperFooter.toString()) + "pt"),
            this.paperFooter === this.height &&
              (this.footerLineTarget.css("top", this.mmheight - S.instance.paperHeightTrim + "mm"),
              this.footerLineTarget.addClass("hidefooterLinetarget")),
            this.paperContentTarget.append(this.footerLineTarget),
            this.dragHeadLineOrFootLine(this.footerLineTarget, function (i, n) {
              ((e.paperFooter = n), e.triggerOnPaperBaseInfoChanged());
            }));
        }),
        (t.prototype.createPaperNumber = function (e) {
          var i = this,
            n = this.target.find(".kuprint-paperNumber");
          if (n.length) return (n.html(e), n);
          var o = $('<span class="kuprint-paperNumber" style="position:absolute">' + e + "</span>");
          return (
            o.css("top", this.paperNumberTop + "pt"),
            o.css("left", this.paperNumberLeft + "pt"),
            this.paperContentTarget.append(o),
            this.dragHeadLineOrFootLine(
              o,
              function (r, a) {
                ((i.paperNumberTop = a),
                  (i.paperNumberLeft = r),
                  i.triggerOnPaperBaseInfoChanged());
              },
              !0,
            ),
            o
          );
        }),
        (t.prototype.getTarget = function () {
          return this.target;
        }),
        (t.prototype.append = function (e) {
          this.paperContentTarget.append(e);
        }),
        (t.prototype.updateReferenceElement = function (e) {
          e && (this.referenceElement = e);
        }),
        (t.prototype.updatePrintLine = function (e) {
          e >= this.printLine && (this.printLine = e);
        }),
        (t.prototype.design = function (e) {
          var i = this;
          (this.createHeaderLine(),
            this.createFooterLine(),
            this.target.addClass("design"),
            (this.paperNumberTarget = this.createPaperNumber(this.formatPaperNumber(1, 1))),
            this.createRuler(),
            this.resetPaperNumber(this.paperNumberTarget),
            $(this.paperNumberTarget).bind("dblclick.kuprint", function () {
              (i.paperNumberDisabled == null && (i.paperNumberDisabled = !1),
                (i.paperNumberDisabled = !i.paperNumberDisabled),
                i.resetPaperNumber(i.paperNumberTarget),
                i.triggerOnPaperBaseInfoChanged());
            }),
            $(this.paperNumberTarget).bind("click.kuprint", function () {
              f.event.trigger("BuildCustomOptionSettingEventKey_" + i.templateId, {
                options: {
                  paperNumberFormat: i.paperNumberFormat,
                  paperNumberDisabled: i.paperNumberDisabled,
                },
                callback: function (n) {
                  ((i.paperNumberDisabled = !!n.paperNumberDisabled || void 0),
                    (i.paperNumberFormat = n.paperNumberFormat || void 0),
                    i.createPaperNumber(i.formatPaperNumber(1, 1)),
                    i.resetPaperNumber(i.paperNumberTarget),
                    i.triggerOnPaperBaseInfoChanged());
                },
              });
            }));
        }),
        (t.prototype.resetPaperNumber = function (e) {
          this.paperNumberDisabled
            ? e.addClass("kuprint-paperNumber-disabled")
            : e.removeClass("kuprint-paperNumber-disabled");
        }),
        (t.prototype.updatePaperNumber = function (e, i, n) {
          var o = this.createPaperNumber(this.formatPaperNumber(e, i));
          this.paperNumberDisabled
            ? o.hide()
            : n &&
              this.index % 2 === 1 &&
              ((o[0].style.left = ""), o.css("right", this.paperNumberLeft + "pt"));
        }),
        (t.prototype.formatPaperNumber = function (e, i) {
          return (this.paperNumberFormat || this.defaultPaperNumberFormat)
            .replace("paperNo", e.toString())
            .replace("paperCount", i.toString());
        }),
        (t.prototype.dragHeadLineOrFootLine = function (e, i, n) {
          var o = this;
          e.hidraggable({
            axis: n ? void 0 : "v",
            onDrag: function (r, a, p) {
              i(a, p);
            },
            moveUnit: "pt",
            minMove: S.instance.movingDistance,
            onBeforeDrag: function () {
              C.instance.draging = !0;
            },
            onStopDrag: function () {
              ((C.instance.draging = !1),
                o.footerLineTarget.removeClass("hidefooterLinetarget"),
                o.headerLineTarget.removeClass("hideheaderLinetarget"));
            },
          });
        }),
        (t.prototype.resize = function (e, i) {
          ((this.width = f.mm.toPt(e)),
            (this.height = f.mm.toPt(i)),
            (this.mmwidth = e),
            (this.mmheight = i),
            this.target.css("width", e + "mm"),
            this.target.css("height", i - S.instance.paperHeightTrim + "mm"),
            this.target.attr("original-height", this.mmheight),
            (this.paperFooter = this.height),
            this.footerLineTarget.css("top", this.height + "pt"),
            (this.contentHeight = this.paperFooter - this.paperHeader),
            (this.paperNumberLeft = parseInt((this.width - 30).toString())),
            (this.paperNumberTop = parseInt((this.height - 22).toString())),
            this.paperNumberTarget.css("top", this.paperNumberTop + "pt"),
            this.paperNumberTarget.css("left", this.paperNumberLeft + "pt"),
            this.triggerOnPaperBaseInfoChanged());
        }),
        (t.prototype.getPaperFooter = function (e) {
          var i = this.index + e;
          if (i === 0) return this.firstPaperFooter || this.oddPaperFooter || this.paperFooter;
          if (i % 2 === 0) return this.oddPaperFooter || this.paperFooter;
          if (i % 2 === 1) return this.evenPaperFooter || this.paperFooter;
        }),
        (t.prototype.getContentHeight = function (e) {
          return this.getPaperFooter(e) - this.paperHeader;
        }),
        (t.prototype.createRuler = function () {
          this.target.append(
            '<div class="kuprint_rul_wrapper"><img class="h_img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAAPCAYAAAC891QNAAAKxklEQVR4Xu1dPezlQxQ92yE6opGIaOg2QeWjUVjRSCg24qMgQtBItHazq5XoJBtBgYiCROGz0CBRiGRVdKISoRNKcmIudyfze+/tvL27v/Oc1+yX3/ife2buOXPv/OYdAXASwCnof4xjXRyaD/NREQHPq4qozo9pPuZjV/Gk+aiI6vyY5mM+dhVPmo+KqM6PaT7mY1fxpPmoiOr8mOZjPnYVT5qPiqjOj2k+5mNX8aT5qIjq/JjmYz52FU+aj4qozo9pPuZjV/Gk+aiI6vyY5mM+dhVPmo+KqE6OeQTAXwD4q/rHONbFoPkwHxUR8LyqiOr8mOZjPnYVT5qPiqjOj2k+5mNX8aT5qIjq/JjmYz52FU+aj4qozo9pPuZjV/Gk+aiI6vyY5mM+dhVPmo+KqM6PaT7mY1fxpPmoiOr8mOZjPnYVT5qPiqjOj2k+5mNX8aT5qIjq5JhuoE8GrvAxL5DC4E4MbT4mglb4iPkoDO7E0OZjImiFj5iPwuBODG0+JoJW+Ij5KAzuxNDmYyJohY+Yj8LgTgxtPiaCVviI+SgM7sTQ5mMiaIWPmI/C4E4MbT4mglb4iPkoDO7E0OZjImiFj5iPwuBODG0+JoJW+Ij5KAzu+Q6dG+gPAXgLwBkAzwH483wHu8T/fZ5YtwO4HsDbAK5qvx4DcAeAry7xz7ntfx84go9PAfD3/BCPEo4rALwM4Mk0r/h3ajjihgbOpacBvARAFUfMK84nrofvRfkIHGcBHAfwqyCOmwC8C+BoW98PA/hEEAfXxwsATgNQzlfE0eug6jrnlNqmg2vW/CU9Jy7+3D82Lb+xrSH+PfPAD9sE9iL/+y6+hOuemqjIB+fYly2m4a8UccS0yHNLEUf2u+Hl71+xt99lfZwA8KLo+ghd5PwKbbxHkI/Is/QqyvlqtB9UWOe77AcVcfwG4HIAzwN4BQD/rIgj78+V1kc/r7gnUdTzHgfnUe8V1eeVkp5vyldKet7jYP2H+1w1Pe9xXJ1qD8r5alQXXfs637UuqoiDfQM1Pd/Gh8r6GOG4WVDPRziiH6W0P982r1T0fBsOFT0f4eC+Q03PRziuE9TzbfNq9fXEaKDTTEVjkMW2KE5f5FrzXv+7KMRFwSqLHvGwURgY13w4gDjIB3l4NTVBGBw1HPmrAe5rHNwqjIPifWc7YBLrRGlekY8nALzfClW5wKCEI+crYmAiZlFaeX0EL4o4Mh807PzwAJMaHz0OYlDNu9t08HUAj7XDQGvU/JGeM2/FgawwVzzs91Hj6d7273sZiQv88JIvCT38qTUP3gHwoBgfbPrHh40pziNytGYvucQHcURzjc3arIcq64N8sNHJJsgHjZh86E8JRy6UEMNlgvkqr4/ghc0pxfURfHwL4BEAH4rykXGweKKQd3fZDyro+QjHN63w83M6KL729THC8XvTDCU9H+GInKWk50s41PR8aX2o6fmmfMUXWFT0fNP6UNLzTXwo6fk2HCp6vktdVEHPRzi47eBLIUp6PsLBnMs9oJKej3DECwVKer6EQ03Pl9aHmp5vyldKer5pfSjp+SY+lPR8G47V63k00Lmgo/jcF+AucD25bLilN1miwE4h6ZuHZT/MHgP3VzTEz09+2ChQxMFmzrWt8fyUKA6ui1sAXAngTQCKOPKJn3gb6lFBPpivuC54s4EyjhCQnHNV81W8ofZee1tQEUfWwXh7+xrB9RHzKr+B3vPxHYDbWsN5jZq/yxvoNIvx5tofrbHD3LymA3KbcNAmMPah7Wv2YJtwxNp/pt0EooqD/vCXhoE3mijiyDcC8BApG1SKOJiveJjs7vbGsyqO2ArE3oNFYEU+iIM+/oF20wf/rIgjdDAKo58J6SBjvrQfVNLzjIP72fzGmtL66HGo6nmPQ1XPexyqep5xcD3EjQBqet7nK1U9H61zRT3vcajq+UgHFfV8U11USc8zjv4NdCU973Go6nmPQ1XPexyqep5x5BsB1PS8z1eqej5a54p63uNQ1fORDkrouRvoe3S6ix6NQjWLCnzb7ot2vatiQyqfMFFvSDHBftyKhqoN9EPh49Aanflgj+I6H725rdp4jje3WVjnlaI3uIFepHSbh/0/NNCpiZxvfCtSqdCQD2YEi9EEUWpIZRxxiISNc35UG+iHwodyo7NfH/mAUhyYobdXOrjUv7mtvM75hhQ/XwN4Q6SBvm0/qFJw73GQB8UG+giHop6PcGROVNZ5j0NVzw+VD1U9H/GhqOc9DlU9H61zRT0Pn75UF1XR8x4HbzBR1PMRDkU9H+FQ1PMeBw9Qs+6ruD8nln5PqFgvyTiivivR6ATQv5g6qv3w1j6l/Xnmg7/nja/xUpGKbx+tcxk9P8Qr3PtkFUZR6Ypqvil8CsBr6TtdFXEcypXIxBHf2875xZNjkbCU5tWh8DFqoCvywfwbVyvx6xr4UVzn5ONxACcB8ISl8tXnIejBg+JV9KM30Pt5pXRFXL/5yNc7q1zh3vsSYrqr3dbAf1O5anvJX4VxV7gSeWl9vNUWP281eVbkSv1D5aMvuKvOK/ITX9fAt21V1zkP+nyeNujKfOR8q6CDu+wHVXH0DXT+ee1XuI/4UNTzTfNKSc+XcKjp+SHzoajnIz4U9XyEQ1HPl/hQ0/Nd6nAKej7C0TfQFfR8hIPNKLX9+aZ5paTnSzjU9PyQ+egb6Ar7waV8pbY/H+Hgi15q+/MlPmT0PBro/JVFaSaoM+1q5Py2KgH1JzjW/HdRcCee3Pzk96byOqy1Y2NDiqcwjkY3RxRHnlcsSh8TxhGFHn7/I9eI4rw6JD4iX6nPq3yanTnW8+rS5ef8FQehg6p85Mbakg7yIFBoPgtcvAZ9jdqY9TxyGDe4/P4lrpmzTSePtwNna/UqGccJAKdTw5baqMhHXh/x8yviyE110kKfqIjjUPg4FBycV/mGGeYmz6uLqzM578YekGs8fr92PnbdDyri4PrIb6zxDSNFHIp6vm1eqej5CIeinh8yH4p6vjSv1PT8kOeVop7vWodbuw6OcCjq+QiHop5vm1cqer40r6KmpbQ/31SnVuZDUc+X5pWanh/yOpfS89xAT71aqWZ5/NxrLZr75/tvZpkjrYMonrueu9aFHAGv3zUfnHO+cr5yvnK+WuMhIOcm5ybnJucm56aLe3jGedd513nXedd513nX9WfXr1y/+kcLvBYcA8+DPdeCG+h7BtCJyMm47U0sSBYkC5LzqQt2Lti5YOeCnQt2LtjZE9oT2hPaE9oT2hPaE9oT2hPaE9oT2hPaE9oT2hPaE9oTintCN9CdyJ3IncidyMUTuQ/y+CCPD/L8u4hdpHCRwkUKe1t7W3tbe1t7Wzeu3LiyJ7QntCe0J7QntCe0J7QntCe0J7QntCfcyxO6gW5DaUNpQ2lDaUNpQ2lDaUNpQ7mXofRBHh/k8UEeH+RJdsqaYk2xprjO4DqD6wyuM7jO4DqD6wz2hPaE9oT2hPaE9oTSntANdCcxJzEnMekk5qaNmzZu2rhp46bNOdU5FylcpHCRwv7e/t7+3v7ejSs3rty4sie0J7QntCe0J7QntCe0J7QntCe0J9zDE7qBbjNlM2UzZTNlM2UzZTNlM7WHmfJBHh/k8UEeH+TxQR4f5DnXTsK6al1148q1FtdaXGtxrcW1FtdaXGuxJ7QntCe0J7QnFPaEfwNdvyoPYn5mCwAAAABJRU5ErkJggg==" /><img class="v_img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB9AAAAAPCAYAAAC891QNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAiHSURBVHhe7Z29q21HGYevplLTKSL4UQQkwUYQG1EUtBGba5qkyEeX+NGI9irof2ClvTaCtoqgoEkISAIpTZMiJBCCQsCvSq7vc88emExm7XO2++Tc+S2fB17WmnftzZ3ffWf2b601a+9za8Kdw7bHnDkwZw7MmQNz5sCcOTBnDsyZA3PmwJw5MGcOzJkDc+bAnDkwZw7MmYPlc+897IiIiIiIiIiIiIiIiIiIiPxf4wK6iIiIiIiIiIiIiIiIiIhI4QK6iIiIiIiIiIiIiIiIiIhI4QK6iIiIiIiIiIiIiIiIiIhI4QK6iIiIiIiIiIiIiIiIiIhIkbCA/vmKOxW/rfggieKxCvJJzHTQJl6qeJBEADMd7JOjLinMdDxd8b6L3Rj2XI+96IDbFSlzHPZcj59WkGO74nynT62P7f96poNj5FeGMY+/EQ363I+h1XXM6tHmAvF9EkWiDrZp42prfox9th43w551AP1/6mL3LtbjZtia57SJ1vdkHX09mq5VrwdnOug7/sexRqIO6tD63fw8UQdb2unjivkxzulEHXupx150AP3v/TxRx17q0XyQaPM9WUdfD/b716zGTAd9H/08UUfrM9H8PFEHW9rp42rm59bjZtizDqD/vZ9bj5tha57TJtp8T9bR1+Md64OzBfT3HLY99yr3/oovV3yo4scVX62YvW7GdfflnNyWDuKhit9VvFox45x/97pzMx2PH/Y59kBFG2wjN9G/q+a2dPys4l8V/aQZuYn+XTW393qwz+s/XLF1IXXdfTknN9PRXoeGv17sTrnuvpyTu2xcfboitR5fqHimgtd/s+LfFTOuuy+n5D5TQR/pP3P4YxVb4+oyzu3LyKm5r1U8eojvkRiYvXfGdfSl55TcWA/q0Grwg4o/HPavwin/7si5uVHHJw9b2knjaqaDmyTPVrST4Nl7Z5zbl5FTcnuuR9PxnYonK2bvnXFuX0ZOyc3mObB982J3+t4Z5/Zl5JTcZePq2xWz9844ty8jp+RGHb0Pcvy5w/YqnPLvjpybO6ajn+fEyteDW/Ojh9cRaTpmfk4k6djyDyJNx8zPCevxdt6N3DEdvZ8TafMc2PZ+TiSPq+bnRJKOLT8nUnW0eZ5wH25rfvSk6hj9PFHHzD9SdYx+bj1uLndMR/Pz1HkObJuf72Fc4eeJOmZ+nq6Dvrd5/o71wdW/gY6gNyr+VsHiE4tQiWzpwEi+W/HDiq2FnJU4Vg/6z2Dj2OrMdPy64hsVH6/4VUWqjkZ6PRLZ0tFMI6EWcFk9/l5BfnVmOjBFThg5kW9PJq8GfXyhgjn8jwoMPXF+8LTePyu4CUK/7z/k0hjrQZs5zYkUF+ecKCYw6uhPZtHwi4vd5Rl13FeB1/FwzNcrOJbAXuvR60hi1EEbuJn7l4vdCC6rxyuH7eqMOvDBj1b8vmLVb6fNmOmY+fnq14Nb82MkUcfMz9N0bPlHmo4tP7ceN8MxHT2J8xxGP0+vR/PzNB1bfp6oY+v6nNeseh9ua37MSNMx83NI0rHlH5Ck49j1ufV49zmmYyRJB22YXZ8n16O/Pk/Scez6PE3H6OfT9UH/Bvq9g8FFYY59CzIBBtYTFasuRp3KFyv+dLEbCSeN1IIFQn6WInHBCnodKTdKt+DEMXlMASeLPJX1fMUvK1Y0wqvAIu6PKnjyDLNMH1tyb+AhDJ7e7S/O03irghsMzOk9zANOhDmnevluKw/qwcUTT7nie+NP3qXQ6/gJiWC4uE0eU0A98GzmOR7e3/hJ4/WKz1Xwiyb8usle2Mv1YKqO0c8Tdcz8PHlc9X6eWo/Rz9N1ND9PHVejn6fWY/Tz1HqMfp6qY2Qv90VTdYx+nqhj5ufJ46r389R6jH6erqP5eeq4Gv08tR6jn6fWY/TzVB1bvG19cPUFdCb4RyqYJHz4tp9pAH4OJKUoMx2frfhzBfD3Gzi2OjMdn6j4TQVPl6SwNa74KQcW1lJuls50sLDJT07QfrEi4SJkqx4PV/AtYj6UeRJodWY62O8NPoGZDk4WOZnHHB+p4NjqbI0r4MESFtNXHFf0CX9ofXytYkvHyj7IZ88HKvAI+s0DC+3z6OcV/QM+K+sY6/Gfw5Zv1nNhe7uikaSD9qcqvlIxfj6l6YBvVXDC3pOmg4snzkF4Ur/pgiQdzHMegEMHDyulfF7N6rH18FtaPb5UgXfj4XzDq5Gko39oL8kHRx0zP+f46teDs/kBnBu2m7yJOmZ+nlqP0c9TdUDv56k6Rj9P1DHz89R6jH6eWo/RzxN1zPw8UcfMzxPui87mB/R+nqhj5uep9Rj9PHlc9X6eqmP080QdMz9Prcfo56n1GP08UcfMzxN1bN1vT1sfvAtmztM+TPh2MsUAI9/g+OqMOgj2ybUbWok6GHTtD/C3BZFUHdyAa2MMEnW0NpE8rjjx5WdA0nXQd9pE+1mTRB0E++TajepEHf3n1arjatbHUQdwjHxjNR3Q5nH/kz70uemC1XXM6sE2rR7HxhXR+p6qo+030nT07fRxhUek66Df9J820XwvsR5safefw4k66C/tvXzuNh39WGuvSdBBv5kXHINUHWxpp9ejjSuC/WQdbR8SdfTt9HE1+nmijr7PBJpS68GWdvPzVB178cFRR/8atrQTdND33s9TdbClnV6P0c+TdbR9SNTRt9PH1ejniTrod/MKon1upekAtrSbn6fq2IsPznS088XGajr+Z/YiRB1roY61UMdaqGMt1LEW6lgLdayFOtZCHWuhjrVQx1qoYy3UsRbqWAt1rIU61kIda6GOtVDHWtzxb6CLiIiIiIiIiIiIiIiIiIgU9x22e+CPh2066lgLdayFOtZCHWuhjrVQx1qoYy3UsRbqWAt1rIU61kIda6GOtVDHWqhjLdSxFupYC3WshTqW4dat/wKB2hwSL8nDjQAAAABJRU5ErkJggg==" /></div>',
          );
        }),
        (t.prototype.displayHeight = function () {
          return this.mmheight - S.instance.paperHeightTrim + "mm";
        }),
        (t.prototype.displayWidth = function () {
          return this.mmwidth + "mm";
        }),
        (t.prototype.getPanelTarget = function () {
          return this.target.parent(".kuprint-printPanel");
        }),
        t
      );
    })(),
    Xe = function (t) {
      if (t)
        if (t.panels) {
          this.panels = [];
          for (var e = 0; e < t.panels.length; e++) this.panels.push(new Me(t.panels[e]));
        } else this.panels = [];
    },
    Wi = (function () {
      function t(e, i) {
        var n = this;
        ((this.printElementOptionSettingPanel = {}),
          (this.printTemplate = e),
          (this.settingContainer = $(i)),
          f.event.on(e.getPrintElementSelectEventKey(), function (o) {
            n.buildSetting(o);
          }),
          f.event.on(e.getBuildCustomOptionSettingEventKey(), function (o) {
            n.buildSettingByCustomOptions(o);
          }));
      }
      return (
        (t.prototype.init = function () {}),
        (t.prototype.buildSetting = function (e) {
          var i = this,
            n = e.printElement,
            o = e.customOptionsInput;
          (this.lastPrintElement &&
            this.lastPrintElement.getPrintElementOptionItems().forEach(function (s) {
              s.destroy();
            }),
            (this.lastPrintElement = void 0),
            this.settingContainer.html(""));
          var r = $('<div class="kuprint-option-items"></div>');
          n.getPrintElementOptionItems().forEach(function (s) {
            s.submit = function () {
              n.submitOption();
            };
            var l = s.createTarget(n, n.options, n.printElementType);
            ((i.printElementOptionSettingPanel[s.name] = l),
              r.append(l),
              s.setValue(n.options[s.name], n.options, n.printElementType));
          });
          var a = $(
              '<button class="kuprint-option-item-settingBtn kuprint-option-item-submitBtn" type="button">确定</button>',
            ),
            p = $(
              '<button class="kuprint-option-item-settingBtn kuprint-option-item-deleteBtn" type="button">删除</button>',
            );
          (r.append(a).append(p),
            a.bind("click.submitOption", function () {
              n.submitOption();
            }),
            p.bind("click.deleteBtn", function () {
              i.printTemplate.deletePrintElement(n);
            }),
            r.find(".auto-submit").change(function () {
              n.submitOption();
            }),
            r.find(".auto-submit:input").bind("keydown.submitOption", function (s) {
              s.keyCode === 13 && n.submitOption();
            }),
            this.settingContainer.append(r),
            o &&
              o.forEach(function (s) {
                var l = s.callback;
                ((s.callback = function (u) {
                  l && (l(u), n.submitOption());
                }),
                  i.buildSettingByCustomOptions(s, i.settingContainer));
              }),
            (this.lastPrintElement = n));
        }),
        (t.prototype.buildSettingByCustomOptions = function (e, i) {
          var n = this;
          (this.lastPrintElement &&
            this.lastPrintElement.getPrintElementOptionItems().forEach(function (s) {
              s.destroy();
            }),
            (this.lastPrintElement = void 0));
          var o = i || this.settingContainer;
          i || this.settingContainer.html("");
          var r = [];
          e.optionItems
            ? (r = e.optionItems)
            : Object.keys(e.options).forEach(function (s) {
                var l = ke.getItem(s);
                l && r.push(l);
              });
          var a = $('<div class="kuprint-option-items"></div>');
          (e.title &&
            a.append(
              '<div class="kuprint-option-item kuprint-option-item-row"><div class="kuprint-option-item-label kuprint-option-title">' +
                e.title +
                "</div></div>",
            ),
            r.forEach(function (s) {
              ((s.submit = function () {
                e.callback(n.getValueByOptionItems(r));
              }),
                a.append(s.createTarget(void 0, e.options, void 0)),
                s.setValue(e.options[s.name], e.options, void 0));
            }));
          var p = $(
            '<button class="kuprint-option-item-settingBtn kuprint-option-item-submitBtn" type="button">确定</button>',
          );
          (a.append(p),
            p.bind("click.submitOption", function () {
              e.callback(n.getValueByOptionItems(r));
            }),
            a.find(".auto-submit").change(function () {
              e.callback(n.getValueByOptionItems(r));
            }),
            a.find(".auto-submit:input").bind("keydown.submitOption", function (s) {
              s.keyCode === 13 && e.callback(n.getValueByOptionItems(r));
            }),
            o.append(a));
        }),
        (t.prototype.getValueByOptionItems = function (e) {
          var i = {};
          return (
            e.forEach(function (n) {
              i[n.name] = n.getValue();
            }),
            i
          );
        }),
        t
      );
    })(),
    Gi = (function () {
      function t(e, i) {
        ((this.paginationContainer = e),
          (this.$container = $(this.paginationContainer)),
          (this.template = i));
      }
      return (
        (t.prototype.buildPagination = function () {
          var e = this.template.getPaneltotal(),
            i = this;
          this.$container.html("");
          for (var n = $('<ul class="kuprint-pagination"></ul>'), o = 0; o < e; o++)
            (function (a) {
              var p = $("<li><span>" + (a + 1) + '</span><a href="javascript:void(0);">x</a></li>');
              (p.find("span").click(function () {
                (i.template.selectPanel(a),
                  p.removeClass("selected"),
                  $(this).parent("li").addClass("selected"));
              }),
                p.find("a").click(function () {
                  (i.template.deletePanel(a), i.buildPagination());
                }),
                n.append(p));
            })(o);
          var r = $("<li><span>+</span></li>");
          (n.append(r),
            this.$container.append(n),
            r.click(function () {
              (i.template.addPrintPanel(void 0, !0), i.buildPagination());
            }));
        }),
        t
      );
    })(),
    ji = g,
    ci = S;
  function F(t, e) {
    var i = ji.call(this, t) || this;
    return (
      (i.options = new Se(e)),
      i.options.setDefault(new Se(ci.instance.longText.default).getPrintElementOptionEntity()),
      i
    );
  }
  (H(F, g),
    (F.prototype.getDesignTarget = function (t) {
      var e = g.prototype.getDesignTarget.call(this, t);
      return (
        e.find(".kuprint-printElement-longText-content").css("border", "1px dashed #cebcbc"), e
      );
    }),
    (F.prototype.getProxyTarget = function (t) {
      t && this.SetProxyTargetOption(t);
      var e = this.getData(),
        i = this.createTarget(this.printElementType.getText(!0), e);
      return (this.updateTargetSize(i), this.css(i, e), i);
    }),
    (F.prototype.updateDesignViewFromOptions = function () {
      if (this.designTarget) {
        var t = this.getData(),
          e = this.getHtml(this.designPaper)[0].target;
        (this.designTarget
          .find(".kuprint-printElement-longText-content")
          .html(e.find(".kuprint-printElement-longText-content").html()),
          this.css(this.designTarget, t));
      }
    }),
    (F.prototype.getConfigOptions = function () {
      return ci.instance.longText;
    }),
    (F.prototype.getTitle = function () {
      return this.options.title || this.printElementType.title;
    }),
    (F.prototype.getData = function (t) {
      return t
        ? t[this.getField()] || ""
        : this.options.testData || this.printElementType.getData() || "";
    }),
    (F.prototype.updateTargetText = function (t, e, i) {
      t.find(".kuprint-printElement-longText-content").html(this.getText(e, i));
    }),
    (F.prototype.createTarget = function (t, e) {
      var i = $(
        '<div class="kuprint-printElement kuprint-printElement-longText" style="position:absolute;"><div class="kuprint-printElement-longText-content kuprint-printElement-content" style="height:100%;width:100%"></div></div>',
      );
      return (this.updateTargetText(i, t, e), i);
    }),
    (F.prototype.getText = function (t, e) {
      var i = this.getFormatter();
      e && (e = this.options.leftSpaceRemoved !== !1 ? e.toString().replace(/^\s*/, "") : e);
      var n = "";
      return (
        this.getField()
          ? (n =
              (this.options.getHideTitle() ? "" : t ? t + "：" : "") +
              (i ? i(t, e, this.options, this._currenttemplateData) : e))
          : (n = i ? i(t, t, this.options, this._currenttemplateData) : t || ""),
        n || ""
      );
    }),
    (F.prototype.getHtml = function (t, e) {
      (this.setCurrenttemplateData(e), this.createTempContainer());
      var i = this.getPaperHtmlResult(t, e);
      return (this.removeTempContainer(), i);
    }),
    (F.prototype.getHeightByData = function (t) {
      this.createTempContainer();
      var e = new fi("", 1e3, 1e3, 0, 25e3, 0, 0, !0, void 0, 0, void 0),
        i = this.getPaperHtmlResult(e, {}, t);
      return (
        this.removeTempContainer(),
        i[0].referenceElement.bottomInLastPaper - i[0].referenceElement.printTopInPaper
      );
    }),
    (F.prototype.getLongTextIndent = function () {
      return this.options.longTextIndent
        ? '<span class="long-text-indent" style="margin-left:' +
            this.options.longTextIndent +
            'pt"></span>'
        : '<span class="long-text-indent"></span>';
    }),
    (F.prototype.getPaperHtmlResult = function (t, e, i) {
      var n = this,
        o = [],
        r = 0,
        a = i || this.getData(e),
        p = this.getText(this.getTitle(), a),
        s = this.createTarget(this.getTitle(), this.options.testData || "");
      (this.css(s, a),
        e ? this.updateTargetWidth(s) : this.updateTargetSize(s),
        this.getTempContainer().html(""),
        this.getTempContainer().append(s));
      var l = [this.getLongTextIndent()],
        u = p.split(/\r|\n/);
      if (
        (u.forEach(function (w, M) {
          var V = n.options.leftSpaceRemoved !== !1 ? (w || "").toString().replace(/^\s*/, "") : w;
          ((l = l.concat(V.split(""))),
            M < u.length - 1 && l.push("<br/>" + n.getLongTextIndent()));
        }),
        l.length === 0 && (l = [""]),
        this.isHeaderOrFooter() || this.isFixed() || !e)
      ) {
        var h = this.getStringBySpecificHeight(l, 25e3, s);
        return (
          h.target.css("left", this.options.displayLeft()),
          h.target.css("top", this.options.displayTop()),
          (h.target[0].height = ""),
          o.push(
            new z({
              target: h.target,
              printLine: this.options.displayTop() + h.height,
              referenceElement: new G({
                top: this.options.getTop(),
                left: this.options.getLeft(),
                height: this.options.getHeight(),
                width: this.options.getWidth(),
                beginPrintPaperIndex: t.index,
                bottomInLastPaper: this.options.getTop() + h.height,
                printTopInPaper: this.options.getTop(),
              }),
            }),
          ),
          o
        );
      }
      for (var d = this.getBeginPrintTopInPaperByReferenceElement(t); l.length > 0;) {
        var c = 0,
          m = t.getPaperFooter(r);
        r === 0 &&
          d > m &&
          ((d = d - m + t.paperHeader),
          o.push(new z({ target: void 0, printLine: void 0 })),
          r++,
          (c = t.getContentHeight(r) - (d - t.paperHeader)),
          (m = t.getPaperFooter(r)));
        var y = c > 0 ? c : r === 0 ? m - d : t.getContentHeight(r),
          v = this.getStringBySpecificHeight(l, y, s);
        l.splice(0, v.length);
        var P, x;
        (v.target.css("left", this.options.displayLeft()),
          (v.target[0].height = ""),
          r === 0 || c > 0
            ? ((x = d),
              v.target.css("top", x + "pt"),
              (P =
                l.length > 0
                  ? d + v.height
                  : this.options.lHeight != null
                    ? d + (v.height > this.options.lHeight ? v.height : this.options.lHeight)
                    : d + v.height))
            : ((x = t.paperHeader), v.target.css("top", x + "pt"), (P = x + v.height)),
          o.push(
            new z({
              target: v.target,
              printLine: P,
              referenceElement: new G({
                top: this.options.getTop(),
                left: this.options.getLeft(),
                height: this.options.getHeight(),
                width: this.options.getWidth(),
                beginPrintPaperIndex: t.index,
                bottomInLastPaper: P,
                printTopInPaper: x,
              }),
            }),
          ),
          r++);
      }
      return o;
    }),
    (F.prototype.getStringBySpecificHeight = function (t, e, i) {
      var n = f.pt.toPx(e),
        o = this.IsPaginationIndex(t, t.length - 1, n, i);
      return o.IsPagination ? o : this.BinarySearch(t, 0, t.length - 1, n, i);
    }),
    (F.prototype.BinarySearch = function (t, e, i, n, o) {
      var r = Math.floor((e + i) / 2);
      if (e > i)
        return (
          o.find(".kuprint-printElement-longText-content").html(""),
          { IsPagination: !0, height: 0, length: 0, target: o.clone() }
        );
      var a = this.IsPaginationIndex(t, r, n, o);
      return a.IsPagination
        ? a
        : a.move === "l"
          ? this.BinarySearch(t, e, r - 1, n, o)
          : this.BinarySearch(t, r + 1, i, n, o);
    }),
    (F.prototype.IsPaginationIndex = function (t, e, i, n) {
      n.find(".kuprint-printElement-longText-content").html(t.slice(0, e + 2).join(""));
      var o = n.height();
      n.find(".kuprint-printElement-longText-content").html(t.slice(0, e + 1).join(""));
      var r = n.height();
      return e >= t.length - 1 && r < i
        ? { IsPagination: !0, height: f.px.toPt(r), length: t.length, target: n.clone() }
        : r <= i && o >= i
          ? { IsPagination: !0, height: r, length: e + 1, target: n.clone() }
          : r >= i
            ? { IsPagination: !1, move: "l" }
            : o <= i
              ? { IsPagination: !1, move: "r" }
              : { IsPagination: !0, result: 1 };
    }));
  var K = C,
    D = S,
    Ye = (function () {
      function t(e, i) {
        ((this.templateId = i),
          (this.index = e.index),
          (this.width = e.width),
          (this.height = e.height),
          (this.paperType = e.paperType),
          (this.paperHeader = e.paperHeader),
          (this.paperFooter = e.paperFooter),
          this.initPrintElements(e.printElements),
          (this.paperNumberLeft = e.paperNumberLeft),
          (this.paperNumberTop = e.paperNumberTop),
          (this.paperNumberDisabled = e.paperNumberDisabled),
          (this.paperNumberFormat = e.paperNumberFormat),
          (this.panelPaperRule = e.panelPaperRule),
          (this.firstPaperFooter = e.firstPaperFooter),
          (this.evenPaperFooter = e.evenPaperFooter),
          (this.oddPaperFooter = e.oddPaperFooter),
          (this.lastPaperFooter = e.lastPaperFooter),
          (this.topOffset = e.topOffset),
          (this.leftOffset = e.leftOffset),
          (this.fontFamily = e.fontFamily),
          (this.orient = e.orient),
          (this.rotate = e.rotate),
          (this.target = this.createTarget()));
      }
      return (
        (t.prototype.design = function (e) {
          var i = this;
          (this.orderPrintElements(),
            (this.designPaper = this.createNewPage(0)),
            this.target.html(""),
            this.target.append(this.designPaper.getTarget()),
            this.droppablePaper(this.designPaper),
            this.designPaper.design(e),
            this.designPaper.subscribePaperBaseInfoChanged(function (n) {
              ((i.paperHeader = n.paperHeader),
                (i.paperFooter = n.paperFooter),
                (i.paperNumberLeft = n.paperNumberLeft),
                (i.paperNumberTop = n.paperNumberTop),
                (i.paperNumberDisabled = n.paperNumberDisabled),
                (i.paperNumberFormat = n.paperNumberFormat));
            }),
            this.printElements.forEach(function (n) {
              (i.appendDesignPrintElement(i.designPaper, n), n.design(e, i.designPaper));
            }),
            this.target.bind("click.kuprint", function () {
              f.event.trigger("BuildCustomOptionSettingEventKey_" + i.templateId, {
                options: {
                  panelPaperRule: i.panelPaperRule,
                  firstPaperFooter: i.firstPaperFooter,
                  evenPaperFooter: i.evenPaperFooter,
                  oddPaperFooter: i.oddPaperFooter,
                  lastPaperFooter: i.lastPaperFooter,
                  leftOffset: i.leftOffset,
                  topOffset: i.topOffset,
                  fontFamily: i.fontFamily,
                  orient: i.orient,
                  paperNumberFormat: i.paperNumberFormat,
                },
                callback: function (n) {
                  ((i.panelPaperRule = n.panelPaperRule),
                    (i.firstPaperFooter = n.firstPaperFooter),
                    (i.evenPaperFooter = n.evenPaperFooter),
                    (i.oddPaperFooter = n.oddPaperFooter),
                    (i.lastPaperFooter = n.lastPaperFooter),
                    (i.leftOffset = n.leftOffset),
                    (i.topOffset = n.topOffset),
                    (i.fontFamily = n.fontFamily),
                    (i.orient = n.orient),
                    (i.paperNumberFormat = n.paperNumberFormat),
                    i.designPaper.setOffset(i.leftOffset, i.topOffset),
                    i.css(i.target));
                },
              });
            }),
            this.bindBatchMoveElement());
        }),
        (t.prototype.css = function (e) {
          this.fontFamily && e.css("fontFamily", this.fontFamily);
        }),
        (t.prototype.getHtml = function (e, i, n, o, r) {
          var a = this;
          this.orderPrintElements();
          var p,
            s = n || [],
            l = o || this,
            u;
          return (
            o
              ? ((u = s[s.length - 1]),
                (p = u.getPanelTarget()),
                u.updateReferenceElement(
                  new G({
                    top: this.paperHeader,
                    left: 0,
                    height: 0,
                    width: 0,
                    bottomInLastPaper: u.referenceElement.bottomInLastPaper,
                    beginPrintPaperIndex: s.length - 1,
                    printTopInPaper: u.referenceElement.bottomInLastPaper,
                    endPrintPaperIndex: s.length - 1,
                  }),
                ))
              : ((p = l.createTarget()),
                (u = l.createNewPage(s.length)),
                s.push(u),
                p.append(u.getTarget())),
            this.printElements
              .filter(function (h) {
                return !h.isFixed() && !h.isHeaderOrFooter();
              })
              .forEach(function (h) {
                var d = [],
                  c = s[s.length - 1];
                (c.referenceElement.isPositionLeftOrRight(h.options.getTop())
                  ? (u = s[c.referenceElement.beginPrintPaperIndex])
                  : (u = s[c.referenceElement.endPrintPaperIndex]),
                  (d = h.getHtml(u, e)),
                  d.forEach(function (m, y) {
                    (m.referenceElement &&
                      (m.referenceElement.endPrintPaperIndex =
                        m.referenceElement.beginPrintPaperIndex + d.length - 1),
                      y > 0 &&
                        (u.index < s.length - 1
                          ? (u = s[u.index + 1])
                          : ((u = l.createNewPage(s.length, u.referenceElement)), s.push(u)),
                        p.append(u.getTarget())),
                      m.target &&
                        (u.append(m.target),
                        u.updatePrintLine(m.printLine),
                        h.onRendered(u, m.target)),
                      y === d.length - 1 &&
                        m.referenceElement &&
                        u.updateReferenceElement(m.referenceElement));
                  }));
              }),
            r &&
              r.templates &&
              r.templates.forEach(function (h) {
                h.template.printPanels.forEach(function (d) {
                  d.getHtml(h.data || {}, h.options || {}, s, a);
                });
              }),
            o ||
              (this.lastPaperFooter &&
                s[s.length - 1].printLine > this.lastPaperFooter &&
                ((u = l.createNewPage(s.length, u.referenceElement)),
                s.push(u),
                p.append(u.getTarget())),
              this.panelPaperRule &&
                (this.panelPaperRule === "odd" &&
                  s.length % 2 === 0 &&
                  ((u = l.createNewPage(s.length, u.referenceElement)),
                  s.push(u),
                  p.append(u.getTarget())),
                this.panelPaperRule === "even" &&
                  s.length % 2 === 1 &&
                  ((u = l.createNewPage(s.length, u.referenceElement)),
                  s.push(u),
                  p.append(u.getTarget()))),
              s.forEach(function (h) {
                (h.updatePaperNumber(h.index + 1, s.length, i.paperNumberToggleInEven),
                  a.fillPaperHeaderAndFooter(h, e, s.length),
                  i &&
                    (i.leftOffset != null && h.setLeftOffset(i.leftOffset),
                    i.topOffset != null && h.setTopOffset(i.topOffset)));
              }),
              p.prepend(this.getPrintStyle())),
            p
          );
        }),
        (t.prototype.resize = function (e, i, n, o) {
          ((this.width = i),
            (this.height = n),
            (this.paperType = e),
            (this.rotate = o),
            this.designPaper.resize(i, n));
        }),
        (t.prototype.rotatePaper = function () {
          (this.rotate == null && (this.rotate = !1),
            (this.rotate = !this.rotate),
            this.resize(this.paperType, this.height, this.width, this.rotate));
        }),
        (t.prototype.getTarget = function () {
          return this.target;
        }),
        (t.prototype.enable = function () {
          this.target.removeClass("hipanel-disable");
        }),
        (t.prototype.disable = function () {
          this.target.addClass("hipanel-disable");
        }),
        (t.prototype.getPanelEntity = function (e) {
          var i = [];
          return (
            this.printElements.forEach(function (n) {
              i.push(n.getPrintElementEntity(e));
            }),
            new Me({
              index: this.index,
              width: this.width,
              height: this.height,
              paperType: this.paperType,
              paperHeader: this.paperHeader,
              paperFooter: this.paperFooter,
              paperNumberDisabled: !!this.paperNumberDisabled || void 0,
              paperNumberFormat: this.paperNumberFormat || void 0,
              panelPaperRule: this.panelPaperRule || void 0,
              paperNumberLeft: this.paperNumberLeft,
              paperNumberTop: this.paperNumberTop,
              printElements: i,
              rotate: this.rotate,
              firstPaperFooter: this.firstPaperFooter,
              evenPaperFooter: this.evenPaperFooter,
              oddPaperFooter: this.oddPaperFooter,
              lastPaperFooter: this.lastPaperFooter,
              topOffset: this.topOffset,
              fontFamily: this.fontFamily,
              orient: this.orient,
              leftOffset: this.leftOffset,
            })
          );
        }),
        (t.prototype.createTarget = function () {
          var e = $('<div class="kuprint-printPanel panel-index-' + this.index + '"></div>');
          return (this.css(e), e);
        }),
        (t.prototype.droppablePaper = function (e) {
          var i = this;
          e.getTarget().hidroppable({
            accept: ".ep-draggable-item",
            onDrop: function () {
              var n = K.instance.getDragingPrintElement(),
                o = n.printElement;
              (o.updateSizeAndPositionOptions(
                i.mathroundToporleft(n.left - f.px.toPt(i.target.offset().left)),
                i.mathroundToporleft(n.top - f.px.toPt(i.target.offset().top)),
              ),
                o.setTemplateId(i.templateId),
                o.setPanel(i),
                i.appendDesignPrintElement(i.designPaper, o, !0),
                i.printElements.push(o),
                o.design(void 0, e));
            },
          });
        }),
        (t.prototype.initPrintElements = function (e) {
          var i = this;
          ((this.printElements = []),
            e &&
              e.forEach(function (n) {
                var o;
                if (
                  (n.printElementType
                    ? (o = Be.createPrintElementType(n.printElementType))
                    : (o = He.instance.getElementType(n.tid)),
                  o)
                ) {
                  var r = o.createPrintElement(n.options);
                  (r.setTemplateId(i.templateId), r.setPanel(i), i.printElements.push(r));
                } else console.log("miss " + JSON.stringify(n));
              }));
        }),
        (t.prototype.mathroundToporleft = function (e) {
          var i = D.instance.movingDistance;
          return Math.round(e / i) * i;
        }),
        (t.prototype.appendDesignPrintElement = function (e, i, n) {
          i.setCurrenttemplateData(void 0);
          var o = i.getDesignTarget(e);
          (o.addClass("design"), n && i.initSizeByHtml(o), e.append(o));
        }),
        (t.prototype.createNewPage = function (e, i) {
          var n = new fi(
            this.templateId,
            this.width,
            this.height,
            this.paperHeader,
            this.paperFooter,
            this.paperNumberLeft,
            this.paperNumberTop,
            this.paperNumberDisabled,
            this.paperNumberFormat,
            e,
            i,
          );
          return (
            n.setFooter(
              this.firstPaperFooter,
              this.evenPaperFooter,
              this.oddPaperFooter,
              this.lastPaperFooter,
            ),
            n.setOffset(this.leftOffset, this.topOffset),
            n
          );
        }),
        (t.prototype.orderPrintElements = function () {
          ((this.printElements = f.orderBy(this.printElements, function (e) {
            return e.options.getLeft();
          })),
            (this.printElements = f.orderBy(this.printElements, function (e) {
              return e.options.getTop();
            })));
        }),
        (t.prototype.fillPaperHeaderAndFooter = function (e, i, n) {
          this.printElements
            .filter(function (o) {
              return o.isFixed() || o.isHeaderOrFooter();
            })
            .forEach(function (o) {
              if (o.showInPage(e.index, n)) {
                var r = o.getHtml(e, i);
                r.length && e.append(r[0].target);
              }
            });
        }),
        (t.prototype.clear = function () {
          (this.printElements.forEach(function (e) {
            e.designTarget && e.designTarget.length && e.designTarget.remove();
          }),
            (this.printElements = []));
        }),
        (t.prototype.insertPrintElementToPanel = function (e) {
          var i = this.getPrintElementTypeByEntity(e);
          if (i) {
            var n = i.createPrintElement(e.options);
            (n.setTemplateId(this.templateId), n.setPanel(this), this.printElements.push(n));
          }
        }),
        (t.prototype.addPrintText = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "text"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintHtml = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "html"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintTable = function (e) {
          if (
            ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "table"),
            e.options && e.options.columns)
          ) {
            var i = $.extend({}, e.options.columns);
            ((e.printElementType.columns = i.columns), (i.columns = void 0));
          }
          this.insertPrintElementToPanel(e);
        }),
        (t.prototype.addPrintImage = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "image"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintLongText = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "longText"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintVline = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "vline"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintHline = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "hline"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintRect = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "rect"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.addPrintOval = function (e) {
          ((e.printElementType = e.printElementType || {}),
            (e.printElementType.type = "oval"),
            this.insertPrintElementToPanel(e));
        }),
        (t.prototype.getPrintElementTypeByEntity = function (e) {
          var i;
          return (
            e.tid
              ? (i = He.instance.getElementType(e.tid))
              : (i = Be.createPrintElementType(e.printElementType)),
            i || console.log("miss " + JSON.stringify(e)),
            i
          );
        }),
        (t.prototype.getPrintStyle = function () {
          return (
            "<style printStyle>@page { border:0; padding:0cm; margin:0cm; " +
            this.getPrintSizeStyle() +
            " }</style>"
          );
        }),
        (t.prototype.getPrintSizeStyle = function () {
          return this.paperType
            ? "size:" +
                this.paperType +
                " " +
                (this.height > this.width ? "portrait" : "landscape") +
                ";"
            : "size:" +
                this.width +
                "mm " +
                this.height +
                "mm " +
                (this.orient ? (this.orient === 1 ? "portrait" : "landscape") : "") +
                ";";
        }),
        (t.prototype.deletePrintElement = function (e) {
          for (var i = this, n = 0; n < this.printElements.length; n++)
            if (this.printElements[n].id === e.id) {
              (e.delete(), i.printElements.splice(n, 1));
              break;
            }
        }),
        (t.prototype.getElementByTid = function (e) {
          return this.printElements.filter(function (i) {
            return i.printElementType.tid === e;
          });
        }),
        (t.prototype.getElementByName = function (e) {
          return this.printElements.filter(function (i) {
            return i.options.name === e;
          });
        }),
        (t.prototype.getFieldsInPanel = function () {
          var e = [];
          return (
            this.printElements.forEach(function (i) {
              i.options && i.options.field
                ? e.push(i.options.field)
                : i.printElementType.field && e.push(i.printElementType.field);
            }),
            e
          );
        }),
        (t.prototype.bindBatchMoveElement = function () {
          var e = this;
          this.designPaper
            .getTarget()
            .on("mousemove", function (i) {
              !K.instance.draging &&
                i.buttons === 1 &&
                e.mouseRect &&
                (e.mouseRect.updateRect(i.pageX, i.pageY), e.updateRectPanel(e.mouseRect));
            })
            .on("mousedown", function (i) {
              K.instance.draging ||
                (e.mouseRect && e.mouseRect.target && e.mouseRect.target.remove(),
                i.buttons === 1 &&
                  (e.mouseRect = new Ai(
                    i.pageX,
                    i.pageY,
                    K.instance.dragLengthCNum(
                      i.pageX - e.designPaper.getTarget().offset().left,
                      D.instance.movingDistance,
                    ),
                    K.instance.dragLengthCNum(
                      i.pageY - e.designPaper.getTarget().offset().top,
                      D.instance.movingDistance,
                    ),
                  )));
            });
        }),
        (t.prototype.getElementInRect = function (e) {
          var i = [];
          return (
            this.printElements.forEach(function (n) {
              n.inRect(e) && i.push(n);
            }),
            i
          );
        }),
        (t.prototype.updateRectPanel = function (e) {
          var i = this,
            n = this.designPaper.getTarget();
          (this.mouseRect.target ||
            ((this.mouseRect.target = $(
              '<div tabindex="1" style="z-index:2;position:absolute;opacity:0.2;border:1px dashed #000;background-color:#31676f;"><span></span></div>',
            )),
            n.find(".kuprint-printPaper-content").append(this.mouseRect.target),
            this.mouseRect.target.focus(),
            this.bingKeyboardMoveEvent(this.mouseRect.target),
            this.mouseRect.target.hidraggable({
              onDrag: function (o, r, a) {
                ((i.mouseRect.lastLeft = i.mouseRect.lastLeft || r),
                  (i.mouseRect.lastTop = i.mouseRect.lastTop || a),
                  (i.mouseRect.mouseRectSelectedElement || []).forEach(function (p) {
                    p.updatePositionByMultipleSelect(
                      r - i.mouseRect.lastLeft,
                      a - i.mouseRect.lastTop,
                    );
                  }),
                  (i.mouseRect.lastLeft = r),
                  (i.mouseRect.lastTop = a));
              },
              moveUnit: "pt",
              minMove: D.instance.movingDistance,
              onBeforeDrag: function () {
                (i.mouseRect.target.focus(),
                  (K.instance.draging = !0),
                  i.mouseRect.mouseRectSelectedElement ||
                    (i.mouseRect.mouseRectSelectedElement = i.getElementInRect(i.mouseRect)));
              },
              onStopDrag: function () {
                K.instance.draging = !1;
              },
            })),
            this.mouseRect.target.css({
              height: e.maxY - e.minY + "px",
              width: e.maxX - e.minX + "px",
              left: e.lastLeft + "pt",
              top: e.lastTop + "pt",
            }));
        }),
        (t.prototype.bingKeyboardMoveEvent = function (e) {
          var i = this;
          (e.attr("tabindex", "1"),
            e.keydown(function (n) {
              i.mouseRect.mouseRectSelectedElement ||
                (i.mouseRect.mouseRectSelectedElement = i.getElementInRect(i.mouseRect));
              var o = i.mouseRect.mouseRectSelectedElement || [];
              switch (n.keyCode) {
                case 37:
                  (i.mouseRect.updatePositionByMultipleSelect(-D.instance.movingDistance, 0),
                    o.forEach(function (r) {
                      r.updatePositionByMultipleSelect(-D.instance.movingDistance, 0);
                    }),
                    n.preventDefault());
                  break;
                case 38:
                  (i.mouseRect.updatePositionByMultipleSelect(0, -D.instance.movingDistance),
                    o.forEach(function (r) {
                      r.updatePositionByMultipleSelect(0, -D.instance.movingDistance);
                    }),
                    n.preventDefault());
                  break;
                case 39:
                  (i.mouseRect.updatePositionByMultipleSelect(D.instance.movingDistance, 0),
                    o.forEach(function (r) {
                      r.updatePositionByMultipleSelect(D.instance.movingDistance, 0);
                    }),
                    n.preventDefault());
                  break;
                case 40:
                  (i.mouseRect.updatePositionByMultipleSelect(0, D.instance.movingDistance),
                    o.forEach(function (r) {
                      r.updatePositionByMultipleSelect(0, D.instance.movingDistance);
                    }),
                    n.preventDefault());
                  break;
              }
            }));
        }),
        t
      );
    })();
  function Xi(t) {
    this.getHtml(t).hiwprint();
  }
  function Yi(t, e, i) {
    $.extend({}, t || {}).imgToBase64 = !0;
    var n = new PrintTemplate({});
    (n.on("printSuccess", e), n.on("printError", i), n.printByHtml2(this.getHtml(t), t.options));
  }
  function qi(t) {
    var e;
    return (
      t &&
        t.templates &&
        t.templates.forEach(function (i) {
          var n = $.extend({}, i.options || {});
          (t.imgToBase64 && (n.imgToBase64 = !0),
            e
              ? e.append(i.template.getHtml(i.data, n).html())
              : (e = i.template.getHtml(i.data, n)));
        }),
      e
    );
  }
  function Ui(t) {
    (D.instance.init(t),
      D.instance.providers.forEach(function (e) {
        e.addElementTypes(He.instance);
      }));
  }
  var Oe = C,
    Ki = (function () {
      function t(e) {
        var i = this;
        ((this.tempImageBase64 = {}),
          (this.id = Oe.instance.guid()),
          Oe.instance.setPrintTemplateById(this.id, this));
        var n = e || {};
        this.printPanels = [];
        var o = new Xe(n.template || []);
        (n.template &&
          o.panels.forEach(function (r) {
            i.printPanels.push(new Ye(r, i.id));
          }),
          n.fields && (this.fields = n.fields),
          n.settingContainer && new Wi(this, n.settingContainer),
          n.paginationContainer &&
            ((this.printPaginationCreator = new Gi(n.paginationContainer, this)),
            this.printPaginationCreator.buildPagination()),
          this.initAutoSave());
      }
      return (
        (t.prototype.design = function (e, i) {
          var n = this;
          if (
            (i || (i = {}),
            this.printPanels.length === 0 && this.printPanels.push(this.createDefaultPanel()),
            !e)
          )
            throw new Error("options.container can not be empty");
          (this.createContainer(e),
            this.printPanels.forEach(function (o, r) {
              (n.container.append(o.getTarget()), r > 0 && o.disable(), o.design(i));
            }),
            this.selectPanel(0));
        }),
        (t.prototype.getSimpleHtml = function (e, i) {
          var n = this;
          i || (i = {});
          var o = $('<div class="kuprint-printTemplate"></div>');
          return (
            e && e.constructor === Array
              ? e.forEach(function (r) {
                  r &&
                    n.printPanels.forEach(function (a) {
                      o.append(a.getHtml(r, i));
                    });
                })
              : this.printPanels.forEach(function (r) {
                  o.append(r.getHtml(e, i));
                }),
            i && i.imgToBase64 && this.transformImg(o.find("img")),
            o
          );
        }),
        (t.prototype.getHtml = function (e, i) {
          return (e || (e = {}), this.getSimpleHtml(e, i));
        }),
        (t.prototype.getJointHtml = function (e, i, n) {
          var o = $('<div class="kuprint-printTemplate"></div>'),
            r = [];
          return (
            this.printPanels.forEach(function (a) {
              o.append(a.getHtml(e, i, r, void 0, n));
            }),
            o
          );
        }),
        (t.prototype.setPaper = function (e, i) {
          if (/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(e))
            this.editingPanel.resize(void 0, parseFloat(e), parseFloat(i), !1);
          else {
            var n = Oe.instance[e];
            if (!n) throw new Error("not found pagetype:" + (e || ""));
            this.editingPanel.resize(e, n.width, n.height, !1);
          }
        }),
        (t.prototype.rotatePaper = function () {
          this.editingPanel.rotatePaper();
        }),
        (t.prototype.addPrintPanel = function (e, i) {
          var n = e ? new Ye(new Me(e), this.id) : this.createDefaultPanel();
          return (
            e && (e.index = this.printPanels.length),
            i && (this.container.append(n.getTarget()), n.design()),
            this.printPanels.push(n),
            i && this.selectPanel(n.index),
            n
          );
        }),
        (t.prototype.selectPanel = function (e) {
          var i = this;
          this.printPanels.forEach(function (n, o) {
            e === o ? (n.enable(), (i.editingPanel = n)) : n.disable();
          });
        }),
        (t.prototype.deletePanel = function (e) {
          (this.printPanels[e].clear(),
            this.printPanels[e].getTarget().remove(),
            this.printPanels.splice(e, 1));
        }),
        (t.prototype.getPaneltotal = function () {
          return this.printPanels.length;
        }),
        (t.prototype.createDefaultPanel = function () {
          return new Ye(new Me({ index: this.printPanels.length, paperType: "A4" }), this.id);
        }),
        (t.prototype.createContainer = function (e) {
          e
            ? ((this.container = $(e)), this.container.addClass("kuprint-printTemplate"))
            : (this.container = $('<div class="kuprint-printTemplate"></div>'));
        }),
        (t.prototype.getJsonTid = function () {
          var e = [];
          return (
            this.printPanels.forEach(function (i) {
              i.getPanelEntity().printElements.length && e.push(i.getPanelEntity());
            }),
            new Xe({ panels: e })
          );
        }),
        (t.prototype.getJson = function () {
          var e = [];
          return (
            this.printPanels.forEach(function (i) {
              e.push(i.getPanelEntity(!0));
            }),
            new Xe({ panels: e })
          );
        }),
        (t.prototype.getPrintElementSelectEventKey = function () {
          return "PrintElementSelectEventKey_" + this.id;
        }),
        (t.prototype.getBuildCustomOptionSettingEventKey = function () {
          return "BuildCustomOptionSettingEventKey_" + this.id;
        }),
        (t.prototype.clear = function () {
          (this.printPanels.forEach(function (e) {
            if ((e.clear(), e.index > 0)) {
              var i = e.getTarget();
              i && i.length && i.remove();
            }
          }),
            (this.printPanels = [this.printPanels[0]]),
            this.printPaginationCreator && this.printPaginationCreator.buildPagination());
        }),
        (t.prototype.getPaperType = function (e) {
          return (e == null && (e = 0), this.printPanels[0].paperType);
        }),
        (t.prototype.getOrient = function (e) {
          return (
            e == null && (e = 0), this.printPanels[e].height > this.printPanels[e].width ? 1 : 2
          );
        }),
        (t.prototype.getPrintStyle = function (e) {
          return this.printPanels[e].getPrintStyle();
        }),
        (t.prototype.print = function (e, i) {
          (e || (e = {}), this.getHtml(e, i).hiwprint());
        }),
        (t.prototype.print2 = function (e, i) {
          if ((e || (e = {}), i || (i = {}), this.clientIsOpened())) {
            var n = this,
              o = 0,
              r = {},
              a = $("link[media=print]").length > 0 ? $("link[media=print]") : $("link");
            a.each(function (p, s) {
              var l = new XMLHttpRequest();
              (l.open("GET", $(s).attr("href")),
                (l.onreadystatechange = function () {
                  if (
                    l.readyState === 4 &&
                    l.status === 200 &&
                    ((r[p + ""] =
                      '<style rel="stylesheet" type="text/css">' + l.responseText + "</style>"),
                    o++,
                    o === a.length)
                  ) {
                    for (var u = "", h = 0; h < a.length; h++) u += r[h + ""];
                    n.sentToClient(u, e, i);
                  }
                }),
                l.send());
            });
          } else alert("连接客户端失败");
        }),
        (t.prototype.imageToBase64 = function (e) {
          var i = e.attr("src");
          if (i.indexOf("base64") === -1)
            try {
              if (!this.tempImageBase64[i]) {
                var n = document.createElement("canvas"),
                  o = new Image();
                ((o.src = e.attr("src")),
                  (n.width = o.width),
                  (n.height = o.height),
                  n.getContext("2d").drawImage(o, 0, 0),
                  i && (this.tempImageBase64[i] = n.toDataURL("image/png")));
              }
              e.attr("src", this.tempImageBase64[i]);
            } catch {
              try {
                this.xhrLoadImage(e);
              } catch (a) {
                console.log(a);
              }
            }
        }),
        (t.prototype.xhrLoadImage = function () {}),
        (t.prototype.sentToClient = function (e, i, n) {
          i || (i = {});
          var o = $.extend({}, n || {});
          o.imgToBase64 = !0;
          var r = e + this.getHtml(i, o)[0].outerHTML;
          ((o.id = Oe.instance.guid()),
            (o.html = r),
            (o.templateId = this.id),
            window.hiwebSocket.send(o));
        }),
        (t.prototype.printByHtml = function (e) {
          $(e).hiwprint();
        }),
        (t.prototype.printByHtml2 = function (e, i) {
          if ((i || (i = {}), this.clientIsOpened())) {
            var n = this,
              o = 0,
              r = {},
              a = $("link[media=print]").length > 0 ? $("link[media=print]") : $("link");
            a.each(function (p, s) {
              var l = new XMLHttpRequest();
              (l.open("GET", $(s).attr("href")),
                (l.onreadystatechange = function () {
                  if (
                    l.readyState === 4 &&
                    l.status === 200 &&
                    ((r[p + ""] =
                      '<style rel="stylesheet" type="text/css">' + l.responseText + "</style>"),
                    o++,
                    o === a.length)
                  ) {
                    for (var u = "", h = 0; h < a.length; h++) u += r[h + ""];
                    var d = u + $(e)[0].outerHTML,
                      c = $.extend({}, i || {});
                    ((c.id = Oe.instance.guid()),
                      (c.html = d),
                      (c.templateId = n.id),
                      window.hiwebSocket.send(c));
                  }
                }),
                l.send());
            });
          } else alert("连接客户端失败");
        }),
        (t.prototype.deletePrintElement = function (e) {
          this.printPanels.forEach(function (i) {
            i.deletePrintElement(e);
          });
        }),
        (t.prototype.transformImg = function (e) {
          var i = this;
          e.each(function (n, o) {
            i.imageToBase64($(o));
          });
        }),
        (t.prototype.toPdf = function (e, i, n) {
          var o = this;
          if (this.printPanels.length) {
            var r = f.mm.toPt(this.printPanels[0].width),
              a = f.mm.toPt(this.printPanels[0].height),
              p = $.extend({ scale: 2, width: f.pt.toPx(r), x: 0, y: 0, useCORS: !0 }, n || {}),
              s = new window.jsPDF({
                orientation: this.getOrient(0) === 1 ? "portrait" : "landscape",
                unit: "pt",
                format: this.printPanels[0].paperType
                  ? this.printPanels[0].paperType.toLocaleLowerCase()
                  : [r, a],
              }),
              l = this.getHtml(e, n);
            this.createTempContainer();
            var u = this.getTempContainer();
            (this.svg2canvas(l), u.html(l[0]));
            var h = u.find(".kuprint-printPanel .kuprint-printPaper").length;
            ($(l).css("position:fixed"),
              window.html2canvas(l[0], p).then(function (d) {
                var c = d.getContext("2d");
                ((c.mozImageSmoothingEnabled = !1),
                  (c.webkitImageSmoothingEnabled = !1),
                  (c.msImageSmoothingEnabled = !1),
                  (c.imageSmoothingEnabled = !1));
                for (var m = d.toDataURL("image/jpeg"), y = 0; y < h; y++)
                  (s.addImage(m, "JPEG", 0, 0 - y * a, r, h * a), y < h - 1 && s.addPage());
                (o.removeTempContainer(), i.indexOf(".pdf") > -1 ? s.save(i) : s.save(i + ".pdf"));
              }));
          }
        }),
        (t.prototype.createTempContainer = function () {
          (this.removeTempContainer(),
            $("body").prepend(
              $(
                '<div class="kuprint_temp_Container" style="overflow:hidden;height:0px;box-sizing:border-box;"></div>',
              ),
            ));
        }),
        (t.prototype.removeTempContainer = function () {
          $(".kuprint_temp_Container").remove();
        }),
        (t.prototype.getTempContainer = function () {
          return $(".kuprint_temp_Container");
        }),
        (t.prototype.svg2canvas = function (e) {
          e.find("svg").each(function (i, n) {
            var o = n.parentNode,
              r = document.createElement("canvas"),
              a = new XMLSerializer().serializeToString(n);
            (window.canvg(r, a),
              $(n).before(r),
              o.removeChild(n),
              $(r).css("width", "100%").css("height", "100%"));
          });
        }),
        (t.prototype.on = function (e, i) {
          f.event.on(e + "_" + this.id, i);
        }),
        (t.prototype.clientIsOpened = function () {
          return window.hiwebSocket.opened;
        }),
        (t.prototype.getPrinterList = function () {
          return window.hiwebSocket.getPrinterList() || [];
        }),
        (t.prototype.getElementByTid = function (e, i) {
          return (i == null && (i = 0), this.printPanels[i].getElementByTid(e));
        }),
        (t.prototype.getElementByName = function (e, i) {
          return (i == null && (i = 0), this.printPanels[i].getElementByName(e));
        }),
        (t.prototype.getPanel = function (e) {
          return (e == null && (e = 0), this.printPanels[e]);
        }),
        (t.prototype.loadAllImages = function (e, i, n) {
          var o = this;
          n == null && (n = 0);
          for (var r = e[0].getElementsByTagName("img"), a = !0, p = 0; p < r.length; p++) {
            var s = r[p];
            s.src &&
              s.src !== window.location.href &&
              s.src.indexOf("base64") === -1 &&
              ((s && s.naturalWidth !== void 0 && s.naturalWidth !== 0 && s.complete) || (a = !1));
          }
          (n++,
            !a && n < 10
              ? setTimeout(function () {
                  o.loadAllImages(e, i, n);
                }, 500)
              : i());
        }),
        (t.prototype.setFields = function (e) {
          this.fields = e;
        }),
        (t.prototype.getFields = function () {
          return this.fields;
        }),
        (t.prototype.getFieldsInPanel = function () {
          var e = [];
          return (
            this.printPanels.forEach(function (i) {
              e = e.concat(i.getFieldsInPanel());
            }),
            e
          );
        }),
        (t.prototype.initAutoSave = function () {
          var e = this;
          this.autoSave &&
            f.event.on("kuprintTemplateDataChanged_" + this.id, function () {
              window.hiLocalStorage.saveLocalData(
                e.autoSaveKey || "kuprintAutoSave",
                JSON.stringify(e.autoSaveMode === 1 ? e.getJson() : e.getJsonTid()),
              );
            });
        }),
        t
      );
    })();
  ((function (t) {
    ((t.kuprintparser = {
      parseOptions: function (e, i) {
        var n = t(e),
          o = {},
          r = t.trim(n.attr("data-options"));
        if (
          (r &&
            (r.substring(0, 1) !== "{" && (r = "{" + r + "}"), (o = new Function("return " + r)())),
          i)
        ) {
          for (var a = {}, p = 0; p < i.length; p++) {
            var s = i[p];
            if (typeof s == "string")
              a[s] =
                s === "width" || s === "height" || s === "left" || s === "top"
                  ? parseInt(e.style[s]) || void 0
                  : n.attr(s);
            else
              for (var l in s) {
                var u = s[l];
                u === "boolean"
                  ? (a[l] = n.attr(l) ? n.attr(l) === "true" : void 0)
                  : u === "number" &&
                    (a[l] = n.attr(l) === "0" ? 0 : parseFloat(n.attr(l)) || void 0);
              }
          }
          t.extend(o, a);
        }
        return o;
      },
    }),
      (t.fn.dragLengthC = function (e, i) {
        return i.moveUnit === "pt" ? t.fn.dragLengthCNum(e, i) + "pt" : t.fn.dragLengthCNum(e, i);
      }),
      (t.fn.dragLengthCNum = function (e, i) {
        var n = 3;
        if (i.moveUnit === "pt") {
          var o = 0.75 * e;
          return (i.minMove && (n = i.minMove), Math.round(o / n) * n);
        }
        return Math.round(o / n) * n;
      }));
  })(jQuery),
    (function (t) {
      function e(a) {
        var p = t.data(a.data.target, "hidraggable"),
          s = p.options,
          l = p.proxy,
          u = a.data,
          h = u.startLeft + a.pageX - u.startX,
          d = u.startTop + a.pageY - u.startY;
        (l &&
          (l.parent()[0] === document.body
            ? ((h = s.deltaX != null ? a.pageX + s.deltaX : a.pageX - a.data.offsetWidth),
              (d = s.deltaY != null ? a.pageY + s.deltaY : a.pageY - a.data.offsetHeight))
            : (s.deltaX != null && (h += a.data.offsetWidth + s.deltaX),
              s.deltaY != null && (d += a.data.offsetHeight + s.deltaY))),
          a.data.parent !== document.body &&
            ((h += t(a.data.parent).scrollLeft()), (d += t(a.data.parent).scrollTop())),
          s.axis === "h" ? (u.left = h) : (s.axis === "v" || (u.left = h), (u.top = d)));
      }
      function i(a) {
        var p = t.data(a.data.target, "hidraggable"),
          s = p.options,
          l = p.proxy;
        (l || (l = t(a.data.target)),
          l.css({ left: t.fn.dragLengthC(a.data.left, s), top: t.fn.dragLengthC(a.data.top, s) }),
          t("body").css("cursor", s.cursor));
      }
      function n(a) {
        t.fn.hidraggable.isDragging = !0;
        var p = t.data(a.data.target, "hidraggable"),
          s = p.options;
        p.hidroppables = t(".hidroppable")
          .filter(function () {
            return a.data.target !== this;
          })
          .filter(function () {
            var u = t.data(this, "hidroppable").options.accept;
            return (
              !u ||
              t(u).filter(function () {
                return this === a.data.target;
              }).length > 0
            );
          });
        var l = p.proxy;
        return (
          l ||
            (s.proxy
              ? ((l =
                  s.proxy === "clone"
                    ? t(a.data.target).clone().insertAfter(a.data.target)
                    : s.proxy.call(a.data.target, a.data.target)),
                (p.proxy = l))
              : (l = t(a.data.target))),
          l.css("position", "absolute"),
          e(a),
          i(a),
          s.onStartDrag.call(a.data.target, a),
          !1
        );
      }
      function o(a) {
        var p = t.data(a.data.target, "hidraggable");
        (e(a),
          p.options.onDrag.call(
            a.data.target,
            a,
            t.fn.dragLengthCNum(a.data.left, p.options),
            t.fn.dragLengthCNum(a.data.top, p.options),
          ) !== 0 && i(a));
        var s = a.data.target;
        return (
          p.hidroppables.each(function () {
            var l = t(this);
            if (!l.hidroppable("options").disabled) {
              var u = l.offset();
              a.pageX > u.left &&
              a.pageX < u.left + l.outerWidth() &&
              a.pageY > u.top &&
              a.pageY < u.top + l.outerHeight()
                ? (this.entered || (t(this).trigger("_dragenter", [s]), (this.entered = !0)),
                  t(this).trigger("_dragover", [s]))
                : this.entered && (t(this).trigger("_dragleave", [s]), (this.entered = !1));
            }
          }),
          !1
        );
      }
      function r(a) {
        ((t.fn.hidraggable.isDragging = !1), o(a));
        var p = t.data(a.data.target, "hidraggable"),
          s = p.proxy,
          l = p.options;
        if (l.revert)
          if (c() === 1)
            t(a.data.target).css({
              position: a.data.startPosition,
              left: a.data.startLeft,
              top: a.data.startTop,
            });
          else if (s) {
            var u, h;
            (s.parent()[0] === document.body
              ? ((u = a.data.startX - a.data.offsetWidth),
                (h = a.data.startY - a.data.offsetHeight))
              : ((u = a.data.startLeft), (h = a.data.startTop)),
              s.animate({ left: u, top: h }, function () {
                d();
              }));
          } else
            t(a.data.target).animate({ left: a.data.startLeft, top: a.data.startTop }, function () {
              t(a.data.target).css("position", a.data.startPosition);
            });
        else
          (t(a.data.target).css({
            position: "absolute",
            left: t.fn.dragLengthC(a.data.left, l),
            top: t.fn.dragLengthC(a.data.top, l),
          }),
            c());
        function d() {
          s && (s.remove(), (p.proxy = null));
        }
        function c() {
          var m = !1;
          return (
            p.hidroppables.each(function () {
              var y = t(this);
              if (!y.hidroppable("options").disabled) {
                var v = y.offset();
                if (
                  a.pageX > v.left &&
                  a.pageX < v.left + y.outerWidth() &&
                  a.pageY > v.top &&
                  a.pageY < v.top + y.outerHeight()
                )
                  return (
                    l.revert &&
                      t(a.data.target).css({
                        position: a.data.startPosition,
                        left: a.data.startLeft,
                        top: a.data.startTop,
                      }),
                    t(this).trigger("_drop", [a.data.target]),
                    d(),
                    (m = !0),
                    (this.entered = !1),
                    !1
                  );
              }
            }),
            !m && !l.revert && d(),
            m
          );
        }
        try {
          l.onStopDrag.call(a.data.target, a);
        } finally {
          t(document).unbind(".hidraggable");
        }
        return (
          setTimeout(function () {
            t("body").css("cursor", "");
          }, 100),
          !1
        );
      }
      ((t.fn.hidraggable = function (a, p) {
        return typeof a == "string"
          ? t.fn.hidraggable.methods[a](this, p)
          : this.each(function () {
              var s = t.data(this, "hidraggable"),
                l;
              s
                ? (s.handle.unbind(".hidraggable"), (l = t.extend(s.options, a)))
                : (l = t.extend(
                    {},
                    t.fn.hidraggable.defaults,
                    t.fn.hidraggable.parseOptions(this),
                    a || {},
                  ));
              var u = l.handle
                ? typeof l.handle == "string"
                  ? t(l.handle, this)
                  : l.handle
                : t(this);
              function h(d) {
                var c = t.data(d.data.target, "hidraggable"),
                  m = c.handle,
                  y = t(m).offset(),
                  v = t(m).outerWidth(),
                  P = t(m).outerHeight(),
                  x = d.pageY - y.top,
                  w = y.left + v - d.pageX,
                  M = y.top + P - d.pageY,
                  V = d.pageX - y.left;
                return Math.min(x, w, M, V) > c.options.edge;
              }
              if ((t.data(this, "hidraggable", { options: l, handle: u }), l.disabled)) {
                t(this).css("cursor", "");
                return;
              }
              u.unbind(".hidraggable")
                .bind("mousemove.hidraggable", { target: this }, function (d) {
                  if (!t.fn.hidraggable.isDragging) {
                    var c = t.data(d.data.target, "hidraggable").options;
                    t(this).css("cursor", h(d) ? c.cursor : "");
                  }
                })
                .bind("mouseleave.hidraggable", { target: this }, function (d) {
                  t(this).css("cursor", "");
                })
                .bind("mousedown.hidraggable", { target: this }, function (d) {
                  if (h(d)) {
                    t(this).css("cursor", "");
                    var c = t(d.data.target).position(),
                      m = t(d.data.target).offset(),
                      y = {
                        startPosition: t(d.data.target).css("position"),
                        startLeft: c.left,
                        startTop: c.top,
                        left: c.left,
                        top: c.top,
                        startX: d.pageX,
                        startY: d.pageY,
                        offsetWidth: d.pageX - m.left,
                        offsetHeight: d.pageY - m.top,
                        target: d.data.target,
                        parent: t(d.data.target).parent()[0],
                      };
                    t.extend(d.data, y);
                    var v = t
                      .data(d.data.target, "hidraggable")
                      .options.onBeforeDrag.call(d.data.target, d);
                    v === 0 ||
                      v === !1 ||
                      (t(document).bind("mousedown.hidraggable", d.data, n),
                      t(document).bind("mousemove.hidraggable", d.data, o),
                      t(document).bind("mouseup.hidraggable", d.data, r));
                  }
                });
            });
      }),
        (t.fn.hidraggable.methods = {
          options: function (a) {
            return t.data(a[0], "hidraggable").options;
          },
          proxy: function (a) {
            return t.data(a[0], "hidraggable").proxy;
          },
          enable: function (a) {
            return a.each(function () {
              t(this).hidraggable({ disabled: !1 });
            });
          },
          disable: function (a) {
            return a.each(function () {
              t(this).hidraggable({ disabled: !0 });
            });
          },
        }),
        (t.fn.hidraggable.parseOptions = function (a) {
          var p = t(a);
          return t.extend(
            {},
            t.kuprintparser.parseOptions(a, [
              "cursor",
              "handle",
              "axis",
              { revert: "boolean", deltaX: "number", deltaY: "number", edge: "number" },
            ]),
            { disabled: !!p.attr("disabled") || void 0 },
          );
        }),
        (t.fn.hidraggable.defaults = {
          proxy: null,
          revert: !1,
          cursor: "move",
          deltaX: null,
          deltaY: null,
          handle: null,
          disabled: !1,
          edge: 0,
          axis: null,
          onBeforeDrag: function () {},
          onStartDrag: function () {},
          onDrag: function () {},
          onStopDrag: function () {},
        }),
        (t.fn.hidraggable.isDragging = !1));
    })(jQuery),
    (function (t) {
      ((t.fn.hidroppable = function (e, i) {
        return typeof e == "string"
          ? t.fn.hidroppable.methods[e](this, i)
          : ((e = e || {}),
            this.each(function () {
              var n = t.data(this, "hidroppable");
              if (n) t.extend(n.options, e);
              else {
                var o = this;
                (t(o).addClass("hidroppable"),
                  t(o).bind("_dragenter", function (r, a) {
                    t.data(o, "hidroppable").options.onDragEnter.apply(o, [r, a]);
                  }),
                  t(o).bind("_dragleave", function (r, a) {
                    t.data(o, "hidroppable").options.onDragLeave.apply(o, [r, a]);
                  }),
                  t(o).bind("_dragover", function (r, a) {
                    t.data(o, "hidroppable").options.onDragOver.apply(o, [r, a]);
                  }),
                  t(o).bind("_drop", function (r, a) {
                    t.data(o, "hidroppable").options.onDrop.apply(o, [r, a]);
                  }),
                  t.data(this, "hidroppable", {
                    options: t.extend(
                      {},
                      t.fn.hidroppable.defaults,
                      t.fn.hidroppable.parseOptions(this),
                      e,
                    ),
                  }));
              }
            }));
      }),
        (t.fn.hidroppable.methods = {
          options: function (e) {
            return t.data(e[0], "hidroppable").options;
          },
          enable: function (e) {
            return e.each(function () {
              t(this).hidroppable({ disabled: !1 });
            });
          },
          disable: function (e) {
            return e.each(function () {
              t(this).hidroppable({ disabled: !0 });
            });
          },
        }),
        (t.fn.hidroppable.parseOptions = function (e) {
          var i = t(e);
          return t.extend({}, t.kuprintparser.parseOptions(e, ["accept"]), {
            disabled: !!i.attr("disabled") || void 0,
          });
        }),
        (t.fn.hidroppable.defaults = {
          accept: null,
          disabled: !1,
          onDragEnter: function () {},
          onDragOver: function () {},
          onDragLeave: function () {},
          onDrop: function () {},
        }));
    })(jQuery),
    (function (t) {
      var e = { maxPanelIndex: 0 };
      function i(n) {
        ((this.options = t.data(n.target, "hireizeable").options), this.init(n.target));
      }
      ((i.prototype = {
        numHandlerText: function (n) {
          return this.numHandler(n) + "pt";
        },
        numHandler: function (n) {
          var o = 1.5,
            r = 0.75 * n;
          return (this.options.minResize && (o = this.options.minResize), Math.round(r / o) * o);
        },
        init: function (n) {
          this.initResizeBox(n);
        },
        initResizeBox: function (n) {
          var o = this;
          (t(n).each(function () {
            e.maxPanelIndex += 1;
            var r;
            (o.options.noContainer
              ? (r = t(n))
              : ((r = t("<div panelIndex=" + e.maxPanelIndex + ' class="resize-panel"></div>')),
                r.css({
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                  position: "absolute",
                  "background-color": "rgba(0,0,0,0.5)",
                  cursor: "move",
                  display: "none",
                })),
              o.appendHandler(r, t(this)));
            var a = {
                n: {
                  name: "n",
                  target: t(
                    '<div class="n resizebtn" style="cursor:n-resize;top:-12px;margin-left:-4px;left:50%;"></div>',
                  ),
                },
                s: {
                  name: "s",
                  target: t(
                    '<div class="s resizebtn" style="cursor:s-resize;bottom:-12px;margin-left:-4px;left:50%;"></div>',
                  ),
                },
                w: {
                  name: "w",
                  target: t(
                    '<div class="w resizebtn" style="cursor:w-resize;left:-12px;margin-top:-4px;top:50%;"></div>',
                  ),
                },
                e: {
                  name: "e",
                  target: t(
                    '<div class="e resizebtn" style="cursor:e-resize;top:50%;margin-top:-4px;right:-12px;"></div>',
                  ),
                },
                ne: {
                  name: "ne",
                  target: t(
                    '<div class="ne resizebtn" style="cursor:ne-resize;top:-12px;right:-12px;"></div>',
                  ),
                },
                nw: {
                  name: "nw",
                  target: t(
                    '<div class="nw resizebtn" style="cursor:nw-resize;top:-12px;left:-12px;"></div>',
                  ),
                },
                se: {
                  name: "se",
                  target: t(
                    '<div class="se resizebtn" style="cursor:se-resize;bottom:-12px;right:-12px;"></div>',
                  ),
                },
                sw: {
                  name: "sw",
                  target: t(
                    '<div class="sw resizebtn" style="cursor:sw-resize;bottom:-12px;left:-12px;"></div>',
                  ),
                },
              },
              p = [a.n, a.s, a.w, a.e, a.ne, a.nw, a.se, a.sw];
            function s() {
              var h = [],
                d = o.options.showPoints;
              return (
                t.each(p, function (c, m) {
                  t.inArray(m.name, d) > -1 && h.push(m.target);
                }),
                h
              );
            }
            var l = s();
            (t.each(l, function (h, d) {
              d.css({
                position: "absolute",
                width: "8px",
                height: "8px",
                background: "#ff6600",
                "border-radius": "50%",
              });
            }),
              o.appendHandler(l, r),
              o.bindResizeEvent(r, t(this)));
            var u = t(this);
            (t(r).on("mousedown", ".resizebtn", function () {
              u.addClass("resizeing");
            }),
              t(".easyui-droppable").on("mouseup", function () {
                u.removeClass("resizeing");
              }),
              o.bindTrigger(t(this)));
          }),
            this.bindHidePanel());
        },
        appendHandler: function (n, o) {
          for (var r = 0; r < n.length; r++) o.append(n[r]);
        },
        triggerResize: function (n) {
          (n.siblings().children("div[panelindex]").css({ display: "none" }),
            n.children("div[panelindex]").css({ display: "block" }));
        },
        bindResizeEvent: function (n, o) {
          var r = this,
            a = 0,
            p = 0,
            s = n.width(),
            l = n.height(),
            u = n.offset().left,
            h = n.offset().top,
            d = r.options.noContainer ? t(o) : n.parent(),
            c = !1,
            m = !1,
            y = !1,
            v = !1,
            P = !1,
            x = !1,
            w = !1,
            M = !1,
            V = !1;
          (n.on("mousedown", ".e", function (T) {
            ((a = T.pageX), (s = n.width()), (c = !0));
          }),
            n.on("mousedown", ".s", function (T) {
              ((p = T.pageY), (l = n.height()), (m = !0));
            }),
            n.on("mousedown", ".w", function (T) {
              ((a = T.pageX), (s = n.width()), (y = !0), (u = d.offset().left));
            }),
            n.on("mousedown", ".n", function (T) {
              ((p = T.pageY), (l = n.height()), (v = !0), (h = d.offset().top));
            }),
            n.on("mousedown", ".ne", function (T) {
              ((a = T.pageX),
                (p = T.pageY),
                (s = n.width()),
                (l = n.height()),
                (P = !0),
                (h = d.offset().top));
            }),
            n.on("mousedown", ".nw", function (T) {
              ((a = T.pageX),
                (p = T.pageY),
                (s = n.width()),
                (l = n.height()),
                (h = d.offset().top),
                (u = d.offset().left),
                (x = !0));
            }),
            n.on("mousedown", ".se", function (T) {
              ((a = T.pageX), (p = T.pageY), (s = n.width()), (l = n.height()), (w = !0));
            }),
            n.on("mousedown", ".sw", function (T) {
              ((a = T.pageX),
                (p = T.pageY),
                (s = n.width()),
                (l = n.height()),
                (M = !0),
                (u = d.offset().left));
            }),
            n.on("mousedown", function (T) {
              (r.options.onBeforeResize(),
                (a = T.pageX),
                (p = T.pageY),
                (h = d.offset().top),
                (u = d.offset().left),
                (V = !1));
            }),
            t(r.options.stage)
              .on("mousemove", function (T) {
                var O = T.pageX - a,
                  I = T.pageY - p;
                c
                  ? (n.css({ width: "100%" }),
                    d.css({ width: r.numHandlerText(s + O) }),
                    r.options.onResize(T, void 0, r.numHandler(s + O), void 0, void 0))
                  : m
                    ? (n.css({ height: "100%" }),
                      d.css({ height: r.numHandlerText(l + I) }),
                      r.options.onResize(T, r.numHandler(l + I), void 0, void 0, void 0))
                    : y
                      ? (n.css({ width: "100%" }),
                        d.css({ width: r.numHandlerText(s - O), left: r.numHandlerText(u + O) }),
                        r.options.onResize(
                          T,
                          void 0,
                          r.numHandler(s - O),
                          void 0,
                          r.numHandler(u + O),
                        ))
                      : v
                        ? (n.css({ height: "100%" }),
                          d.css({ height: r.numHandlerText(l - I), top: r.numHandlerText(h + I) }),
                          r.options.onResize(
                            T,
                            r.numHandler(l - I),
                            void 0,
                            r.numHandler(h + I),
                            void 0,
                          ))
                        : P
                          ? (n.css({ height: "100%", width: "100%" }),
                            d.css({
                              height: r.numHandlerText(l - I),
                              top: r.numHandlerText(h + I),
                              width: r.numHandlerText(s + O),
                            }),
                            r.options.onResize(
                              T,
                              r.numHandler(l - I),
                              r.numHandler(s + O),
                              r.numHandler(h + I),
                              void 0,
                            ))
                          : x
                            ? (n.css({ height: "100%", width: "100%" }),
                              d.css({
                                height: r.numHandlerText(l - I),
                                top: r.numHandlerText(h + I),
                                width: r.numHandlerText(s - O),
                                left: r.numHandlerText(u + O),
                              }),
                              r.options.onResize(
                                T,
                                r.numHandler(l - I),
                                r.numHandler(s - O),
                                r.numHandler(h + I),
                                r.numHandler(u + O),
                              ))
                            : w
                              ? (n.css({ width: "100%", height: "100%" }),
                                d.css({
                                  width: r.numHandlerText(s + O),
                                  height: r.numHandlerText(l + I),
                                }),
                                r.options.onResize(
                                  T,
                                  r.numHandler(l + I),
                                  r.numHandler(s + O),
                                  void 0,
                                  void 0,
                                ))
                              : M
                                ? (n.css({ width: "100%", height: "100%" }),
                                  d.css({
                                    width: r.numHandlerText(s - O),
                                    left: r.numHandlerText(u + O),
                                    height: r.numHandlerText(l + I),
                                  }),
                                  r.options.onResize(
                                    T,
                                    r.numHandler(l + I),
                                    r.numHandler(s - O),
                                    void 0,
                                    r.numHandler(u + O),
                                  ))
                                : V &&
                                  (d.css({
                                    left: r.numHandlerText(u + O),
                                    top: r.numHandlerText(h + I),
                                  }),
                                  r.options.onResize(
                                    T,
                                    void 0,
                                    void 0,
                                    r.numHandler(h + I),
                                    r.numHandler(u + O),
                                  ));
              })
              .on("mouseup", function () {
                ((c = m = y = v = !1), (P = x = w = M = !1), (V = !1), r.options.onStopResize());
              }));
        },
        bindTrigger: function (n) {
          var o = this;
          n.on("click", function (r) {
            (r.stopPropagation(), o.triggerResize(n));
          });
        },
        bindHidePanel: function () {
          if (e.maxPanelIndex < 2) {
            var n = this.options.stage;
            t(n).bind("click", function (o) {
              (o.stopPropagation(), t("div[panelindex]").css({ display: "none" }));
            });
          }
        },
      }),
        t.fn.extend({
          hireizeable: function (n) {
            return this.each(function () {
              var o = t.extend({}, t.fn.hireizeable.defaults, n || {});
              (t.data(this, "hireizeable", { options: o }),
                new i({ target: this, onResize: function () {}, onStopResize: function () {} }));
            });
          },
        }),
        (t.fn.hireizeable.defaults = {
          stage: document,
          reizeUnit: "pt",
          minResize: 1.5,
          showPoints: ["s", "e"],
          noContainer: !1,
          onBeforeResize: function () {},
          onResize: function () {},
          onStopResize: function () {},
          noDrag: !1,
        }));
    })(jQuery),
    (function (t) {
      function e(i, n) {
        this.init(i, n);
      }
      ((e.prototype = {
        init: function (i, n) {
          ((this.ele = i),
            (this.defaults = {
              menu: [{ text: "text", menus: [{}, {}], callback: function () {} }],
              target: function () {},
              width: 100,
              itemHeight: 28,
              bgColor: "#fff",
              color: "#333",
              fontSize: 14,
              hoverBgColor: "#f5f5f5",
            }),
            (this.opts = t.extend(!0, {}, this.defaults, n)),
            (this.random = new Date().getTime() + parseInt(1e3 * Math.random())),
            this.eventBind());
        },
        renderMenu: function (i, n) {
          var o = this,
            r = n;
          if (i && i.length) {
            var a = t('<ul class="hicontextmenu"></ul>');
            (r || (r = a.addClass("hicontextmenuroot")),
              t.each(i, function (p, s) {
                var l = !!s.disable && s.disable(),
                  u = t(
                    '<li class="hicontextmenuitem"><a href="javascript:void(0);"><span>' +
                      (s.text || "") +
                      "</span></a></li>",
                  );
                (l && u.addClass("disable"),
                  s.borderBottom && u.addClass("borderBottom"),
                  s.menus && (u.addClass("hicontextsubmenu"), o.renderMenu(s.menus, u)),
                  s.callback &&
                    u.click(function (h) {
                      (t(this).hasClass("disable") ||
                        (t(".hicontextmenuroot").remove(), s.callback()),
                        h.stopPropagation());
                    }),
                  a.append(u));
              }),
              n && n.append(a));
          }
          n || (t("body").append(r), r.find(".hicontextmenuroot").hide());
        },
        setPosition: function (i) {
          t(".hicontextmenuroot")
            .css({ left: i.pageX + 2, top: i.pageY + 2 })
            .show();
        },
        eventBind: function () {
          var i = this;
          (this.ele.on("contextmenu", function (n) {
            (t(".hicontextmenuroot").remove(),
              n.preventDefault(),
              i.renderMenu(i.opts.menus),
              i.setPosition(n),
              i.opts.target && typeof i.opts.target == "function" && i.opts.target(t(this)));
          }),
            t("body").on("click", function () {
              t(".hicontextmenuroot").remove();
            }));
        },
      }),
        (t.fn.hicontextMenu = function (i) {
          return (new e(this, i), this);
        }));
    })(jQuery),
    (window.hiwebSocket = (function () {
      var t = "connected",
        e = "reconnecting";
      return {
        opened: !1,
        name: "webSockets",
        reconnectTimeout: 6e4,
        reconnectWindowSetTimeout: null,
        reconnectDelay: 2e3,
        state: null,
        supportsKeepAlive: function () {
          return !0;
        },
        hasIo: function () {
          return window.io;
        },
        send: function (i) {
          try {
            this.socket.emit("news", i);
          } catch (n) {
            console.log("send data error:" + (i || "") + JSON.stringify(n));
          }
        },
        getPrinterList: function () {
          return this.printerList;
        },
        start: function () {
          var i = this;
          window.WebSocket
            ? this.socket ||
              ((this.socket = io("http://localhost:17521", { reconnectionAttempts: 5 })),
              this.socket.on("connect", function () {
                ((i.opened = !0),
                  console.log("Websocket opened."),
                  i.socket.on("successs", function (n) {
                    f.event.trigger("printSuccess_" + n.templateId, n);
                  }),
                  i.socket.on("error", function (n) {
                    f.event.trigger("printError_" + n.templateId, n);
                  }),
                  i.socket.on("printerList", function (n) {
                    i.printerList = n;
                  }),
                  (i.state = t));
              }),
              this.socket.on("disconnect", function () {
                i.opened = !1;
              }))
            : console.log("WebSocket start fail");
        },
        reconnect: function () {
          (this.state !== t && this.state !== e) ||
            (this.stop(),
            this.ensureReconnectingState() &&
              (console.log("Websocket reconnecting."), this.start()));
        },
        stop: function () {
          this.socket &&
            (console.log("Closing the Websocket."), this.socket.close(), (this.socket = null));
        },
        ensureReconnectingState: function () {
          return ((this.state = e), this.state === e);
        },
      };
    })()),
    (window.hiLocalStorage = (function () {
      var t = window.localStorage || null;
      return {
        saveLocalData: function (e, i) {
          return !!(t && i && (t.setItem(e, i), 1));
        },
        getLocalData: function (e) {
          return t ? t.getItem(e) : null;
        },
        removeItem: function (e) {
          t && t.removeItem(e);
        },
      };
    })()));
  var Ji = {
    init: Ui,
    PrintElementTypeManager: B,
    PrintElementTypeGroup: Vi,
    PrintTemplate: Ki,
    print: Xi,
    print2: Yi,
    getHtml: qi,
  };
  ($(document).ready(function () {
    window.hiwebSocket && hiwebSocket.hasIo() && hiwebSocket.start();
  }),
    (window.kuprint = Ji));
});
