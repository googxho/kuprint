// ============================================================
// scripts/build.mjs — kuprint 构建入口
// ============================================================
// 调用 Vite library build（esbuild 压缩）。
// 产物：dist/kuprint.umd.js  dist/kuprint.esm.js  dist/kuprint.min.js
// ============================================================

import { execSync } from "child_process";
import { copyFileSync, mkdirSync, rmSync, existsSync } from "fs";
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

  // 复制 CSS 文件
  const srcCss = resolve(root, "src", "css");
  const distCss = resolve(dist, "css");
  if (!existsSync(distCss)) mkdirSync(distCss, { recursive: true });
  copyFileSync(resolve(srcCss, "kuprint.css"), resolve(distCss, "kuprint.css"));
  console.log("  ✔ css/kuprint.css");
  copyFileSync(resolve(srcCss, "print-lock.css"), resolve(distCss, "print-lock.css"));
  console.log("  ✔ css/print-lock.css");

  // 复制 CSS 引用的图片资源
  const srcCssImage = resolve(srcCss, "image");
  const distCssImage = resolve(distCss, "image");
  if (existsSync(srcCssImage)) {
    if (!existsSync(distCssImage)) mkdirSync(distCssImage, { recursive: true });
    copyFileSync(
      resolve(srcCssImage, "jquery.minicolors.png"),
      resolve(distCssImage, "jquery.minicolors.png"),
    );
    console.log("  ✔ css/image/jquery.minicolors.png");
  }

  // 清理 sourcemap（不发布）
  ["kuprint.umd.js.map", "kuprint.esm.js.map"].forEach((f) => {
    const p = resolve(dist, f);
    if (existsSync(p)) rmSync(p);
  });

  console.log("✅ Build complete!\n");
}
