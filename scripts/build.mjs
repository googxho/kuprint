// ============================================================
// scripts/build.mjs — kuprint 构建入口
// ============================================================
// 调用 Vite library build（esbuild 压缩）。
// 产物：dist/kuprint.umd.js  dist/kuprint.esm.js  dist/kuprint.min.js
// ============================================================

import { execSync } from "child_process";
import { copyFileSync, rmSync, existsSync } from "fs";
import { resolve } from "path";

const root = new URL("..", import.meta.url).pathname;
const dist = resolve(root, "dist");
const watch = process.argv.includes("--watch") || process.argv.includes("-w");

const args = ["npx", "vite", "build", "--config", "vite.library.config.js"];
if (watch) args.push("--watch");

execSync(args.join(" "), { stdio: "inherit", cwd: root });

// UMD 即 CDN 压缩版，复制一份方便引用
if (!watch) {
  copyFileSync(resolve(dist, "kuprint.umd.js"), resolve(dist, "kuprint.min.js"));
  console.log("  ✔ kuprint.min.js  (= kuprint.umd.js)");

  // 复制类型声明文件
  copyFileSync(resolve(root, "src", "kuprint.d.ts"), resolve(dist, "kuprint.d.ts"));
  console.log("  ✔ kuprint.d.ts");

  // 清理 sourcemap（不发布）
  ["kuprint.umd.js.map", "kuprint.esm.js.map"].forEach((f) => {
    const p = resolve(dist, f);
    if (existsSync(p)) rmSync(p);
  });

  console.log("✅ Build complete!\n");
}
