// ============================================================
// core/utils.js — 工具函数库（hinnn）
// ============================================================
// 【hinnn — kuprint 最底层的工具库】
// 提供：事件系统、单位转换(pt/px/mm)、节流防抖、数据分组排序、
// UTF-8 编码、表单序列化、日期格式化等基础能力。
// 所有上层模块都依赖此文件。
// ============================================================

/**
 * jQuery Kuprint 2.5.4
 *
 * Copyright (c) 2016-2021 www.hinnn.com. All rights reserved.
 *
 * Licensed under the LGPL or commercial licenses
 * To use it on other terms please contact us: hinnn.com@gmail.com
 *
 * Reconstructed source code.
 */

"use strict";

// ============================================================
// Polyfill helpers
// ============================================================
function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function (obj) { return typeof obj; };
    } else {
        _typeof = function (obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
                ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    }
    return left instanceof right;
}

// ============================================================
// Helper: class inheritance
// ============================================================
function __extends(child, parent) {
    for (var key in parent) {
        if (parent.hasOwnProperty(key)) child[key] = parent[key];
    }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
}

// ============================================================
// Module 0: hinnn - Core utilities
// ============================================================
window.hinnn = {};
var hinnn = window.hinnn;

hinnn.event = (function () {
    var _events = {};
    return {
        id: 0,
        on: function (name, fn) {
            if (!_events[name]) _events[name] = [];
            _events[name].push(fn);
        },
        off: function (name, fn) {
            var arr = _events[name];
            if (!arr) return;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === fn) {
                    _events[name].splice(i, 1);
                    break;
                }
            }
        },
        trigger: function (name) {
            var arr = _events[name];
            if (arr && arr.length) {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = 0; i < arr.length; i++) {
                    arr[i].apply(this, args);
                }
            }
        },
        clear: function (name) {
            _events[name] = [];
        },
        getId: function () {
            this.id += 1;
            return this.id;
        },
        getNameWithId: function (name) {
            return name + "-" + this.getId();
        }
    };
})();

hinnn.form = {
    serialize: function (form) {
        var arr = $(form).serializeArray();
        var obj = {};
        $.each(arr, function () {
            if (obj[this.name]) {
                if (Object.prototype.toString.call(obj[this.name]) === "[object Array]") {
                    obj[this.name].push(this.value);
                } else {
                    obj[this.name] = [obj[this.name], this.value];
                }
            } else {
                obj[this.name] = this.value;
            }
        });
        return obj;
    }
};

hinnn.pt = {
    dpi: 0,
    toPx: function (pt) {
        return pt * (this.getDpi() / 72);
    },
    getDpi: function () {
        if (!this.dpi) {
            var div = document.createElement("DIV");
            div.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(div);
            this.dpi = div.offsetHeight;
        }
        return this.dpi;
    }
};

hinnn.px = {
    dpi: 0,
    toPt: function (px) {
        return px * (72 / this.getDpi());
    },
    getDpi: function () {
        if (!this.dpi) {
            var div = document.createElement("DIV");
            div.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(div);
            this.dpi = div.offsetHeight;
        }
        return this.dpi;
    }
};

hinnn.mm = {
    toPt: function (mm) {
        return 72 / 25.4 * mm;
    },
    toPx: function (mm) {
        return hinnn.pt.toPx(hinnn.mm.toPt(mm));
    }
};

hinnn.throttle = function (fn, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};

    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = fn.apply(context, args);
        if (!timeout) context = args = null;
    };

    return function () {
        var now = Date.now();
        if (!previous && options.leading !== false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

hinnn.debounce = function (fn, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function () {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = fn.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = fn.apply(context, args);
            context = args = null;
        }
        return result;
    };
};

hinnn.toUtf8 = function (str) {
    var result = "";
    var len = str.length;
    for (var i = 0; i < len; i++) {
        var code = str.charCodeAt(i);
        if (code >= 1 && code <= 127) {
            result += str.charAt(i);
        } else if (code > 2047) {
            result += String.fromCharCode(224 | code >> 12 & 15);
            result += String.fromCharCode(128 | code >> 6 & 63);
            result += String.fromCharCode(128 | code >> 0 & 63);
        } else {
            result += String.fromCharCode(192 | code >> 6 & 31);
            result += String.fromCharCode(128 | code >> 0 & 63);
        }
    }
    return result;
};

hinnn.groupBy = function (arr, keys, keyFn) {
    var groups = {};
    arr.forEach(function (item) {
        var key = JSON.stringify(keyFn(item));
        if (!groups[key]) {
            groups[key] = { rows: [] };
            keys.forEach(function (k) {
                groups[key][k] = item[k];
            });
        }
        groups[key].rows.push(item);
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
};

hinnn.orderBy = function (arr, fn) {
    if (arr.length <= 1) return arr;
    var pivotIdx = Math.floor(arr.length / 2);
    var pivot = arr.splice(pivotIdx, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i]) < fn(pivot)) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return hinnn.orderBy(left, fn).concat([pivot], hinnn.orderBy(right, fn));
};

hinnn.dateFormat = function (date, fmt) {
    if (!date) return "";
    try {
        var d = typeof date === "string" ? new Date(date) : date;
        var o = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "H+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            S: d.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    } catch (e) {
        console.log(e);
        return "";
    }
};

// ============================================================
// Text helper (merged from core/text-helper.js)
// ============================================================
var TextHelper = {
    replaceEnterAndNewline: function (str, replacement) {
        return str.replace(/\r|\n/g, replacement);
    },
    replaceTab: function (str, replacement) {
        return str.replace(/\t/g, replacement);
    },
    replaceEnterAndNewlineAndTab: function (str, replacement) {
        return str.replace(/[\r\n\t]/g, replacement);
    }
};

// ============================================================
// Module 9: PrintElementOptionItemManager