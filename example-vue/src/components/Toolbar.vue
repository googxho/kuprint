<script setup lang="ts">
/**
 * Toolbar.vue — 纸张切换与操作工具栏
 */
import { useKuprint } from "@/composables/useKuprint";
import { inject } from "vue";

const { setPaper, rotatePaper, clearTemplate, print, getJson, getHtml, preview } = inject(
  "kuprint",
) as ReturnType<typeof useKuprint>;

const paperSizes = ["A3", "A4", "A5", "B3", "B4", "B5"];

function handleSetPaper(size: string) {
  setPaper(size);
}

function handleCustomPaper() {
  const w = (document.getElementById("customWidth") as HTMLInputElement)?.value;
  const h = (document.getElementById("customHeight") as HTMLInputElement)?.value;
  if (w && h) setPaper(w, h);
}
</script>

<template>
  <div class="demo-toolbar">
    <!-- 纸张尺寸 -->
    <button v-for="size in paperSizes" :key="size" class="demo-btn" @click="handleSetPaper(size)">
      {{ size }}
    </button>

    <!-- 自定义纸张 -->
    <input id="customWidth" class="demo-input" type="text" placeholder="宽/mm" />
    <span class="demo-label">×</span>
    <input id="customHeight" class="demo-input" type="text" placeholder="高/mm" />
    <button class="demo-btn" @click="handleCustomPaper">自定义</button>

    <!-- 分隔 -->
    <span style="color: #ddd; margin: 0 2px">|</span>

    <!-- 操作 -->
    <button class="demo-btn" @click="rotatePaper">旋转</button>
    <button class="demo-btn" @click="clearTemplate">清空</button>

    <span style="color: #ddd; margin: 0 2px">|</span>

    <!-- 预览与打印 -->
    <button class="demo-btn demo-btn-danger" @click="preview">快速预览</button>
    <button class="demo-btn demo-btn-danger" @click="print">打印</button>

    <span style="color: #ddd; margin: 0 2px">|</span>

    <!-- JSON / HTML -->
    <button class="demo-btn demo-btn-primary" @click="getJson">导出 JSON</button>
    <button class="demo-btn demo-btn-success" @click="getHtml">生成 HTML</button>
  </div>
</template>
