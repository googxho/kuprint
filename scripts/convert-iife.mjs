// ============================================================
// scripts/convert-iife.mjs — 移除 IIFE 包装
// ============================================================
// 运行：node scripts/convert-iife.mjs
//
// 处理以下模式：
//   Pattern A: var X = (function () { function X() {...} ... return X; })();
//   Pattern B: var C = (function (S) { __extends(C,S); function C(){S.call(this)}... return C; })(P);
// ============================================================

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "..", "src");

// Already converted
const DONE = new Set([
  "core/utils.js",
  "core/lib.js",
  "core/config.js",
  "core/print-element-option.js",
  "core/base-print-element.js",
  "options/text-options.js",
  "options/table-options.js",
  "options/border-layout-options.js",
  "options/data-format-options.js",
  "options/paper-options.js",
  "options/manager.js",
  "elements/text-option.js",
  "table/column.js",
  "table/row.js",
]);

// Gather all .js files recursively
function gatherFiles(dir, base = dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...gatherFiles(full, base));
    } else if (entry.endsWith(".js")) {
      const rel = relative(base, full);
      files.push(rel);
    }
  }
  return files;
}

const allFiles = gatherFiles(srcDir).filter((f) => !DONE.has(f));
console.log(`\n📁 Processing ${allFiles.length} files...\n`);

for (const rel of allFiles) {
  const fullPath = resolve(srcDir, rel);
  let code = readFileSync(fullPath, "utf8");
  let changed = false;

  // ================================================================
  // Pattern B first (extends):
  //   var Child = (function (_super) {\n    __extends(Child, _super);\n    function Child(...) {\n        var self = _super.call(this, ...) || this;
  // → function Child(...) {\n        var self = Parent.call(this, ...) || this;
  // + add __extends(Child, Parent); after constructor
  // ================================================================
  code = code.replace(
    /var (\w+) = \(function\s*\(_super\)\s*\{\s*\n\s*__extends\(\1,\s*_super\);\s*\n\s*function \1\(([^)]*)\)\s*\{\s*\n(\s*)var self = _super\.call\(this,/g,
    (match, child, params, indent) => {
      changed = true;
      return `function ${child}(${params}) {\n${indent}var self = /*PARENT*/.call(this,`;
    },
  );

  // Replace remaining _super.call(this patterns
  if (code.includes("_super.call(this")) {
    code = code.replace(/_super\.call\(this,/g, "/*PARENT*/.call(this,");
    changed = true;
  }
  if (code.includes("_super.prototype.")) {
    code = code.replace(/_super\.prototype\./g, "/*PARENT*/.prototype.");
    changed = true;
  }
  if (code.includes("_super)")) {
    code = code.replace(/= _super\)/g, "= /*PARENT*/)");
    changed = true;
  }

  // Remove: return Child;\n})(Parent);
  code = code.replace(
    /\n(\s*)return (\w+);\s*\n\}\)\((\w+)\);/g,
    (match, indent, child, parent) => {
      changed = true;
      // Replace earlier /*PARENT*/ placeholders
      code = code.replace(/\/\*PARENT\*\//g, parent);
      return `\n${indent}__extends(${child}, ${parent});`;
    },
  );

  // ================================================================
  // Pattern A (simple): var X = (function () {\n    function X(...) {
  // → function X(...) {
  // Remove: return X;\n})();
  // ================================================================
  code = code.replace(
    /var (\w+) = \(function\s*\(\)\s*\{\s*\n(\s*)function \1\(([^)]*)\)\s*\{/g,
    (match, name, indent, params) => {
      changed = true;
      return `function ${name}(${params}) {`;
    },
  );

  // Remove return X;\n})(); for simple cases
  code = code.replace(/\n(\s*)return (\w+);\s*\n\s*\}\)\(\);/g, (match, indent, name) => {
    changed = true;
    return "";
  });

  if (changed) {
    writeFileSync(fullPath, code);
    console.log(`  ✅ ${rel}`);
  } else {
    console.log(`  ⏭️  ${rel} (no changes)`);
  }
}

console.log(`\n🎉 Done!`);
console.log(`\n⚠️  Next steps:`);
console.log(`  1. Search for /*PARENT*/ placeholders and replace with actual parent class names`);
console.log(`  2. Add import statements at the top of each file`);
console.log(`  3. Add export statements at the bottom of each file`);
console.log(`  4. Run 'pnpm build' to test`);
