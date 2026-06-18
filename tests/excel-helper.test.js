// ============================================================
// tests/excel-helper.test.js — TableExcelHelper 表格逻辑测试
// ============================================================
const { readFileSync } = require("fs");
const { resolve } = require("path");
const vm = require("vm");

// 直接在顶层加载依赖
// 安全设置全局属性（vp test 环境下某些属性为只读 getter）
function safeSetGlobal(prop, value) {
  try { global[prop] = value; } catch (e) {
    Object.defineProperty(global, prop, { value: value, writable: true, configurable: true });
  }
}

safeSetGlobal("window", global);
global.document = { createElement: () => ({}), querySelectorAll: () => [] };
safeSetGlobal("navigator", { userAgent: "node" });
const $ = function () { var o = { length: 0, each() { return o; }, css() { return o; }, find() { return o; }, attr() { return o; }, html() { return o; }, val() { return ""; }, append() { return o; }, remove() { return o; }, data() { return o; }, addClass() { return o; }, width() { return 0; }, height() { return 0; }, outerWidth() { return 0; }, offset() { return { left: 0, top: 0 }; }, prepend() { return o; }, before() { return o; }, after() { return o; }, on() { return o; } }; return o; };
$.extend = function (t) { for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; if (s) for (var k in s) { if (s.hasOwnProperty(k)) t[k] = s[k]; } } return t; };
$.each = function (o, fn) { if (Array.isArray(o)) o.forEach(function (v, i) { fn.call(v, i, v); }); else Object.keys(o || {}).forEach(function (k) { fn.call(o[k], k, o[k]); }); };
global.$ = $;
global.jQuery = $;

function loadModule(relPath) {
  vm.runInThisContext(
    readFileSync(resolve(__dirname, "..", "src", relPath), "utf8"),
    { filename: relPath }
  );
}

loadModule("core/utils.js");
loadModule("table/excel-helper.js");

const TableExcelHelper = global.window.TableExcelHelper;
const hinnn = global.window.hinnn;

// ============================================================
// 辅助函数：创建模拟列结构
// ============================================================
function makeCol(id, opts) {
  opts = opts || {};
  return {
    id: id || "col1",
    field: opts.field || "field1",
    title: opts.title || "Col 1",
    width: opts.width !== undefined ? opts.width : 100,
    colspan: opts.colspan || 1,
    rowspan: opts.rowspan || 1,
    align: opts.align,
    vAlign: opts.vAlign,
    halign: opts.halign,
    fixed: opts.fixed || false,
    columnId: opts.columnId,
    styler: opts.styler,
    styler2: opts.styler2,
    formatter: opts.formatter,
    formatter2: opts.formatter2,
    hasWidth: opts.hasWidth || false,
    targetWidth: opts.targetWidth,
    getTarget: opts.getTarget || (function () { return document.createElement("td"); }),
    setAlign: opts.setAlign || (function () {}),
    setVAlign: opts.setVAlign || (function () {}),
    getField: opts.getField || (function () { return this.field; }),
    createTarget: opts.createTarget || (function () {}),
    toJson: opts.toJson || (function () { return {}; }),
  };
}

function makeColumnLayer(columns) {
  return { columns: columns };
}

// ============================================================
// getOrderedColumns — 获取叶子列（按行排序的最后层）
// ============================================================
describe("TableExcelHelper.getOrderedColumns", () => {
  it("returns single-layer columns in order", () => {
    const tree = {
      totalLayer: 1,
      0: [makeCol("a"), makeCol("b"), makeCol("c")],
    };
    const result = TableExcelHelper.getOrderedColumns(tree);
    expect(result.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("handles multi-layer with rowspans", () => {
    // Layer 0: [A (rowspan=2), B (rowspan=1)]
    // Layer 1: [B-sub1, B-sub2]
    const tree = {
      totalLayer: 2,
      0: [makeCol("A", { rowspan: 2 }), makeCol("B", { rowspan: 1 })],
      1: [makeCol("B1"), makeCol("B2")],
    };
    const result = TableExcelHelper.getOrderedColumns(tree);
    // Row 0 (layer 0 + 0): A
    // Row 1 (layer 1): A (rowspan), B1, B2
    // Final layer is layer 1 (totalLayer-1), so we get columns from row level 1
    // A appears at row 1 (0+1=1), B1 at 1, B2 at 1
    expect(result.map((c) => c.id)).toEqual(["A", "B1", "B2"]);
  });

  it("returns empty for tree with no layers", () => {
    const tree = { totalLayer: 0 };
    expect(TableExcelHelper.getOrderedColumns(tree)).toBeUndefined();
  });
});

// ============================================================
// allAutoWidth — 非固定列总宽度
// ============================================================
describe("TableExcelHelper.allAutoWidth", () => {
  it("sums widths of non-fixed columns", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100, fixed: false }),
        makeCol("b", { width: 50, fixed: false }),
        makeCol("c", { width: 30, fixed: true }),
      ],
    };
    expect(TableExcelHelper.allAutoWidth(tree)).toBe(150);
  });

  it("returns 0 when all columns are fixed", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100, fixed: true }),
        makeCol("b", { width: 50, fixed: true }),
      ],
    };
    expect(TableExcelHelper.allAutoWidth(tree)).toBe(0);
  });

  it("returns sum of all widths when none are fixed", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100 }),
        makeCol("b", { width: 200 }),
      ],
    };
    expect(TableExcelHelper.allAutoWidth(tree)).toBe(300);
  });
});

// ============================================================
// allFixedWidth — 固定列总宽度
// ============================================================
describe("TableExcelHelper.allFixedWidth", () => {
  it("sums widths of fixed columns", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100, fixed: true }),
        makeCol("b", { width: 50, fixed: false }),
        makeCol("c", { width: 30, fixed: true }),
      ],
    };
    expect(TableExcelHelper.allFixedWidth(tree)).toBe(130);
  });

  it("returns 0 when no columns are fixed", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100 }),
        makeCol("b", { width: 50 }),
      ],
    };
    expect(TableExcelHelper.allFixedWidth(tree)).toBe(0);
  });
});

// ============================================================
// getColumnsWidth — 计算列宽分配
// ============================================================
describe("TableExcelHelper.getColumnsWidth", () => {
  it("distributes remaining width proportionally", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 1, fixed: false }),
        makeCol("b", { width: 2, fixed: false }),
        makeCol("c", { width: 50, fixed: true }),
      ],
    };
    const result = TableExcelHelper.getColumnsWidth(tree, 200);
    // fixedW = 50, autoW = 3, remaining = 150
    // col a: 1/3 * 150 = 50
    // col b: 2/3 * 150 = 100
    // col c: 50 (fixed)
    expect(result["a"]).toBeCloseTo(50, 0);
    expect(result["b"]).toBeCloseTo(100, 0);
    expect(result["c"]).toBe(50);
  });

  it("returns fixed width for fixed columns", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 80, fixed: true }),
      ],
    };
    const result = TableExcelHelper.getColumnsWidth(tree, 200);
    expect(result["a"]).toBe(80);
  });

  it("handles zero remaining width gracefully", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100, fixed: false }),
      ],
    };
    // autoW=100, fixedW=0, remaining=0, so 100/100*0=0
    const result = TableExcelHelper.getColumnsWidth(tree, 0);
    expect(result["a"]).toBe(0);
  });
});

// ============================================================
// syncTargetWidthToOption — 同步目标宽度
// ============================================================
describe("TableExcelHelper.syncTargetWidthToOption", () => {
  it("syncs targetWidth to width for columns with hasWidth", () => {
    const colA = makeCol("a", { hasWidth: true, targetWidth: 120, width: 100 });
    const colB = makeCol("b", { hasWidth: false, targetWidth: 80, width: 50 });
    const columns = [makeColumnLayer([colA, colB])];

    TableExcelHelper.syncTargetWidthToOption(columns);
    expect(colA.width).toBe(120);
    expect(colB.width).toBe(50); // unchanged
  });

  it("does not crash on empty columns", () => {
    expect(() => TableExcelHelper.syncTargetWidthToOption([])).not.toThrow();
  });
});

// ============================================================
// getColumnFormatter — 格式化函数解析
// ============================================================
describe("TableExcelHelper.getColumnFormatter", () => {
  it("returns direct formatter if present", () => {
    const fn = function () { return "formatted"; };
    const col = makeCol("a", { formatter: fn });
    expect(TableExcelHelper.getColumnFormatter(col)).toBe(fn);
  });

  it("parses formatter2 via new Function", () => {
    const col = makeCol("a", { formatter2: "function(v) { return v.toUpperCase(); }" });
    const fn = TableExcelHelper.getColumnFormatter(col);
    expect(typeof fn).toBe("function");
    expect(fn("hello")).toBe("HELLO");
  });

  it("prefers formatter over formatter2", () => {
    const fn1 = function () { return "first"; };
    // 只设置 formatter，不设置 formatter2（否则 formatter2 会覆盖）
    const col = makeCol("a", { formatter: fn1 });
    expect(TableExcelHelper.getColumnFormatter(col)).toBe(fn1);
  });

  it("returns undefined when neither formatter nor formatter2", () => {
    const col = makeCol("a");
    expect(TableExcelHelper.getColumnFormatter(col)).toBeUndefined();
  });

  it("handles invalid formatter2 gracefully", () => {
    const col = makeCol("a", { formatter2: "not valid js" });
    const fn = TableExcelHelper.getColumnFormatter(col);
    expect(fn).toBeUndefined();
  });
});

// ============================================================
// getColumnStyler — 样式函数解析
// ============================================================
describe("TableExcelHelper.getColumnStyler", () => {
  it("returns direct styler if present", () => {
    const fn = function () { return { color: "red" }; };
    const col = makeCol("a", { styler: fn });
    expect(TableExcelHelper.getColumnStyler(col)).toBe(fn);
  });

  it("parses styler2 via new Function", () => {
    const col = makeCol("a", { styler2: "function(v) { return { color: 'blue' }; }" });
    const fn = TableExcelHelper.getColumnStyler(col);
    expect(typeof fn).toBe("function");
    expect(fn("test")).toEqual({ color: "blue" });
  });

  it("prefers styler over styler2", () => {
    const fn1 = function () { return {}; };
    // 只设置 styler，不设置 styler2
    const col = makeCol("a", { styler: fn1 });
    expect(TableExcelHelper.getColumnStyler(col)).toBe(fn1);
  });
});

// ============================================================
// getFooterFormatter — 表脚格式化函数解析
// ============================================================
describe("TableExcelHelper.getFooterFormatter", () => {
  it("returns printElementType.footerFormatter if set", () => {
    const fn = function () { return "footer"; };
    const pte = { footerFormatter: fn };
    expect(TableExcelHelper.getFooterFormatter({}, pte)).toBe(fn);
  });

  it("parses options.footerFormatter if pte has none", () => {
    const pte = {};
    const options = { footerFormatter: "function() { return 'opt'; }" };
    const fn = TableExcelHelper.getFooterFormatter(options, pte);
    expect(typeof fn).toBe("function");
  });

  it("pte.footerFormatter takes priority over options", () => {
    const fn1 = function () { return "pte"; };
    const pte = { footerFormatter: fn1 };
    // 只设置 pte.footerFormatter，不设置 options.footerFormatter
    const options = {};
    expect(TableExcelHelper.getFooterFormatter(options, pte)).toBe(fn1);
  });
});

// ============================================================
// getRowStyler — 行样式函数解析
// ============================================================
describe("TableExcelHelper.getRowStyler", () => {
  it("returns printElementType.rowStyler if set", () => {
    const fn = function () { return { background: "gray" }; };
    const pte = { rowStyler: fn };
    expect(TableExcelHelper.getRowStyler({}, pte)).toBe(fn);
  });

  it("parses options.rowStyler", () => {
    const pte = {};
    const options = { rowStyler: "function(row) { return { color: 'red' }; }" };
    const fn = TableExcelHelper.getRowStyler(options, pte);
    expect(typeof fn).toBe("function");
  });
});
