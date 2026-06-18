// ============================================================
// tests/setup.js — 测试环境初始化（无 jsdom 依赖）
// ============================================================
const { readFileSync } = require("fs");
const { resolve } = require("path");
const vm = require("vm");

// 最小全局对象
global.window = global;
global.document = {
  createElement: function () { return { style: {}, setAttribute: function () {} }; },
  querySelectorAll: function () { return []; },
};
global.navigator = { userAgent: "node" };

// 轻量 jQuery mock
function createJQueryMock(selector) {
  var obj = {
    length: 0,
    0: null,
    css: function () { return obj; },
    attr: function () { return obj; },
    html: function () { return obj; },
    text: function () { return ""; },
    val: function () { return ""; },
    find: function () { return createJQueryMock(); },
    append: function () { return obj; },
    remove: function () { return obj; },
    data: function () { return obj; },
    addClass: function () { return obj; },
    removeClass: function () { return obj; },
    hasClass: function () { return false; },
    width: function () { return 0; },
    height: function () { return 0; },
    outerWidth: function () { return 0; },
    outerHeight: function () { return 0; },
    offset: function () { return { left: 0, top: 0 }; },
    each: function (fn) { return obj; },
    map: function () { return []; },
    filter: function () { return obj; },
    on: function () { return obj; },
    off: function () { return obj; },
    before: function () { return obj; },
    after: function () { return obj; },
    keydown: function () { return obj; },
    mousedown: function () { return obj; },
    mouseup: function () { return obj; },
    prepend: function () { return obj; },
    serializeArray: function () { return []; },
  };
  return obj;
}

var $ = createJQueryMock;
$.extend = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var src = arguments[i];
    if (src) {
      for (var k in src) { if (src.hasOwnProperty(k)) target[k] = src[k]; }
    }
  }
  return target;
};

$.each = function (obj, fn) {
  if (Array.isArray(obj)) { obj.forEach(function (v, i) { fn.call(v, i, v); }); }
  else { Object.keys(obj || {}).forEach(function (k) { fn.call(obj[k], k, obj[k]); }); }
};

global.$ = $;
global.jQuery = $;

// 加载源码（使用 vm.runInThisContext 让 var 声明落到 global）
const srcDir = resolve(__dirname, "..", "src");

function loadModule(relativePath) {
  const code = readFileSync(resolve(srcDir, relativePath), "utf8");
  vm.runInThisContext(code, { filename: relativePath });
}

loadModule("core/utils.js");

// 暴露到 global
global.hinnn = global.hinnn || global.window.hinnn;
global.TextHelper = global.TextHelper || global.window.TextHelper;
global._typeof = global._typeof || global.window._typeof;
global.__extends = global.__extends || global.window.__extends;
