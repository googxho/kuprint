# kuprint 🖨️

> 基于浏览器的可视化打印模板设计器 · TypeScript 支持

kuprint 让你在浏览器中通过拖拽方式设计打印模板。支持文本、图片、条形码、二维码、表格、线条、矩形等多种元素，适用于标签打印、发票设计、报表生成等场景。

[![npm](https://img.shields.io/npm/v/kuprint)](https://www.npmjs.com/package/kuprint)
[![license](https://img.shields.io/npm/l/kuprint)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-✓-3178c6)](https://www.typescriptlang.org/)

---

## ✨ 特性

- **可视化设计** — 拖拽式操作，所见即所得
- **丰富元素** — 文本、图片、条形码、二维码、长文本、HTML、横线、竖线、矩形、椭圆、自动表格、自定义表格
- **自动分页** — 长文本和表格自动跨页，固定元素每页重复
- **纸张支持** — A0–A10、B0–B10，以及自定义尺寸
- **数据驱动** — 字段绑定，JSON 数据动态渲染
- **远程打印** — 内置 WebSocket 客户端
- **PDF 导出** — 配合 jsPDF / html2canvas
- **TypeScript 支持** — 完整的类型声明文件

## 📦 安装

### CDN（最简单）

```html
<!-- jQuery 是前置依赖 -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<!-- kuprint -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/kuprint/dist/kuprint.css" />
<script src="https://cdn.jsdelivr.net/npm/kuprint/dist/kuprint.min.js"></script>
```

### npm

```bash
npm install kuprint jquery
```

```js
// ES Module
import "kuprint";

// CommonJS
require("kuprint");
```

### TypeScript

```ts
import "kuprint";

// 完整的类型提示，无需额外配置
const template = new PrintTemplate({
  settingContainer: "#options",
  paginationContainer: "#pagination",
});

template.design("#designer");

// getHtml / getJson / print / toPdf 等所有方法都有类型
const html: JQuery = template.getHtml(data, { imgToBase64: true });
```

> ⚠️ **jQuery 是必需的前置依赖**（`peerDependencies`）。请确保在 kuprint 之前加载 jQuery。

## 🚀 快速开始

```html
<div id="designer"></div>
<div id="options"></div>

<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kuprint/dist/kuprint.min.js"></script>
<script>
  // 1. 初始化
  kuprint.init();

  // 2. 注册自定义元素类型（可选）
  kuprint.PrintElementTypeManager.build("#element-panel", "my-module");

  // 3. 创建模板
  var template = new kuprint.PrintTemplate({
    settingContainer: "#options", // 右侧属性面板
    paginationContainer: "#pagination", // 底部分页器
  });

  // 4. 渲染设计面板
  template.design("#designer");

  // 5. 获取打印 HTML
  var html = template.getHtml({ field1: "值1", field2: "值2" });

  // 6. 打印
  template.print({ field1: "值1" });

  // 7. 导出 PDF
  template.toPdf(data, "output.pdf");

  // 8. 导出 / 导入 JSON
  var json = template.getJson(); // 完整 JSON
  var tidJson = template.getJsonTid(); // 带 TID 的 JSON
  var restored = new kuprint.PrintTemplate({ template: json });
</script>
```

## 🏗️ 项目结构

```
kuprint/
├── src/
│   ├── index.ts                  ← 构建入口
│   ├── kuprint.d.ts             ← TypeScript 类型声明
│   ├── core/                     ← 核心模块
│   │   ├── utils.ts              ← 工具函数（事件、单位转换等）
│   │   ├── config.ts             ← 全局配置 KuPrintConfig
│   │   ├── lib.ts                ← 纸张尺寸、GUID、图片转换
│   │   ├── print-element-option.ts ← 元素选项属性管理
│   │   └── base-print-element.ts ← 所有打印元素基类（35+ 方法）
│   ├── options/                  ← 25+ 个可配置选项（字体/边框/数据/纸张）
│   ├── elements/                 ← 元素实现（text/image/longtext/html/lines）
│   ├── table/                    ← 表格组件（行列定义、渲染、编辑）
│   ├── manager/                  ← 元素类型注册与创建
│   ├── paper/                    ← 纸张管理（分页、页眉页脚、页码）
│   ├── template/                 ← PrintTemplate 模板数据模型
│   ├── panel/                    ← PrintPanel 可视化设计面板
│   └── plugins/                  ← jQuery 插件 + WebSocket + 公开 API
├── example/                      ← 完整 Demo
├── dist/                         ← 构建产物
├── scripts/                      ← 构建脚本
└── tests/                        ← 单元测试
```

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 类型检查
pnpm check

# 监听模式
pnpm dev

# 打开 example/index.html 即可调试
```

构建系统：**Vite**（library mode）+ **TypeScript**。产物包括 UMD、ESM、Minified 三种格式 + 类型声明文件。

## 📤 发布

```bash
# 修 bug → 自动 2.5.4 → 2.5.5
npm run release:patch

# 新功能 → 自动 2.5.4 → 2.6.0
npm run release:minor

# 大改 → 自动 2.5.4 → 3.0.0
npm run release:major

# 带 2FA 验证码（npm 要求双因素认证）
npm run release:patch -- --otp 123456

# 测试版
npm run release:beta
```

一键完成：**版本号升级 → 类型检查 → 构建 → 发布 → Git commit → Git tag → Push**。

## 🌐 浏览器兼容性

Chrome、Firefox、Safari、Edge 等所有现代浏览器。

## 📄 许可证

[LGPL-3.0](LICENSE)
