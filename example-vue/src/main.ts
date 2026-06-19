// ============================================================
// main.ts — Vue 应用入口
// ============================================================
// 1. 创建 Vue 应用 + Pinia
// 2. 导入 kuprint 库和 CSS
//
// 注意：jQuery 已通过 index.html 的 CDN <script> 加载，
// 在 kuprint ESM 模块之前执行，无需在此 import。
// ============================================================

import { createApp } from "vue";
import { createPinia } from "pinia";

// kuprint 核心库（ESM，导入后注册到 window.kuprint）
import "@kuki-lib/kuprint";

// kuprint CSS（通过包路径引用，Vite 自动解析）
import "@kuki-lib/kuprint/css";
import "@kuki-lib/kuprint/css/print";

// 动态注入 <link> 供 hiwprint 打印插件复制到打印 iframe
// hiwprint 只识别 <link rel="stylesheet">，不识别 Vite 注入的 <style>
function injectCSSLink(href: string) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}
injectCSSLink("/node_modules/@kuki-lib/kuprint/dist/css/kuprint.css");
injectCSSLink("/node_modules/@kuki-lib/kuprint/dist/css/print-lock.css");

import App from "./App.vue";

// Demo 自定义布局样式
import "./assets/styles/demo.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
