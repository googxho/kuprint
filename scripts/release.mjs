// ============================================================
// scripts/release.mjs — 一键发布脚本
// ============================================================
// 用法：
//   node scripts/release.mjs patch              → 2.5.4 → 2.5.5
//   node scripts/release.mjs minor              → 2.5.4 → 2.6.0
//   node scripts/release.mjs patch --otp 123456 → 带 2FA 验证码
//
// 流程：版本升级(bumpp 自动 commit/tag/push) → 类型检查 → 构建 → 发布
// ============================================================

import { execSync } from "child_process";

const args = process.argv.slice(2);
const releaseType = args[0];
const otpIndex = args.indexOf("--otp");
const otp = otpIndex >= 0 ? args[otpIndex + 1] : undefined;

if (!releaseType || !["patch", "minor", "major", "prerelease"].includes(releaseType)) {
  console.error("Usage: node scripts/release.mjs <patch|minor|major|prerelease> [--otp <code>]");
  process.exit(1);
}

function run(cmd, label) {
  console.log(`\n▶ ${label}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  // 1. 版本升级（bumpp 自动 commit + tag + push）
  run(`npx bumpp -y -p ${releaseType}`, "1/4 版本升级");

  // 2. 类型检查
  run("npx tsc --noEmit", "2/4 类型检查");

  // 3. 构建
  run("node scripts/build.mjs", "3/4 构建");

  // 4. 发布
  const pubCmd = otp ? `npm publish --otp=${otp}` : "npm publish";
  run(pubCmd, "4/4 发布到 npm");

  const version = JSON.parse(
    execSync(
      "node -e \"console.log(JSON.stringify(require('./package.json').version))\"",
    ).toString(),
  );
  console.log(`\n✅ v${version} 发布完成！`);
} catch (e) {
  console.error("\n❌ 发布失败:", e.message);
  process.exit(1);
}
