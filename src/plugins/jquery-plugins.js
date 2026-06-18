// ============================================================
// plugins/jquery-plugins.js — jQuery 插件 + WebSocket
// ============================================================

import { hinnn } from "../core/utils.js";
import { PrintElementTypeManager, PrintElementTypeGroup } from "../manager/element-type-manager.js";
import { PrintTemplate } from "../template/template.js";
import {
  PrintPanel,
  kuprint_print,
  kuprint_print2,
  kuprint_getHtml,
  kuprint_init,
} from "../panel/panel.js";

// --- kuprintparser (option parser) ---
(function ($) {
  $.kuprintparser = {
    parseOptions: function (el, keys) {
      var $el = $(el),
        opts = {};
      var dataOpts = $.trim($el.attr("data-options"));
      if (dataOpts) {
        if (dataOpts.substring(0, 1) !== "{") dataOpts = "{" + dataOpts + "}";
        opts = new Function("return " + dataOpts)();
      }
      if (keys) {
        var attrs = {};
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i];
          if (typeof k === "string") {
            attrs[k] =
              k === "width" || k === "height" || k === "left" || k === "top"
                ? parseInt(el.style[k]) || undefined
                : $el.attr(k);
          } else {
            for (var j in k) {
              var type = k[j];
              if (type === "boolean") {
                attrs[j] = $el.attr(j) ? $el.attr(j) === "true" : undefined;
              } else if (type === "number") {
                attrs[j] = $el.attr(j) === "0" ? 0 : parseFloat($el.attr(j)) || undefined;
              }
            }
          }
        }
        $.extend(opts, attrs);
      }
      return opts;
    },
  };
  $.fn.dragLengthC = function (val, opts) {
    return opts.moveUnit === "pt"
      ? $.fn.dragLengthCNum(val, opts) + "pt"
      : $.fn.dragLengthCNum(val, opts);
  };
  $.fn.dragLengthCNum = function (val, opts) {
    var n = 3;
    if (opts.moveUnit === "pt") {
      var raw = 0.75 * val;
      if (opts.minMove) n = opts.minMove;
      return Math.round(raw / n) * n;
    }
    return Math.round(raw / n) * n;
  };
})(jQuery);

// --- hidraggable (drag plugin) ---
(function ($) {
  function calcDrag(e) {
    var d = $.data(e.data.target, "hidraggable"),
      o = d.options,
      proxy = d.proxy,
      r = e.data;
    var left = r.startLeft + e.pageX - r.startX;
    var top = r.startTop + e.pageY - r.startY;
    if (proxy) {
      if (proxy.parent()[0] === document.body) {
        left = o.deltaX != null ? e.pageX + o.deltaX : e.pageX - e.data.offsetWidth;
        top = o.deltaY != null ? e.pageY + o.deltaY : e.pageY - e.data.offsetHeight;
      } else {
        if (o.deltaX != null) left += e.data.offsetWidth + o.deltaX;
        if (o.deltaY != null) top += e.data.offsetHeight + o.deltaY;
      }
    }
    if (e.data.parent !== document.body) {
      left += $(e.data.parent).scrollLeft();
      top += $(e.data.parent).scrollTop();
    }
    if (o.axis === "h") r.left = left;
    else if (o.axis === "v") r.top = top;
    else {
      r.left = left;
      r.top = top;
    }
  }
  function applyDrag(e) {
    var d = $.data(e.data.target, "hidraggable"),
      o = d.options,
      proxy = d.proxy;
    if (!proxy) proxy = $(e.data.target);
    proxy.css({ left: $.fn.dragLengthC(e.data.left, o), top: $.fn.dragLengthC(e.data.top, o) });
    $("body").css("cursor", o.cursor);
  }
  function startDrag(e) {
    $.fn.hidraggable.isDragging = true;
    var d = $.data(e.data.target, "hidraggable"),
      o = d.options;
    var droppables = $(".hidroppable")
      .filter(function () {
        return e.data.target !== this;
      })
      .filter(function () {
        var accept = $.data(this, "hidroppable").options.accept;
        return (
          !accept ||
          $(accept).filter(function () {
            return this === e.data.target;
          }).length > 0
        );
      });
    d.hidroppables = droppables;
    var proxy = d.proxy;
    if (!proxy) {
      if (o.proxy) {
        proxy =
          o.proxy === "clone"
            ? $(e.data.target).clone().insertAfter(e.data.target)
            : o.proxy.call(e.data.target, e.data.target);
        d.proxy = proxy;
      } else {
        proxy = $(e.data.target);
      }
    }
    proxy.css("position", "absolute");
    calcDrag(e);
    applyDrag(e);
    o.onStartDrag.call(e.data.target, e);
    return false;
  }
  function doDrag(e) {
    var d = $.data(e.data.target, "hidraggable");
    calcDrag(e);
    if (
      d.options.onDrag.call(
        e.data.target,
        e,
        $.fn.dragLengthCNum(e.data.left, d.options),
        $.fn.dragLengthCNum(e.data.top, d.options),
      ) !== 0
    ) {
      applyDrag(e);
    }
    var target = e.data.target;
    d.hidroppables.each(function () {
      var $el = $(this);
      if (!$el.hidroppable("options").disabled) {
        var off = $el.offset();
        if (
          e.pageX > off.left &&
          e.pageX < off.left + $el.outerWidth() &&
          e.pageY > off.top &&
          e.pageY < off.top + $el.outerHeight()
        ) {
          if (!this.entered) {
            $(this).trigger("_dragenter", [target]);
            this.entered = true;
          }
          $(this).trigger("_dragover", [target]);
        } else if (this.entered) {
          $(this).trigger("_dragleave", [target]);
          this.entered = false;
        }
      }
    });
    return false;
  }
  function stopDrag(e) {
    $.fn.hidraggable.isDragging = false;
    doDrag(e);
    var d = $.data(e.data.target, "hidraggable"),
      proxy = d.proxy,
      o = d.options;
    if (o.revert) {
      if (drop() === 1) {
        $(e.data.target).css({
          position: e.data.startPosition,
          left: e.data.startLeft,
          top: e.data.startTop,
        });
      } else if (proxy) {
        var left, top;
        if (proxy.parent()[0] === document.body) {
          left = e.data.startX - e.data.offsetWidth;
          top = e.data.startY - e.data.offsetHeight;
        } else {
          left = e.data.startLeft;
          top = e.data.startTop;
        }
        proxy.animate({ left: left, top: top }, function () {
          cleanup();
        });
      } else {
        $(e.data.target).animate({ left: e.data.startLeft, top: e.data.startTop }, function () {
          $(e.data.target).css("position", e.data.startPosition);
        });
      }
    } else {
      $(e.data.target).css({
        position: "absolute",
        left: $.fn.dragLengthC(e.data.left, o),
        top: $.fn.dragLengthC(e.data.top, o),
      });
      drop();
    }
    function cleanup() {
      if (proxy) {
        proxy.remove();
        d.proxy = null;
      }
    }
    function drop() {
      var dropped = false;
      d.hidroppables.each(function () {
        var $el = $(this);
        if (!$el.hidroppable("options").disabled) {
          var off = $el.offset();
          if (
            e.pageX > off.left &&
            e.pageX < off.left + $el.outerWidth() &&
            e.pageY > off.top &&
            e.pageY < off.top + $el.outerHeight()
          ) {
            if (o.revert)
              $(e.data.target).css({
                position: e.data.startPosition,
                left: e.data.startLeft,
                top: e.data.startTop,
              });
            $(this).trigger("_drop", [e.data.target]);
            cleanup();
            dropped = true;
            this.entered = false;
            return false;
          }
        }
      });
      if (!dropped && !o.revert) cleanup();
      return dropped;
    }
    o.onStopDrag.call(e.data.target, e);
    $(document).unbind(".hidraggable");
    setTimeout(function () {
      $("body").css("cursor", "");
    }, 100);
    return false;
  }
  $.fn.hidraggable = function (opts, arg) {
    if (typeof opts === "string") return $.fn.hidraggable.methods[opts](this, arg);
    return this.each(function () {
      var existing = $.data(this, "hidraggable"),
        options;
      if (existing) {
        existing.handle.unbind(".hidraggable");
        options = $.extend(existing.options, opts);
      } else {
        options = $.extend(
          {},
          $.fn.hidraggable.defaults,
          $.fn.hidraggable.parseOptions(this),
          opts || {},
        );
      }
      var handle = options.handle
        ? typeof options.handle === "string"
          ? $(options.handle, this)
          : options.handle
        : $(this);
      function isOverEdge(e) {
        var d = $.data(e.data.target, "hidraggable"),
          h = d.handle;
        var off = $(h).offset(),
          w = $(h).outerWidth(),
          ht = $(h).outerHeight();
        var distTop = e.pageY - off.top,
          distRight = off.left + w - e.pageX;
        var distBottom = off.top + ht - e.pageY,
          distLeft = e.pageX - off.left;
        return Math.min(distTop, distRight, distBottom, distLeft) > d.options.edge;
      }
      $.data(this, "hidraggable", { options: options, handle: handle });
      if (options.disabled) {
        $(this).css("cursor", "");
        return;
      }
      handle
        .unbind(".hidraggable")
        .bind("mousemove.hidraggable", { target: this }, function (e) {
          if (!$.fn.hidraggable.isDragging) {
            var o = $.data(e.data.target, "hidraggable").options;
            $(this).css("cursor", isOverEdge(e) ? o.cursor : "");
          }
        })
        .bind("mouseleave.hidraggable", { target: this }, function (e) {
          $(this).css("cursor", "");
        })
        .bind("mousedown.hidraggable", { target: this }, function (e) {
          if (!isOverEdge(e)) return;
          $(this).css("cursor", "");
          var pos = $(e.data.target).position(),
            off = $(e.data.target).offset();
          var data = {
            startPosition: $(e.data.target).css("position"),
            startLeft: pos.left,
            startTop: pos.top,
            left: pos.left,
            top: pos.top,
            startX: e.pageX,
            startY: e.pageY,
            offsetWidth: e.pageX - off.left,
            offsetHeight: e.pageY - off.top,
            target: e.data.target,
            parent: $(e.data.target).parent()[0],
          };
          $.extend(e.data, data);
          if (
            $.data(e.data.target, "hidraggable").options.onBeforeDrag.call(e.data.target, e) === 0
          )
            return;
          $(document).bind("mousedown.hidraggable", e.data, startDrag);
          $(document).bind("mousemove.hidraggable", e.data, doDrag);
          $(document).bind("mouseup.hidraggable", e.data, stopDrag);
        });
    });
  };
  $.fn.hidraggable.methods = {
    options: function (el) {
      return $.data(el[0], "hidraggable").options;
    },
    proxy: function (el) {
      return $.data(el[0], "hidraggable").proxy;
    },
    enable: function (el) {
      return el.each(function () {
        $(this).hidraggable({ disabled: false });
      });
    },
    disable: function (el) {
      return el.each(function () {
        $(this).hidraggable({ disabled: true });
      });
    },
  };
  $.fn.hidraggable.parseOptions = function (el) {
    var $el = $(el);
    return $.extend(
      {},
      $.kuprintparser.parseOptions(el, [
        "cursor",
        "handle",
        "axis",
        { revert: "boolean", deltaX: "number", deltaY: "number", edge: "number" },
      ]),
      { disabled: !!$el.attr("disabled") || undefined },
    );
  };
  $.fn.hidraggable.defaults = {
    proxy: null,
    revert: false,
    cursor: "move",
    deltaX: null,
    deltaY: null,
    handle: null,
    disabled: false,
    edge: 0,
    axis: null,
    onBeforeDrag: function () {},
    onStartDrag: function () {},
    onDrag: function () {},
    onStopDrag: function () {},
  };
  $.fn.hidraggable.isDragging = false;
})(jQuery);

// --- hidroppable (drop plugin) ---
(function ($) {
  $.fn.hidroppable = function (opts, arg) {
    if (typeof opts === "string") return $.fn.hidroppable.methods[opts](this, arg);
    opts = opts || {};
    return this.each(function () {
      var existing = $.data(this, "hidroppable");
      if (existing) {
        $.extend(existing.options, opts);
      } else {
        var el = this;
        $(el).addClass("hidroppable");
        $(el).bind("_dragenter", function (e, target) {
          $.data(el, "hidroppable").options.onDragEnter.apply(el, [e, target]);
        });
        $(el).bind("_dragleave", function (e, target) {
          $.data(el, "hidroppable").options.onDragLeave.apply(el, [e, target]);
        });
        $(el).bind("_dragover", function (e, target) {
          $.data(el, "hidroppable").options.onDragOver.apply(el, [e, target]);
        });
        $(el).bind("_drop", function (e, target) {
          $.data(el, "hidroppable").options.onDrop.apply(el, [e, target]);
        });
        $.data(this, "hidroppable", {
          options: $.extend(
            {},
            $.fn.hidroppable.defaults,
            $.fn.hidroppable.parseOptions(this),
            opts,
          ),
        });
      }
    });
  };
  $.fn.hidroppable.methods = {
    options: function (el) {
      return $.data(el[0], "hidroppable").options;
    },
    enable: function (el) {
      return el.each(function () {
        $(this).hidroppable({ disabled: false });
      });
    },
    disable: function (el) {
      return el.each(function () {
        $(this).hidroppable({ disabled: true });
      });
    },
  };
  $.fn.hidroppable.parseOptions = function (el) {
    var $el = $(el);
    return $.extend({}, $.kuprintparser.parseOptions(el, ["accept"]), {
      disabled: !!$el.attr("disabled") || undefined,
    });
  };
  $.fn.hidroppable.defaults = {
    accept: null,
    disabled: false,
    onDragEnter: function () {},
    onDragOver: function () {},
    onDragLeave: function () {},
    onDrop: function () {},
  };
})(jQuery);

// --- hireizeable (resize plugin) ---
(function ($) {
  var resizeState = { maxPanelIndex: 0 };
  function Resizer(ctx) {
    this.options = $.data(ctx.target, "hireizeable").options;
    this.init(ctx.target);
  }
  Resizer.prototype = {
    numHandlerText: function (v) {
      return this.numHandler(v) + "pt";
    },
    numHandler: function (v) {
      var min = 1.5,
        raw = 0.75 * v;
      if (this.options.minResize) min = this.options.minResize;
      return Math.round(raw / min) * min;
    },
    init: function (el) {
      this.initResizeBox(el);
    },
    initResizeBox: function (el) {
      var self = this;
      $(el).each(function () {
        resizeState.maxPanelIndex += 1;
        var panel;
        if (self.options.noContainer) {
          panel = $(el);
        } else {
          panel = $(
            "<div panelIndex=" + resizeState.maxPanelIndex + ' class="resize-panel"></div>',
          );
          panel.css({
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            position: "absolute",
            "background-color": "rgba(0,0,0,0.5)",
            cursor: "move",
            display: "none",
          });
        }
        self.appendHandler(panel, $(this));
        var dirs = {
          n: {
            name: "n",
            target: $(
              '<div class="n resizebtn" style="cursor:n-resize;top:-12px;margin-left:-4px;left:50%;"></div>',
            ),
          },
          s: {
            name: "s",
            target: $(
              '<div class="s resizebtn" style="cursor:s-resize;bottom:-12px;margin-left:-4px;left:50%;"></div>',
            ),
          },
          w: {
            name: "w",
            target: $(
              '<div class="w resizebtn" style="cursor:w-resize;left:-12px;margin-top:-4px;top:50%;"></div>',
            ),
          },
          e: {
            name: "e",
            target: $(
              '<div class="e resizebtn" style="cursor:e-resize;top:50%;margin-top:-4px;right:-12px;"></div>',
            ),
          },
          ne: {
            name: "ne",
            target: $(
              '<div class="ne resizebtn" style="cursor:ne-resize;top:-12px;right:-12px;"></div>',
            ),
          },
          nw: {
            name: "nw",
            target: $(
              '<div class="nw resizebtn" style="cursor:nw-resize;top:-12px;left:-12px;"></div>',
            ),
          },
          se: {
            name: "se",
            target: $(
              '<div class="se resizebtn" style="cursor:se-resize;bottom:-12px;right:-12px;"></div>',
            ),
          },
          sw: {
            name: "sw",
            target: $(
              '<div class="sw resizebtn" style="cursor:sw-resize;bottom:-12px;left:-12px;"></div>',
            ),
          },
        };
        var allDirs = [dirs.n, dirs.s, dirs.w, dirs.e, dirs.ne, dirs.nw, dirs.se, dirs.sw];
        function filterDirs() {
          var result = [];
          var show = self.options.showPoints;
          $.each(allDirs, function (i, d) {
            if ($.inArray(d.name, show) > -1) result.push(d.target);
          });
          return result;
        }
        var handles = filterDirs();
        $.each(handles, function (i, h) {
          h.css({
            position: "absolute",
            width: "8px",
            height: "8px",
            background: "#ff6600",
            "border-radius": "50%",
          });
        });
        self.appendHandler(handles, panel);
        self.bindResizeEvent(panel, $(this));
        var $orig = $(this);
        $(panel).on("mousedown", ".resizebtn", function () {
          $orig.addClass("resizeing");
        });
        $(".easyui-droppable").on("mouseup", function () {
          $orig.removeClass("resizeing");
        });
        self.bindTrigger($(this));
      });
      this.bindHidePanel();
    },
    appendHandler: function (handles, container) {
      for (var i = 0; i < handles.length; i++) {
        container.append(handles[i]);
      }
    },
    triggerResize: function (el) {
      el.siblings().children("div[panelindex]").css({ display: "none" });
      el.children("div[panelindex]").css({ display: "block" });
    },
    bindResizeEvent: function (panel, $orig) {
      var self = this;
      var mouseX = 0,
        mouseY = 0,
        startW = panel.width(),
        startH = panel.height();
      var startLeft = panel.offset().left,
        startTop = panel.offset().top;
      var parent = self.options.noContainer ? $($orig) : panel.parent();
      var resizingE = false,
        resizingS = false,
        resizingW = false,
        resizingN = false;
      var resizingNE = false,
        resizingNW = false,
        resizingSE = false,
        resizingSW = false;
      var moving = false;
      panel.on("mousedown", ".e", function (e) {
        mouseX = e.pageX;
        startW = panel.width();
        resizingE = true;
      });
      panel.on("mousedown", ".s", function (e) {
        mouseY = e.pageY;
        startH = panel.height();
        resizingS = true;
      });
      panel.on("mousedown", ".w", function (e) {
        mouseX = e.pageX;
        startW = panel.width();
        resizingW = true;
        startLeft = parent.offset().left;
      });
      panel.on("mousedown", ".n", function (e) {
        mouseY = e.pageY;
        startH = panel.height();
        resizingN = true;
        startTop = parent.offset().top;
      });
      panel.on("mousedown", ".ne", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        startW = panel.width();
        startH = panel.height();
        resizingNE = true;
        startTop = parent.offset().top;
      });
      panel.on("mousedown", ".nw", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        startW = panel.width();
        startH = panel.height();
        startTop = parent.offset().top;
        startLeft = parent.offset().left;
        resizingNW = true;
      });
      panel.on("mousedown", ".se", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        startW = panel.width();
        startH = panel.height();
        resizingSE = true;
      });
      panel.on("mousedown", ".sw", function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        startW = panel.width();
        startH = panel.height();
        resizingSW = true;
        startLeft = parent.offset().left;
      });
      panel.on("mousedown", function (e) {
        self.options.onBeforeResize();
        mouseX = e.pageX;
        mouseY = e.pageY;
        startTop = parent.offset().top;
        startLeft = parent.offset().left;
        moving = true;
      });
      $(self.options.stage)
        .on("mousemove", function (e) {
          var dx = e.pageX - mouseX,
            dy = e.pageY - mouseY;
          if (resizingE) {
            panel.css({ width: "100%" });
            parent.css({ width: self.numHandlerText(startW + dx) });
            self.options.onResize(e, undefined, self.numHandler(startW + dx), undefined, undefined);
          } else if (resizingS) {
            panel.css({ height: "100%" });
            parent.css({ height: self.numHandlerText(startH + dy) });
            self.options.onResize(e, self.numHandler(startH + dy), undefined, undefined, undefined);
          } else if (resizingW) {
            panel.css({ width: "100%" });
            parent.css({
              width: self.numHandlerText(startW - dx),
              left: self.numHandlerText(startLeft + dx),
            });
            self.options.onResize(
              e,
              undefined,
              self.numHandler(startW - dx),
              undefined,
              self.numHandler(startLeft + dx),
            );
          } else if (resizingN) {
            panel.css({ height: "100%" });
            parent.css({
              height: self.numHandlerText(startH - dy),
              top: self.numHandlerText(startTop + dy),
            });
            self.options.onResize(
              e,
              self.numHandler(startH - dy),
              undefined,
              self.numHandler(startTop + dy),
              undefined,
            );
          } else if (resizingNE) {
            panel.css({ height: "100%", width: "100%" });
            parent.css({
              height: self.numHandlerText(startH - dy),
              top: self.numHandlerText(startTop + dy),
              width: self.numHandlerText(startW + dx),
            });
            self.options.onResize(
              e,
              self.numHandler(startH - dy),
              self.numHandler(startW + dx),
              self.numHandler(startTop + dy),
              undefined,
            );
          } else if (resizingNW) {
            panel.css({ height: "100%", width: "100%" });
            parent.css({
              height: self.numHandlerText(startH - dy),
              top: self.numHandlerText(startTop + dy),
              width: self.numHandlerText(startW - dx),
              left: self.numHandlerText(startLeft + dx),
            });
            self.options.onResize(
              e,
              self.numHandler(startH - dy),
              self.numHandler(startW - dx),
              self.numHandler(startTop + dy),
              self.numHandler(startLeft + dx),
            );
          } else if (resizingSE) {
            panel.css({ width: "100%", height: "100%" });
            parent.css({
              width: self.numHandlerText(startW + dx),
              height: self.numHandlerText(startH + dy),
            });
            self.options.onResize(
              e,
              self.numHandler(startH + dy),
              self.numHandler(startW + dx),
              undefined,
              undefined,
            );
          } else if (resizingSW) {
            panel.css({ width: "100%", height: "100%" });
            parent.css({
              width: self.numHandlerText(startW - dx),
              left: self.numHandlerText(startLeft + dx),
              height: self.numHandlerText(startH + dy),
            });
            self.options.onResize(
              e,
              self.numHandler(startH + dy),
              self.numHandler(startW - dx),
              undefined,
              self.numHandler(startLeft + dx),
            );
          } else if (moving) {
            parent.css({
              left: self.numHandlerText(startLeft + dx),
              top: self.numHandlerText(startTop + dy),
            });
            self.options.onResize(
              e,
              undefined,
              undefined,
              self.numHandler(startTop + dy),
              self.numHandler(startLeft + dx),
            );
          }
        })
        .on("mouseup", function () {
          resizingE = resizingS = resizingW = resizingN = false;
          resizingNE = resizingNW = resizingSE = resizingSW = false;
          moving = false;
          self.options.onStopResize();
        });
    },
    bindTrigger: function ($el) {
      var self = this;
      $el.on("click", function (e) {
        e.stopPropagation();
        self.triggerResize($el);
      });
    },
    bindHidePanel: function () {
      if (resizeState.maxPanelIndex < 2) {
        var stage = this.options.stage;
        $(stage).bind("click", function (e) {
          e.stopPropagation();
          $("div[panelindex]").css({ display: "none" });
        });
      }
    },
  };
  $.fn.extend({
    hireizeable: function (opts) {
      return this.each(function () {
        var options = $.extend({}, $.fn.hireizeable.defaults, opts || {});
        $.data(this, "hireizeable", { options: options });
        new Resizer({ target: this, onResize: function () {}, onStopResize: function () {} });
      });
    },
  });
  $.fn.hireizeable.defaults = {
    stage: document,
    reizeUnit: "pt",
    minResize: 1.5,
    showPoints: ["s", "e"],
    noContainer: false,
    onBeforeResize: function () {},
    onResize: function () {},
    onStopResize: function () {},
    noDrag: false,
  };
})(jQuery);

// --- hicontextMenu ---
(function ($) {
  function ContextMenu(el, opts) {
    this.init(el, opts);
  }
  ContextMenu.prototype = {
    init: function (el, opts) {
      this.ele = el;
      this.defaults = {
        menu: [{ text: "text", menus: [{}, {}], callback: function () {} }],
        target: function () {},
        width: 100,
        itemHeight: 28,
        bgColor: "#fff",
        color: "#333",
        fontSize: 14,
        hoverBgColor: "#f5f5f5",
      };
      this.opts = $.extend(true, {}, this.defaults, opts);
      this.random = new Date().getTime() + parseInt(1000 * Math.random());
      this.eventBind();
    },
    renderMenu: function (menus, parent) {
      var self = this,
        container = parent;
      if (menus && menus.length) {
        var $ul = $('<ul class="hicontextmenu"></ul>');
        if (!container) container = $ul.addClass("hicontextmenuroot");
        $.each(menus, function (i, item) {
          var disabled = !!item.disable && item.disable();
          var $li = $(
            '<li class="hicontextmenuitem"><a href="javascript:void(0);"><span>' +
              (item.text || "") +
              "</span></a></li>",
          );
          if (disabled) $li.addClass("disable");
          if (item.borderBottom) $li.addClass("borderBottom");
          if (item.menus) {
            $li.addClass("hicontextsubmenu");
            self.renderMenu(item.menus, $li);
          }
          if (item.callback) {
            $li.click(function (e) {
              if ($(this).hasClass("disable")) {
                e.stopPropagation();
              } else {
                $(".hicontextmenuroot").remove();
                item.callback();
                e.stopPropagation();
              }
            });
          }
          $ul.append($li);
        });
        if (parent) parent.append($ul);
      }
      if (!parent) {
        $("body").append(container);
        container.find(".hicontextmenuroot").hide();
      }
    },
    setPosition: function (e) {
      $(".hicontextmenuroot")
        .css({ left: e.pageX + 2, top: e.pageY + 2 })
        .show();
    },
    eventBind: function () {
      var self = this;
      this.ele.on("contextmenu", function (e) {
        $(".hicontextmenuroot").remove();
        e.preventDefault();
        self.renderMenu(self.opts.menus);
        self.setPosition(e);
        if (self.opts.target && typeof self.opts.target === "function") self.opts.target($(this));
      });
      $("body").on("click", function () {
        $(".hicontextmenuroot").remove();
      });
    },
  };
  $.fn.hicontextMenu = function (opts) {
    return (new ContextMenu(this, opts), this);
  };
})(jQuery);

// --- hiwebSocket ---
window.hiwebSocket = (function () {
  var stateConnected = "connected",
    stateReconnecting = "reconnecting";
  return {
    opened: false,
    name: "webSockets",
    reconnectTimeout: 60000,
    reconnectWindowSetTimeout: null,
    reconnectDelay: 2000,
    state: null,
    supportsKeepAlive: function () {
      return true;
    },
    hasIo: function () {
      return window.io;
    },
    send: function (data) {
      try {
        this.socket.emit("news", data);
      } catch (e) {
        console.log("send data error:" + (data || "") + JSON.stringify(e));
      }
    },
    getPrinterList: function () {
      return this.printerList;
    },
    start: function () {
      var self = this;
      if (window.WebSocket) {
        if (!this.socket) {
          this.socket = io("http://localhost:17521", { reconnectionAttempts: 5 });
          this.socket.on("connect", function () {
            self.opened = true;
            console.log("Websocket opened.");
            self.socket.on("successs", function (data) {
              hinnn.event.trigger("printSuccess_" + data.templateId, data);
            });
            self.socket.on("error", function (data) {
              hinnn.event.trigger("printError_" + data.templateId, data);
            });
            self.socket.on("printerList", function (list) {
              self.printerList = list;
            });
            self.state = stateConnected;
          });
          this.socket.on("disconnect", function () {
            self.opened = false;
          });
        }
      } else {
        console.log("WebSocket start fail");
      }
    },
    reconnect: function () {
      if (this.state !== stateConnected && this.state !== stateReconnecting) return;
      this.stop();
      if (this.ensureReconnectingState()) {
        console.log("Websocket reconnecting.");
        this.start();
      }
    },
    stop: function () {
      if (this.socket) {
        console.log("Closing the Websocket.");
        this.socket.close();
        this.socket = null;
      }
    },
    ensureReconnectingState: function () {
      this.state = stateReconnecting;
      return this.state === stateReconnecting;
    },
  };
})();

// ============================================================
// localStorage helper
// ============================================================
window.hiLocalStorage = (function () {
  var store = window.localStorage || null;
  return {
    saveLocalData: function (key, value) {
      return !!(store && value && (store.setItem(key, value), 1));
    },
    getLocalData: function (key) {
      return store ? store.getItem(key) : null;
    },
    removeItem: function (key) {
      if (store) store.removeItem(key);
    },
  };
})();

// ============================================================
// Export public API on kuprint namespace
// ============================================================
var kuprint = {
  init: kuprint_init,
  PrintElementTypeManager: PrintElementTypeManager,
  PrintElementTypeGroup: PrintElementTypeGroup,
  PrintTemplate: PrintTemplate,
  print: kuprint_print,
  print2: kuprint_print2,
  getHtml: kuprint_getHtml,
};

// ============================================================
// Init WebSocket on document ready
// ============================================================
$(document).ready(function () {
  if (window.hiwebSocket && hiwebSocket.hasIo()) hiwebSocket.start();
});

// Make kuprint globally available (backward compat)
window.kuprint = kuprint;

export default kuprint;
