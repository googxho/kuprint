// ============================================================
// kuprint 2.5.4 - JavaScript 打印模板设计器
// ============================================================
//
// 📁 项目结构：
//   src/
//   ├── kuprint-lib-entry.js      ← Vite library 构建入口（唯一入口）
//   ├── index.js                  ← 本文件（项目说明，不参与构建）
//   ├── core/                     ← 核心模块
//   │   ├── utils.js              ← 工具库 + TextHelper
//   │   ├── config.js             ← kuprintConfig 全局配置
//   │   ├── lib.js                ← 纸张/图片工具库
//   │   ├── print-element-option.js ← 元素选项面板
//   │   └── base-print-element.js ← 所有打印元素基类
//   ├── options/                  ← 配置项（75 个，按功能分 5 类）
//   │   ├── text-options.js       ← 文本字体配置项（8 个）
//   │   ├── table-options.js      ← 表格样式配置项（14 个）
//   │   ├── border-layout-options.js ← 边框/布局配置项（13 个）
//   │   ├── data-format-options.js   ← 数据/格式化配置项（24 个）
//   │   ├── paper-options.js      ← 纸张/页眉页脚配置项（16 个）
//   │   └── manager.js            ← 配置项注册管理器
//   ├── table/                    ← 表格完整实现
//   │   ├── column.js / row.js    ← 表格行列定义
//   │   ├── excel-helper.js       ← Excel 导入辅助
//   │   ├── hitable.js            ← HiTale 可编辑表格（UI 层）
//   │   ├── table-element-type.js ← 表格元素类型注册
//   │   ├── table-element.js      ← 表格元素渲染
//   │   └── table-custom.js       ← 自定义表格元素
//   ├── elements/                 ← 打印元素实现
//   │   ├── text.js / image.js / longtext.js / html.js / lines.js
//   │   ├── text-option.js / table-custom-option.js
//   ├── manager/                  ← 元素类型管理器
//   ├── paper/                    ← Paper 纸张
//   ├── template/                 ← PrintTemplate 模板
//   ├── panel/                    ← PrintPanel 设计面板
//   └── plugins/                  ← jQuery 插件 + WebSocket
//
// 🔧 构建：
//   pnpm build  或  node scripts/build.mjs
//   产物：dist/kuprint.umd.js  dist/kuprint.esm.js  dist/kuprint.min.js
//
// ⚠️ 此文件不参与构建，仅供文档参考。
//   真正的构建入口是 src/kuprint-lib-entry.js。
//
// 📦 外部依赖：jQuery、jQuery UI、minicolors、JsBarcode、qrcode、jsPDF
//
// Copyright (c) 2016-2021 www.hinnn.com. All rights reserved.
// Licensed under LGPL or commercial licenses.
// ============================================================

// ============================================================
// kuprint - Browser Print Template Designer
// ============================================================
// 入口文件：按依赖顺序引入所有模块。
// 构建时这些模块会被合并为单个 kuprint.js 文件。
// ============================================================

// ============================================================
// 第一步：核心工具库（按依赖层次加载）
// ============================================================

// 1. 工具函数 —— 事件系统、单位转换、节流防抖、数据处理
"@include:./core/utils.js"

// 2. 打印工具库 —— 纸张尺寸、GUID、图片转换
"@include:./core/lib.js"

// 3. 配置项管理器 —— 75 个可配置选项类
"@include:./core/option-items.js"

// 4. 全局配置 —— kuprintConfig 元素类型配置中心
"@include:./core/config.js"

// 5. 元素选项 —— PrintElementOption 属性面板管理
"@include:./core/print-element-option.js"

// ============================================================
// 第二步：表格组件（元素类的依赖）
// ============================================================

// 6. 表格列定义
"@include:./table/column.js"

// 7. 表格行定义
"@include:./table/row.js"

// 8. Excel 数据导入辅助
"@include:./table/excel-helper.js"

// ============================================================
// 第三步：打印元素类（核心）
// ============================================================

// 9. 所有打印元素类（text/image/longText/html/hline/vline/rect/oval/table/tableCustom）
//    以及 HiTale 可编辑表格
"@include:./core/base-print-element.js"

// 10. HiTale 可编辑表格 + 各元素具体实现
"@include:./table/hitable.js"

// ============================================================
// 第四步：上层组件
// ============================================================

// 11. Paper 纸张管理
"@include:./paper/paper.js"

// 12. PrintTemplate 模板数据模型
"@include:./template/template.js"

// 13. PrintPanel 设计面板（核心 UI 组件）
"@include:./panel/panel.js"

// ============================================================
// 第五步：管理器和插件
// ============================================================

// 14. 元素类型管理器
"@include:./manager/element-type-manager.js"

// 15. jQuery 插件 + WebSocket 客户端
"@include:./plugins/jquery-plugins.js"
