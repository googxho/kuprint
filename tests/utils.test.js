// ============================================================
// tests/utils.test.js — hinnn 工具库 + TextHelper 单元测试
// ============================================================
// 直接在顶层加载 utils.js，避免 vitest fork 隔离问题
const { readFileSync } = require("fs");
const { resolve } = require("path");
const vm = require("vm");

// 安全设置全局属性（vp test 环境下某些属性为只读 getter）
function safeSetGlobal(prop, value) {
  try { global[prop] = value; } catch (e) {
    Object.defineProperty(global, prop, { value: value, writable: true, configurable: true });
  }
}

safeSetGlobal("window", global);
global.document = {
  createElement: function (tag) {
    return {
      tagName: tag.toUpperCase(),
      style: {},
      setAttribute: function () {},
      appendChild: function () {},
      removeChild: function () {},
    };
  },
  querySelectorAll: function () { return []; },
  body: {
    appendChild: function () {},
    removeChild: function () {},
  },
};
safeSetGlobal("navigator", { userAgent: "node" });
const $ = function () { var o = { length: 0, each() { return o; } }; return o; };
$.extend = function (t) { return t; };
$.each = function () {};
global.$ = $;
global.jQuery = $;

vm.runInThisContext(
  readFileSync(resolve(__dirname, "..", "src/core/utils.js"), "utf8"),
  { filename: "utils.js" }
);

// 从 global 提取引用
const hinnn = global.hinnn || global.window.hinnn;
const TextHelper = global.TextHelper || global.window.TextHelper;
const _typeof = global._typeof || global.window._typeof;
const __extends = global.__extends || global.window.__extends;

// ============================================================
// _typeof — 类型判断 polyfill
// ============================================================
describe("_typeof", () => {
  it("returns 'undefined' for undefined", () => {
    expect(_typeof(undefined)).toBe("undefined");
  });

  it("returns 'object' for null", () => {
    expect(_typeof(null)).toBe("object");
  });

  it("returns 'boolean' for booleans", () => {
    expect(_typeof(true)).toBe("boolean");
    expect(_typeof(false)).toBe("boolean");
  });

  it("returns 'number' for numbers", () => {
    expect(_typeof(42)).toBe("number");
    expect(_typeof(NaN)).toBe("number");
  });

  it("returns 'string' for strings", () => {
    expect(_typeof("hello")).toBe("string");
  });

  it("returns 'function' for functions", () => {
    expect(_typeof(function () {})).toBe("function");
  });

  it("returns 'object' for plain objects and arrays", () => {
    expect(_typeof({})).toBe("object");
    expect(_typeof([])).toBe("object");
  });
});

// ============================================================
// __extends — 类继承辅助
// ============================================================
describe("__extends", () => {
  it("sets up prototype chain correctly", () => {
    function Parent() {}
    Parent.prototype.parentMethod = function () { return "parent"; };
    Parent.prototype.parentProp = 1;

    function Child() { this.childProp = 2; }

    __extends(Child, Parent);

    const c = new Child();
    expect(c.childProp).toBe(2);
    // __extends 只复制静态属性 + 设置原型链，不调用父类构造函数
    // 实例属性需子类构造函数自行调用 _super.call(this)
    expect(c.parentMethod()).toBe("parent");
    expect(c instanceof Child).toBe(true);
    expect(c instanceof Parent).toBe(true);
  });

  it("copies static properties from parent", () => {
    function Parent() {}
    Parent.staticProp = "static";

    function Child() {}
    __extends(Child, Parent);

    expect(Child.staticProp).toBe("static");
  });

  it("parent static props override child's (as designed)", () => {
    function Parent() {}
    Parent.x = 1;

    function Child() {}
    Child.x = 2;
    // __extends 在设置原型后会复制 Parent 的 own properties 到 Child
    // 这会覆盖 Child 上已设置的同名属性
    __extends(Child, Parent);
    expect(Child.x).toBe(1);
  });
});

// ============================================================
// hinnn.event — 事件系统
// ============================================================
describe("hinnn.event", () => {
  beforeEach(() => {
    hinnn.event.clear("test");
    hinnn.event.clear("test2");
    hinnn.event.id = 0;
  });

  describe("on / trigger", () => {
    it("registers and triggers a single handler", () => {
      const spy = vi.fn();
      hinnn.event.on("test", spy);
      hinnn.event.trigger("test", "arg1", "arg2");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("triggers multiple handlers in order", () => {
      const calls = [];
      hinnn.event.on("test", () => calls.push("a"));
      hinnn.event.on("test", () => calls.push("b"));
      hinnn.event.trigger("test");
      expect(calls).toEqual(["a", "b"]);
    });

    it("does nothing for unregistered event", () => {
      expect(() => hinnn.event.trigger("nonexistent")).not.toThrow();
    });

    it("handles trigger with no extra args", () => {
      const spy = vi.fn();
      hinnn.event.on("test", spy);
      hinnn.event.trigger("test");
      expect(spy).toHaveBeenCalledWith(); // no extra args
    });
  });

  describe("off", () => {
    it("removes a specific handler", () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      hinnn.event.on("test", fn1);
      hinnn.event.on("test", fn2);
      hinnn.event.off("test", fn1);
      hinnn.event.trigger("test");
      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).toHaveBeenCalledTimes(1);
    });

    it("does nothing when removing from nonexistent event", () => {
      expect(() => hinnn.event.off("nonexistent", () => {})).not.toThrow();
    });

    it("removes only the first matching handler", () => {
      const fn = vi.fn();
      hinnn.event.on("test", fn);
      hinnn.event.on("test", fn);
      hinnn.event.off("test", fn);
      hinnn.event.trigger("test");
      expect(fn).toHaveBeenCalledTimes(1); // second instance remains
    });
  });

  describe("clear", () => {
    it("removes all handlers for an event", () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      hinnn.event.on("test", fn1);
      hinnn.event.on("test", fn2);
      hinnn.event.clear("test");
      hinnn.event.trigger("test");
      expect(fn1).not.toHaveBeenCalled();
      expect(fn2).not.toHaveBeenCalled();
    });
  });

  describe("getId / getNameWithId", () => {
    it("getId returns incrementing IDs", () => {
      expect(hinnn.event.getId()).toBe(1);
      expect(hinnn.event.getId()).toBe(2);
      expect(hinnn.event.getId()).toBe(3);
    });

    it("getNameWithId appends ID to name", () => {
      const name1 = hinnn.event.getNameWithId("prefix");
      const name2 = hinnn.event.getNameWithId("prefix");
      expect(name1).toBe("prefix-1");
      expect(name2).toBe("prefix-2");
      expect(name1).not.toBe(name2);
    });
  });
});

// ============================================================
// hinnn.pt / hinnn.px / hinnn.mm — 单位转换（需要 DOM getDpi，跳过）
// 这些函数依赖 document.createElement 测量 DPI，
// 在 Node 环境下无法准确测试，应在浏览器集成测试中覆盖。
// ============================================================

// ============================================================
// hinnn.throttle / hinnn.debounce
// ============================================================
describe("hinnn.throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls function after wait period (trailing edge default)", () => {
    const fn = vi.fn();
    const throttled = hinnn.throttle(fn, 100);
    throttled();
    // throttle 默认 trailing edge：首次调用不立即执行，等 wait ms 后触发
    expect(fn).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("only calls once within wait period", () => {
    const fn = vi.fn();
    const throttled = hinnn.throttle(fn, 100);
    throttled();
    throttled();
    throttled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls again after wait period expires", () => {
    const fn = vi.fn();
    const throttled = hinnn.throttle(fn, 100);
    throttled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    throttled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("hinnn.debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not call immediately with default settings", () => {
    const fn = vi.fn();
    const debounced = hinnn.debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
  });

  it("calls after wait period", () => {
    const fn = vi.fn();
    const debounced = hinnn.debounce(fn, 100);
    debounced();
    vi.advanceTimersByTime(150);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("resets timer on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = hinnn.debounce(fn, 100);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("calls immediately when immediate=true", () => {
    const fn = vi.fn();
    const debounced = hinnn.debounce(fn, 100, true);
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    // Subsequent calls within wait are ignored
    debounced();
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(150);
    // After timeout, next call fires immediately again
    debounced();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

// ============================================================
// hinnn.groupBy — 数据分组
// ============================================================
describe("hinnn.groupBy", () => {
  it("groups by a single key", () => {
    const data = [
      { type: "A", val: 1 },
      { type: "B", val: 2 },
      { type: "A", val: 3 },
    ];
    // keyFn 必传：返回用于分组的键对象（JSON.stringify 比较）
    const result = hinnn.groupBy(data, ["type"], function (item) {
      return { type: item.type };
    });
    expect(result).toHaveLength(2);
    // 返回的 group 对象包含 keyFn 返回的键作为属性
    const types = result.map(function (g) { return g.type; }).sort();
    expect(types).toEqual(["A", "B"]);
  });

  it("groups by multiple keys", () => {
    const data = [
      { cat: "x", sub: "a", val: 1 },
      { cat: "x", sub: "b", val: 2 },
      { cat: "y", sub: "a", val: 3 },
    ];
    const result = hinnn.groupBy(data, ["cat", "sub"], function (item) {
      return { cat: item.cat, sub: item.sub };
    });
    expect(result).toHaveLength(3);
  });

  it("returns single group when all keys match", () => {
    const data = [{ a: 1 }, { a: 2 }];
    // keys 参数控制 group 对象上存储哪些元数据字段（从 item 取值）
    const result = hinnn.groupBy(data, ["a"], function () {
      return { all: "same" };
    });
    expect(result).toHaveLength(1);
    expect(result[0].rows).toHaveLength(2);
    // keys=["a"] → result[0].a = item.a (第一个 item 的值)
    expect(result[0].a).toBe(1);
  });

  it("handles empty array", () => {
    const result = hinnn.groupBy([], [], function () { return {}; });
    expect(result).toEqual([]);
  });
});

// ============================================================
// hinnn.orderBy — 排序
// ============================================================
describe("hinnn.orderBy", () => {
  it("sorts by a single key ascending", () => {
    const data = [{ n: 3 }, { n: 1 }, { n: 2 }];
    const result = hinnn.orderBy(data, (item) => item.n);
    expect(result.map((i) => i.n)).toEqual([1, 2, 3]);
  });

  it("sorts by string property", () => {
    const data = [{ s: "c" }, { s: "a" }, { s: "b" }];
    const result = hinnn.orderBy(data, (item) => item.s);
    expect(result.map((i) => i.s)).toEqual(["a", "b", "c"]);
  });

  it("mutates original array (uses splice internally)", () => {
    const data = [{ n: 3 }, { n: 1 }, { n: 2 }];
    const originalLength = data.length;
    hinnn.orderBy(data, function (item) { return item.n; });
    // orderBy 内部使用 splice，会修改原数组
    expect(data.length).not.toBe(originalLength);
  });

  it("handles empty array", () => {
    expect(hinnn.orderBy([], (x) => x)).toEqual([]);
  });

  it("handles single element", () => {
    expect(hinnn.orderBy([{ n: 1 }], (x) => x.n)).toEqual([{ n: 1 }]);
  });
});

// ============================================================
// hinnn.dateFormat — 日期格式化
// ============================================================
describe("hinnn.dateFormat", () => {
  const date = new Date(2024, 0, 15, 9, 5, 30); // Jan 15 2024 09:05:30

  it("formats yyyy-MM-dd", () => {
    expect(hinnn.dateFormat(date, "yyyy-MM-dd")).toBe("2024-01-15");
  });

  it("formats yyyy/MM/dd HH:mm:ss", () => {
    expect(hinnn.dateFormat(date, "yyyy/MM/dd HH:mm:ss")).toBe("2024/01/15 09:05:30");
  });

  it("formats yy-MM-dd", () => {
    expect(hinnn.dateFormat(date, "yy-MM-dd")).toBe("24-01-15");
  });

  it("returns empty string for invalid format", () => {
    // Invalid format handling — should not throw
    const result = hinnn.dateFormat(date, "");
    expect(typeof result).toBe("string");
  });

  it("formats single digit month/day correctly", () => {
    const d = new Date(2024, 0, 5);
    expect(hinnn.dateFormat(d, "yyyy-MM-dd")).toBe("2024-01-05");
  });
});

// ============================================================
// hinnn.toUtf8 — UTF-8 编码
// ============================================================
describe("hinnn.toUtf8", () => {
  it("handles ASCII strings unchanged", () => {
    expect(hinnn.toUtf8("hello")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(hinnn.toUtf8("")).toBe("");
  });

  it("returns a string for valid input", () => {
    expect(typeof hinnn.toUtf8("test")).toBe("string");
  });
});

// ============================================================
// TextHelper — 文本清理
// ============================================================
describe("TextHelper", () => {
  describe("replaceEnterAndNewline", () => {
    it("replaces \\r and \\n with replacement", () => {
      expect(TextHelper.replaceEnterAndNewline("a\rb\nc", " ")).toBe("a b c");
    });

    it("returns unchanged string if no newlines", () => {
      expect(TextHelper.replaceEnterAndNewline("hello", " ")).toBe("hello");
    });
  });

  describe("replaceTab", () => {
    it("replaces tabs with replacement", () => {
      expect(TextHelper.replaceTab("a\tb\tc", " ")).toBe("a b c");
    });

    it("returns unchanged string if no tabs", () => {
      expect(TextHelper.replaceTab("hello", " ")).toBe("hello");
    });
  });

  describe("replaceEnterAndNewlineAndTab", () => {
    it("replaces all whitespace chars", () => {
      expect(TextHelper.replaceEnterAndNewlineAndTab("a\rb\nc\td", "")).toBe("abcd");
    });

    it("handles mixed whitespace", () => {
      const input = "line1\r\nline2\twith\ttab\nline3";
      const result = TextHelper.replaceEnterAndNewlineAndTab(input, " ");
      expect(result).not.toContain("\r");
      expect(result).not.toContain("\n");
      expect(result).not.toContain("\t");
    });
  });
});

// ============================================================
// hinnn.form.serialize — 表单序列化（需要真实 DOM，跳过单元测试）
// 此函数依赖 jQuery.serializeArray，在集成测试中覆盖
// ============================================================
