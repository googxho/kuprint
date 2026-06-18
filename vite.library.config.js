// ============================================================
// vite.library.config.js — kuprint library 构建配置
// ============================================================
// 使用 Vite library mode 打包 kuprint。
// 源文件使用 ES Modules (import/export)，
// Vite 自动分析依赖图，不再需要手工拼接。
//
// 运行：npx vite build --config vite.library.config.js
// ============================================================

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================================
// Vite 配置（纯对象，不依赖 defineConfig）
// ============================================================
export default {
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "kuprint",
      formats: ["umd", "es"],
      fileName: (format) => (format === "es" ? "kuprint.esm.js" : "kuprint.umd.js"),
    },
    rollupOptions: {
      external: ["jquery"],
      output: {
        globals: { jquery: "jQuery" },
      },
    },
    minify: "esbuild",
    sourcemap: false,
  },
};
