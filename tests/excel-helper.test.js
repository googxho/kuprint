// ============================================================
// tests/excel-helper.test.js — TableExcelHelper 表格逻辑测试
// ============================================================
import { describe, it, expect } from "vitest";
import "./mocks.js";
import TableExcelHelper from "../src/table/excel-helper.js";

// Note: These tests validate pure logic functions that don't need jQuery DOM mocks.
// The default import is the TableExcelHelper object.

// ---- helpers ----
function makeCol(id, opts = {}) {
  return {
    id: id || "col1",
    field: opts.field || "field1",
    title: opts.title || "Col 1",
    width: opts.width ?? 100,
    colspan: opts.colspan || 1,
    rowspan: opts.rowspan || 1,
    fixed: opts.fixed || false,
    columnId: opts.columnId,
    styler: opts.styler,
    styler2: opts.styler2,
    formatter: opts.formatter,
    formatter2: opts.formatter2,
    hasWidth: opts.hasWidth || false,
    targetWidth: opts.targetWidth,
    getTarget: opts.getTarget || (() => ({ style: {} })),
    setAlign: opts.setAlign || (() => {}),
    setVAlign: opts.setVAlign || (() => {}),
    getField:
      opts.getField ||
      function () {
        return this.field;
      },
    createTarget: opts.createTarget || (() => {}),
    toJson: opts.toJson || (() => ({})),
  };
}

// ============================================================
// getOrderedColumns
// ============================================================
describe("TableExcelHelper.getOrderedColumns", () => {
  it("returns single-layer columns in order", () => {
    const tree = { totalLayer: 1, 0: [makeCol("a"), makeCol("b"), makeCol("c")] };
    const r = TableExcelHelper.getOrderedColumns(tree);
    expect(r.map((c) => c.id)).toEqual(["a", "b", "c"]);
  });

  it("handles multi-layer with rowspans", () => {
    const tree = {
      totalLayer: 2,
      0: [makeCol("A", { rowspan: 2 }), makeCol("B", { rowspan: 1 })],
      1: [makeCol("B1"), makeCol("B2")],
    };
    const r = TableExcelHelper.getOrderedColumns(tree);
    expect(r.map((c) => c.id)).toEqual(["A", "B1", "B2"]);
  });

  it("returns undefined for empty tree", () => {
    expect(TableExcelHelper.getOrderedColumns({ totalLayer: 0 })).toBeUndefined();
  });
});

// ============================================================
// allAutoWidth / allFixedWidth
// ============================================================
describe("TableExcelHelper.allAutoWidth", () => {
  it("sums non-fixed widths", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100, fixed: false }),
        makeCol("b", { width: 50, fixed: false }),
        makeCol("c", { width: 30, fixed: true }),
      ],
    };
    expect(TableExcelHelper.allAutoWidth(tree)).toBe(150);
  });

  it("returns 0 when all fixed", () => {
    const tree = {
      rowColumns: [makeCol("a", { width: 100, fixed: true })],
    };
    expect(TableExcelHelper.allAutoWidth(tree)).toBe(0);
  });

  it("returns total when none fixed", () => {
    const tree = {
      rowColumns: [makeCol("a", { width: 100 }), makeCol("b", { width: 200 })],
    };
    expect(TableExcelHelper.allAutoWidth(tree)).toBe(300);
  });
});

describe("TableExcelHelper.allFixedWidth", () => {
  it("sums fixed widths", () => {
    const tree = {
      rowColumns: [
        makeCol("a", { width: 100, fixed: true }),
        makeCol("b", { width: 50, fixed: false }),
        makeCol("c", { width: 30, fixed: true }),
      ],
    };
    expect(TableExcelHelper.allFixedWidth(tree)).toBe(130);
  });

  it("returns 0 when none fixed", () => {
    const tree = {
      rowColumns: [makeCol("a", { width: 100 }), makeCol("b", { width: 50 })],
    };
    expect(TableExcelHelper.allFixedWidth(tree)).toBe(0);
  });
});

// ============================================================
// getColumnsWidth
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
    const r = TableExcelHelper.getColumnsWidth(tree, 200);
    expect(r.a).toBeCloseTo(50, 0);
    expect(r.b).toBeCloseTo(100, 0);
    expect(r.c).toBe(50);
  });

  it("handles zero remaining width", () => {
    const tree = {
      rowColumns: [makeCol("a", { width: 100, fixed: false })],
    };
    expect(TableExcelHelper.getColumnsWidth(tree, 0).a).toBe(0);
  });
});

// ============================================================
// syncTargetWidthToOption
// ============================================================
describe("TableExcelHelper.syncTargetWidthToOption", () => {
  it("syncs targetWidth for hasWidth columns", () => {
    const col = makeCol("a", { hasWidth: true, targetWidth: 120, width: 100 });
    const layer = { columns: [col] };
    TableExcelHelper.syncTargetWidthToOption([layer]);
    expect(col.width).toBe(120);
  });

  it("does not sync when hasWidth is false", () => {
    const col = makeCol("a", { hasWidth: false, targetWidth: 120, width: 100 });
    TableExcelHelper.syncTargetWidthToOption([{ columns: [col] }]);
    expect(col.width).toBe(100);
  });
});
