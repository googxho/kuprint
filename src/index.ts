// ============================================================
// kuprint-lib-entry.js — Vite library 构建入口
// ============================================================
// 按依赖层顺序导入所有模块。
// Vite 根据 import/export 关系自动构建依赖图并打包。
// ============================================================

// L1: 基础工具库（无内部依赖）
import "./core/utils.js";

// L2: 配置项注册（注册到 manager）
import "./options/text-options.js";
import "./options/table-options.js";
import "./options/border-layout-options.js";
import "./options/data-format-options.js";
import "./options/paper-options.js";
import "./options/manager.js";

// L3: 核心库（依赖 utils + manager）
import "./core/config.js";
import "./core/lib.js";
import "./core/print-element-option.js";

// L4: 表格行列
import "./table/column.js";
import "./table/row.js";
import "./table/excel-helper.js";

// L5: 打印元素基类 + 选项类
import "./core/base-print-element.js";
import "./table/table-element.js";
import "./elements/text-option.js";
import "./elements/table-custom-option.js";

// L6: 具体元素实现
import "./elements/text.js";
import "./elements/image.js";
import "./elements/longtext.js";
import "./elements/html.js";
import "./elements/lines.js";
import "./table/table-custom.js";
import "./table/hitable.js";
import "./table/table-element-type.js";

// L7: 上层组件（管理器 → 纸张 → 模板 → 面板）
import "./manager/element-type-manager.js";
import "./paper/paper.js";
import "./template/template.js";
import "./panel/panel.js";

// L8: jQuery 插件 + 公开 API（组装最终 kuprint 命名空间）
import "./plugins/jquery-plugins.js";
