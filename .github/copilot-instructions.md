# kuprint — Browser Print Template Designer

kuprint 是一个基于浏览器的可视化打印模板设计器。
源码使用纯 JavaScript 编写，依赖 jQuery，构建为单个 JS 文件供 `<script>` 标签引用。

## 项目结构

```
src/kuprint/
├── core/         核心模块（工具库、配置项、元素类）
├── table/        表格组件（列定义、行定义、可编辑表格）
├── paper/        纸张管理
├── panel/        设计面板 UI
├── template/     模板数据模型
├── manager/      元素类型管理
└── plugins/      jQuery 插件 + WebSocket
```

## 关键规则

- 所有源文件位于 `src/kuprint/`，使用纯 JavaScript
- 构建使用 `node scripts/build.js`，输出 `dist/kuprint.min.js`
- jQuery 是外部依赖，由用户自行引入
- 修改源码后需同步更新 `src/index.js` 中的 `@include:` 声明（如有新增文件）
- 不要在此文件中使用 TypeScript 或 ES Module `import/export`

## Vite+ 工具链

本项目使用 Vite+ 进行代码检查和格式化：

- `vp check` — 格式化和检查
- `vp test` — 运行测试（如有）
- `node scripts/build.js` — 构建打包（非 vp pack）
