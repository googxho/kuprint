// ============================================================
// tests/utils.test.js — hinnn 工具库 + TextHelper 单元测试
// ============================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "./mocks.js";
import { __extends, hinnn, TextHelper } from "../src/core/utils.js";

// ============================================================
// TextHelper
// ============================================================
describe("TextHelper", () => {
  it("replaceEnterAndNewlineAndTab removes CR/LF/TAB", () => {
    expect(TextHelper.replaceEnterAndNewlineAndTab("a\rb\nc\td", "")).toBe("abcd");
  });
  it("replaceEnterAndNewlineAndTab with custom replacement", () => {
    expect(TextHelper.replaceEnterAndNewlineAndTab("a\rb\nc", " ")).toBe("a b c");
  });
  it("replaceEnterAndNewline removes CR/LF only", () => {
    expect(TextHelper.replaceEnterAndNewline("a\rb\nc\td", "-")).toBe("a-b-c\td");
  });
  it("replaceTab removes TAB only", () => {
    expect(TextHelper.replaceTab("a\tb", "-")).toBe("a-b");
  });
});

// ============================================================
// __extends
// ============================================================
describe("__extends", () => {
  it("sets up prototype chain correctly", () => {
    function Parent() {}
    Parent.prototype.parentMethod = function () {
      return "parent";
    };

    function Child() {
      this.childProp = 2;
    }
    __extends(Child, Parent);

    const c = new Child();
    expect(c.childProp).toBe(2);
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

  it("parent static props override child's", () => {
    function Parent() {}
    Parent.x = 1;
    function Child() {}
    Child.x = 2;
    __extends(Child, Parent);
    expect(Child.x).toBe(1);
  });
});

// ============================================================
// hinnn.event
// ============================================================
describe("hinnn.event", () => {
  beforeEach(() => {
    hinnn.event.clear("test");
    hinnn.event.id = 0;
  });

  it("on + trigger with args", () => {
    const spy = vi.fn();
    hinnn.event.on("test", spy);
    hinnn.event.trigger("test", "a", "b");
    expect(spy).toHaveBeenCalledWith("a", "b");
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

  it("off removes specific handler", () => {
    const fn1 = vi.fn(),
      fn2 = vi.fn();
    hinnn.event.on("test", fn1);
    hinnn.event.on("test", fn2);
    hinnn.event.off("test", fn1);
    hinnn.event.trigger("test");
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it("clear removes all handlers", () => {
    const spy = vi.fn();
    hinnn.event.on("test", spy);
    hinnn.event.clear("test");
    hinnn.event.trigger("test");
    expect(spy).not.toHaveBeenCalled();
  });

  it("getId increments", () => {
    expect(hinnn.event.getId()).toBe(1);
    expect(hinnn.event.getId()).toBe(2);
  });

  it("getNameWithId appends id", () => {
    hinnn.event.id = 0;
    expect(hinnn.event.getNameWithId("e")).toBe("e-1");
    expect(hinnn.event.getNameWithId("e")).toBe("e-2");
  });
});

// ============================================================
// hinnn.mm
// ============================================================
describe("hinnn.mm", () => {
  it("mm to pt conversion (A4)", () => {
    expect(hinnn.mm.toPt(25.4)).toBeCloseTo(72, 5);
    expect(hinnn.mm.toPt(210)).toBeCloseTo(595.275, 1);
    expect(hinnn.mm.toPt(297)).toBeCloseTo(841.889, 1);
  });
});

// ============================================================
// hinnn.debounce
// ============================================================
describe("hinnn.debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("calls after wait period", () => {
    const fn = vi.fn();
    const d = hinnn.debounce(fn, 100);
    d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("immediate=true calls first", () => {
    const fn = vi.fn();
    const d = hinnn.debounce(fn, 100, true);
    d();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("debounces rapid calls", () => {
    const fn = vi.fn();
    const d = hinnn.debounce(fn, 100);
    d();
    vi.advanceTimersByTime(50);
    d();
    vi.advanceTimersByTime(50);
    d();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// hinnn.throttle
// ============================================================
describe("hinnn.throttle", () => {
  it("throttles calls", async () => {
    const fn = vi.fn();
    const t = hinnn.throttle(fn, 50);
    t();
    expect(fn).toHaveBeenCalledTimes(0); // deferred, trailing-edge by default
    t();
    t();
    t(); // rapid calls
    await new Promise((r) => setTimeout(r, 60));
    expect(fn).toHaveBeenCalledTimes(1); // fires once at trailing edge
  });
});

// ============================================================
// hinnn.dateFormat
// ============================================================
describe("hinnn.dateFormat", () => {
  it("formats yyyy-MM-dd", () => {
    expect(hinnn.dateFormat(new Date(2024, 0, 15), "yyyy-MM-dd")).toBe("2024-01-15");
  });
  it("formats HH:mm:ss", () => {
    expect(hinnn.dateFormat(new Date(2024, 0, 15, 9, 5, 3), "HH:mm:ss")).toBe("09:05:03");
  });
  it("handles string input", () => {
    expect(hinnn.dateFormat("2024-06-01T12:00:00", "yyyy/MM/dd")).toBe("2024/06/01");
  });
  it("returns empty for null/undefined", () => {
    expect(hinnn.dateFormat(null, "yyyy")).toBe("");
    expect(hinnn.dateFormat(undefined, "yyyy")).toBe("");
  });
});

// ============================================================
// hinnn.groupBy / orderBy / toUtf8
// ============================================================
describe("hinnn.groupBy", () => {
  it("groups by key", () => {
    const data = [
      { type: "A", v: 1 },
      { type: "A", v: 2 },
      { type: "B", v: 3 },
    ];
    const r = hinnn.groupBy(data, ["type"], (x) => x.type);
    expect(r).toHaveLength(2);
    expect(r[0].rows).toHaveLength(2);
    expect(r[1].rows).toHaveLength(1);
  });
});

describe("hinnn.orderBy", () => {
  it("sorts ascending", () => {
    expect(hinnn.orderBy([3, 1, 4], (x) => x)).toEqual([1, 3, 4]);
  });
  it("handles empty array", () => {
    expect(hinnn.orderBy([], (x) => x)).toEqual([]);
  });
});

describe("hinnn.toUtf8", () => {
  it("passes ASCII unchanged", () => {
    expect(hinnn.toUtf8("hello")).toBe("hello");
  });
  it("encodes Chinese", () => {
    expect(hinnn.toUtf8("中").length).toBeGreaterThan(1);
  });
});
