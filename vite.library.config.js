// ============================================================
// vite.library.config.js — kuprint library 构建配置
// ============================================================
// 使用 Vite library mode 打包 kuprint。
// 内置虚拟模块插件，在构建时动态拼接所有源码模块。
//
// 运行：npx vite build --config vite.library.config.js
// ============================================================

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");

// ============================================================
// 模块加载顺序（与原始 kuprint.js 完全一致）
// ============================================================
const INCLUDE_ORDER = [
  "core/utils.js",
  "options/text-options.js",
  "options/table-options.js",
  "options/border-layout-options.js",
  "options/data-format-options.js",
  "options/paper-options.js",
  "options/manager.js",
  "core/config.js",
  "core/lib.js",
  "core/print-element-option.js",
  "table/column.js",
  "table/row.js",
  "table/excel-helper.js",
  "core/base-print-element.js",
  "table/table-element.js",
  "elements/text-option.js",
  "elements/table-custom-option.js",
  "elements/text.js",
  "elements/image.js",
  "elements/longtext.js",
  "elements/html.js",
  "elements/lines.js",
  "table/table-custom.js",
  "table/hitable.js",
  "table/table-element-type.js",
  "manager/element-type-manager.js",
  "paper/paper.js",
  "template/template.js",
  "panel/panel.js",
  "plugins/jquery-plugins.js",
];

// ============================================================
// Vite 插件：构建时动态拼接所有源码
// ============================================================
function kuprintPlugin() {
  const virtualModuleId = "virtual:kuprint-bundle";
  const resolvedId = "\0" + virtualModuleId;

  return {
    name: "kuprint-concat",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        console.log("\n📦 Concatenating " + INCLUDE_ORDER.length + " modules…");
        let merged = "";
        for (const relPath of INCLUDE_ORDER) {
          const fullPath = resolve(srcDir, relPath);
          if (!existsSync(fullPath)) {
            throw new Error("File not found: " + fullPath);
          }
          merged += readFileSync(fullPath, "utf8") + "\n";
          console.log("  ✓ " + relPath);
        }
        console.log(
          "  ✔ Bundle: " + merged.split("\n").length.toLocaleString() + " lines\n"
        );
        return merged;
      }
    },
  };
}

// ============================================================
// Vite 配置（纯对象，不依赖 defineConfig）
// ============================================================
export default {
  plugins: [kuprintPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/kuprint-lib-entry.js"),
      name: "kuprint",
      formats: ["umd", "es"],
      fileName: (format) =>
        format === "es" ? "kuprint.esm.js" : "kuprint.umd.js",
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
