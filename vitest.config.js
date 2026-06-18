// ============================================================
// vitest.config.js — kuprint 测试配置
// ============================================================
/** @type {import("@voidzero-dev/vite-plus-test/config").UserConfig} */
export default {
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.js"],
  },
};
