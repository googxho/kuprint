// ============================================================
// scripts/convert-to-esm.mjs — 批量转换 IIFE 到 ESM
// ============================================================
// 用于将旧的 (function() { ... })() 模式转为 ESM。
// 运行：node scripts/convert-to-esm.mjs
// ============================================================

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "..", "src");

// Files already converted (skip these)
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

// Files that still have IIFE wrappers to convert
const FILES_TO_CONVERT = [
  "table/excel-helper.js",
  "table/table-element.js",
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
];

// ============================================================
// Pattern 1: var Xxx = (function () { function Xxx() {...} ... return Xxx; })();
// → function Xxx() {...} Xxx.prototype.xxx = ...;
// ============================================================
function unwrapSimpleIIFE(code) {
  return code.replace(
    /var (\w+) = \(function\s*\(\)\s*\{\s*\n(\s*)function \1\(([^)]*)\)\s*\{/g,
    (match, name, indent, params) => {
      return `function ${name}(${params}) {`;
    },
  );
}

// ============================================================
// Pattern 2: var Child = (function (_super) { __extends(Child,_super); function Child(...) { ... } ... return Child; })(Parent);
// → function Child(...) { var self = Parent.call(this, ...) || this; ... } __extends(Child, Parent);
// ============================================================
function unwrapExtendsIIFE(code) {
  return code.replace(
    /var (\w+) = \(function\s*\(_super\)\s*\{\s*__extends\(\1,\s*_super\);\s*function \1\(([^)]*)\)\s*\{/g,
    (match, childName, params) => {
      return `function ${childName}(${params}) {`;
    },
  );
}

// Replace _super.call(this, ...) pattern with Parent.call(this, ...)
// We can't know the parent name from the regex, so we just replace _super references
function replaceSuperReferences(code) {
  return code.replace(/_super\.call\(this/g, "/*PARENT*/.call(this");
}

// Replace return Child; })(); pattern with just __extends(Child, Parent); at the end
function fixExtendsEnding(code) {
  return code.replace(/return (\w+);\s*\}\)\((\w+)\);/g, (match, childName, parentName) => {
    return `__extends(${childName}, ${parentName});`;
  });
}

// ============================================================
// Convert a single file
// ============================================================
function convertFile(relPath) {
  const fullPath = resolve(srcDir, relPath);
  let code = readFileSync(fullPath, "utf8");

  // Remove simple IIFE wrappers
  code = unwrapSimpleIIFE(code);

  // Remove extends IIFE wrappers
  code = unwrapExtendsIIFE(code);

  // Fix _super references
  code = replaceSuperReferences(code);

  // Fix extends endings
  code = fixExtendsEnding(code);

  // Write back
  writeFileSync(fullPath, code);
  console.log("  ✓ " + relPath);
}

// ============================================================
// Main
// ============================================================
console.log("\n🔧 Converting IIFE patterns to ESM...\n");
FILES_TO_CONVERT.forEach(convertFile);
console.log("\n✅ Done! " + FILES_TO_CONVERT.length + " files processed.");
console.log("\n⚠️  You still need to manually add:");
console.log("  - import statements at the top of each file");
console.log("  - export statements at the bottom of each file");
console.log("  - replace /*PARENT*/ with the actual parent class name\n");
