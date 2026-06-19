# kuprint 🖨️

> 基于浏览器的可视化打印模板设计器 · TypeScript 支持

kuprint 让你在浏览器中通过拖拽方式设计打印模板。支持文本、图片、条形码、二维码、表格、线条、矩形等多种元素，适用于标签打印、发票设计、报表生成等场景。

[![npm](https://img.shields.io/npm/v/@kuki-lib/kuprint)](https://www.npmjs.com/package/@kuki-lib/kuprint)
[![license](https://img.shields.io/npm/l/@kuki-lib/kuprint)](LICENSE)
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

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<!-- kuprint 核心 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@kuki-lib/kuprint/dist/css/kuprint.css" />
<script src="https://cdn.jsdelivr.net/npm/@kuki-lib/kuprint/dist/kuprint.min.js"></script>
```

### npm

```bash
npm install @kuki-lib/kuprint jquery
```

```ts
// 核心库
import "@kuki-lib/kuprint";

// 核心样式
import "@kuki-lib/kuprint/css";
import "@kuki-lib/kuprint/css/print"; // 打印锁样式
```

> ⚠️ **jQuery 是必需的前置依赖**（`peerDependencies`）。在浏览器中使用时，请确保在 kuprint 之前加载 jQuery。

### TypeScript

```ts
import "@kuki-lib/kuprint";

// 完整的类型提示，无需额外配置
const template = new kuprint.PrintTemplate({
  settingContainer: "#options",
  paginationContainer: "#pagination",
});

template.design("#designer");

// getHtml / getJson / print 等所有方法都有类型
const html: JQuery = template.getHtml(data, { imgToBase64: true });
```

## 📦 包入口一览

| 入口                          | 说明       |
| ----------------------------- | ---------- |
| `@kuki-lib/kuprint`           | 核心库     |
| `@kuki-lib/kuprint/css`       | 核心样式   |
| `@kuki-lib/kuprint/css/print` | 打印锁样式 |

## 🚀 快速开始

### 浏览器（CDN）

```html
<!doctype html>
<html>
  <head>
    <title>kuprint 快速开始</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@kuki-lib/kuprint/dist/css/kuprint.css"
    />
  </head>
  <body>
    <div id="designer"></div>
    <div id="options"></div>

    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@kuki-lib/kuprint/dist/kuprint.min.js"></script>
    <script>
      kuprint.init();
      var template = new kuprint.PrintTemplate({
        settingContainer: "#options",
      });
      template.design("#designer");

      // 获取打印 HTML
      var html = template.getHtml({ field1: "值1" });
      // 打印
      template.print({ field1: "值1" });
      // 导出模板 JSON
      var json = template.getJson();
    </script>
  </body>
</html>
```

### Vue 3 项目

参见 [`example-vue/`](./example-vue) 目录的完整 Vue 3 + Pinia + TypeScript 实现。

```ts
// main.ts
import "@kuki-lib/kuprint";
import "@kuki-lib/kuprint/css";
import "@kuki-lib/kuprint/css/print";
```

## 📁 Demo 项目

| 项目           | 技术栈                         | 位置                            |
| -------------- | ------------------------------ | ------------------------------- |
| 原生 HTML Demo | jQuery + Bootstrap             | [`example/`](./example)         |
| Vue 3 Demo     | **Vue 3.5 + Pinia 3 + Vite 8** | [`example-vue/`](./example-vue) |

> 💡 Vue Demo 启动：
>
> ```bash
> cd example-vue
> pnpm install
> pnpm dev
> ```

## 🏗️ 项目结构

```

kuprint/
├── src/
│ ├── index.ts ← 构建入口
│ ├── kuprint.d.ts ← TypeScript 类型声明
│ ├── core/ ← 核心模块
│ │ ├── utils.ts ← 工具函数（事件、单位转换等）
│ │ ├── config.ts ← 全局配置 KuPrintConfig
│ │ ├── lib.ts ← 纸张尺寸、GUID、图片转换
│ │ ├── print-element-option.ts ← 元素选项属性管理
│ │ └── base-print-element.ts ← 所有打印元素基类（35+ 方法）
│ ├── options/ ← 25+ 个可配置选项（字体/边框/数据/纸张）
│ ├── elements/ ← 元素实现（text/image/longtext/html/lines）
│ ├── table/ ← 表格组件（行列定义、渲染、编辑）
│ ├── manager/ ← 元素类型注册与创建
│ ├── paper/ ← 纸张管理（分页、页眉页脚、页码）
│ ├── template/ ← PrintTemplate 模板数据模型
│ ├── panel/ ← PrintPanel 可视化设计面板
│ └── plugins/ ← jQuery 插件 + WebSocket + 公开 API
├── example/ ← 原生 HTML Demo（jQuery + Bootstrap）
├── example-vue/ ← Vue 3 Demo（Vue 3.5 + Pinia 3 + Vite 8）
├── dist/ ← 构建产物
│ ├── kuprint.umd.js ← 核心 UMD
│ ├── kuprint.esm.js ← 核心 ESM
│ ├── kuprint.min.js ← 核心 min（= kuprint.umd.js）
│ ├── kuprint.d.ts ← 类型声明
│ └── css/
│   ├── kuprint.css ← 核心样式
│   ├── print-lock.css ← 打印锁样式
│   └── image/ ← CSS 图片资源
├── scripts/ ← 构建脚本
└── tests/ ← 单元测试

```

## 🔧 开发

```bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 类型检查
pnpm check

# 单元测试
pnpm test

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

## 🤝 贡献

欢迎提交 PR 和 Issue！

### Commit 规范

本仓库使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

| 类型       | 说明                     |
| ---------- | ------------------------ |
| `feat`     | 新功能                   |
| `fix`      | Bug 修复                 |
| `docs`     | 文档变更                 |
| `refactor` | 重构（不涉及功能或修复） |
| `style`    | 代码格式（不影响功能）   |
| `test`     | 测试相关                 |
| `chore`    | 构建/工具/依赖变更       |

提交信息示例：

```
feat: 新增水印元素支持
fix(core): 修复长文本分页偏移量计算错误
docs: 更新快速开始示例
```

> 项目使用 `bumpp` 管理版本号，发布时自动根据提交生成 changelog。

### PR 流程

1. Fork 仓库并创建特性分支
2. 确保通过类型检查：`pnpm check`
3. 确保测试通过：`pnpm test`
4. 提交 PR 并描述变更内容

## 🌐 浏览器兼容性

Chrome、Firefox、Safari、Edge 等所有现代浏览器。

## 📄 许可证

[LGPL-3.0](LICENSE)
