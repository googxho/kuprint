// ============================================================
// kuprint-lib-entry.js — Vite library mode 入口
// ============================================================
// 导入虚拟模块 virtual:kuprint-bundle，
// 该模块由 vite.library.config.js 中的 kuprintPlugin 在构建时动态拼接生成。
// ============================================================

import "virtual:kuprint-bundle";
