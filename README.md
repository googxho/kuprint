# kuprint 🖨️

> Browser-based Print Template Designer — 基于浏览器的可视化打印模板设计器

kuprint 让你在浏览器中通过拖拽方式设计打印模板。支持文本、图片、条形码、二维码、表格、线条、矩形等多种元素，适用于标签打印、发票设计、报表生成等场景。

## ✨ 特性

- **可视化设计** — 拖拽式操作，所见即所得的打印模板编辑
- **丰富的元素类型** — 文本、图片、条形码、二维码、长文本、HTML、水平线、垂直线、矩形、椭圆、自动表格、自定义表格
- **自动分页** — 长文本/表格自动跨页，固定元素每页重复
- **纸张支持** — A0-A10、B0-B10、Letter、Legal、自定义尺寸
- **数据驱动** — 支持字段绑定，从 JSON 数据动态生成打印内容
- **远程打印** — 内置 WebSocket 客户端，可连接打印服务端
- **导出能力** — 支持导出为 PDF（需配合 jsPDF/html2canvas）

## 📦 安装

### 通过 `<script>` 标签（最简单）

```html
<!-- 依赖：jQuery -->
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
<!-- kuprint -->
<script src="https://cdn.jsdelivr.net/npm/kuprint/dist/kuprint.min.js"></script>
```

### 通过 npm

```bash
npm install kuprint
```

```javascript
// ES Module
import "kuprint";

// CommonJS
require("kuprint");
```

> **注意**：kuprint 依赖 jQuery，请确保在使用前已加载 jQuery。

## 🚀 快速开始

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/kuprint/css/kuprint.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/kuprint/css/print-lock.css">
</head>
<body>
  <!-- 设计面板容器 -->
  <div id="kuprint-panel" style="height: 600px;"></div>

  <!-- 依赖 -->
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/kuprint/dist/kuprint.min.js"></script>

  <script>
    // 1. 初始化模板
    var template = new PrintTemplate();

    // 2. 创建设计面板
    var panel = new PrintPanel("#kuprint-panel", {
      template: template
    });

    // 3. 获取模板数据（JSON，可保存到服务端）
    var templateJson = template.getData();
    console.log(templateJson);

    // 4. 打印（jQuery 插件方式）
    $("#kuprint-panel").kuprint("print");
  </script>
</body>
</html>
```

## 📖 核心概念

| 概念 | 说明 |
|------|------|
| **PrintTemplate** | 打印模板数据模型，包含纸张设置和所有元素配置 |
| **PrintPanel** | 可视化设计面板，提供拖拽编辑界面 |
| **Paper** | 一张打印纸，管理该页上的元素分页和渲染 |
| **PrintElement** | 打印元素（文本/图片/表格/线条等） |
| **OptionItem** | 属性面板中的可配置项（字体大小/颜色/边框等） |

## 🔧 配置

```javascript
// 全局配置
KuPrintConfig.Instance.init({
  movingDistance: 1.5,  // 键盘移动步长(pt)
  paperHeightTrim: 1,   // 纸张高度修剪

  // 自定义文本元素支持的选项
  text: {
    supportOptions: [
      { name: "title", hidden: false },
      { name: "field", hidden: false },
      // ... 更多选项
    ]
  }
});
```

## 🌐 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## 📄 许可证

[LGPL-3.0](LICENSE)

## 🙏 致谢

本项目基于 [kuprint](http://www.hinnn.com) 重构，感谢原作者的贡献。

---

**kuprint** — Make Print Templates Easy.

## 🧪 本地 Demo

克隆仓库后，可以运行内置的 demo 来验证功能：

```bash
git clone https://github.com/kuprint/kuprint.git
cd kuprint
npm install
npm run build       # 构建 dist/kuprint.js
```

然后用浏览器打开 `example/index.html` 即可看到完整的拖拽设计器 demo。

Demo 包括：
- ✅ 可视化拖拽设计（文本/图片/长文/表格/线条/矩形/椭圆）
- ✅ 纸张切换（A3/A4/A5/B3/B4/B5 / 自定义尺寸）
- ✅ 属性面板编辑（字体/颜色/边框/对齐等）
- ✅ 打印预览 & 直接打印
- ✅ JSON 导入导出
- ✅ HTML 预览
