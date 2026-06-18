// ============================================================
// tests/mocks.js — 全局 mock（在所有测试前加载）
// ============================================================
import { vi } from "vitest";

// --- 浏览器全局对象 mock ---
vi.stubGlobal("window", global);
vi.stubGlobal("document", {
  createElement(tag) {
    return {
      tagName: tag.toUpperCase(),
      style: {},
      setAttribute() {},
      appendChild() {},
      removeChild() {},
    };
  },
  querySelectorAll() {
    return [];
  },
  body: {
    appendChild() {},
    removeChild() {},
  },
});
vi.stubGlobal("navigator", { userAgent: "node" });

// --- jQuery mock ---
function createMock$(selector) {
  const o = {
    length: 0,
    each() {
      return o;
    },
    css() {
      return o;
    },
    find() {
      return createMock$();
    },
    attr() {
      return o;
    },
    html() {
      return o;
    },
    text() {
      return "";
    },
    val() {
      return "";
    },
    append() {
      return o;
    },
    remove() {
      return o;
    },
    data() {
      return o;
    },
    addClass() {
      return o;
    },
    width() {
      return 0;
    },
    height() {
      return 0;
    },
    outerWidth() {
      return 0;
    },
    offset() {
      return { left: 0, top: 0 };
    },
    prepend() {
      return o;
    },
    before() {
      return o;
    },
    after() {
      return o;
    },
    on() {
      return o;
    },
    bind() {
      return o;
    },
    unbind() {
      return o;
    },
    click() {
      return o;
    },
    change() {
      return o;
    },
    keydown() {
      return o;
    },
    blur() {
      return o;
    },
    focus() {
      return o;
    },
    serializeArray() {
      return [];
    },
    parent() {
      return createMock$();
    },
    children() {
      return createMock$();
    },
    clone() {
      return createMock$();
    },
    filter() {
      return createMock$();
    },
    first() {
      return createMock$();
    },
    last() {
      return createMock$();
    },
    eq() {
      return createMock$();
    },
    get() {
      return [];
    },
    [Symbol.iterator]() {
      return [][Symbol.iterator]();
    },
  };
  return o;
}

const $ = createMock$;
$.extend = function (target) {
  for (let i = 1; i < arguments.length; i++) {
    const source = arguments[i];
    if (source) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
  }
  return target;
};
$.each = function (obj, fn) {
  if (!obj) return;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => fn.call(v, i, v));
  } else {
    Object.keys(obj).forEach((k) => fn.call(obj[k], k, obj[k]));
  }
};
$.trim = function (str) {
  return (str || "").trim();
};
$.fn = {};

vi.stubGlobal("$", $);
vi.stubGlobal("jQuery", $);
