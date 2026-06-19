<script setup lang="ts">
import { ref, provide } from "vue";
import ElementPanel from "./components/ElementPanel.vue";
import Toolbar from "./components/Toolbar.vue";
import DesignCanvas from "./components/DesignCanvas.vue";
import PropertyPanel from "./components/PropertyPanel.vue";
import PreviewModal from "./components/PreviewModal.vue";
import { useKuprint } from "./composables/useKuprint";
import { useDesignerStore } from "./stores/designer";

const store = useDesignerStore();

// templateRef → kuprint 设计面板挂载点（位于 DesignCanvas 区域）
// optionsRef → kuprint 属性编辑器挂载点（位于 PropertyPanel 区域）
const templateRef = ref<HTMLElement>();
const optionsRef = ref<HTMLElement>();

// 初始化 kuprint 并注入 API 给所有子组件（Toolbar, PreviewModal 等需要）
const kuprintApi = useKuprint(templateRef, optionsRef);
provide("kuprint", kuprintApi);
</script>

<template>
  <div class="demo-layout">
    <!-- 左侧：拖拽元素面板 -->
    <ElementPanel />

    <!-- 中间：工具栏 + 设计面板 + 输出 -->
    <div class="demo-layout-content">
      <Toolbar />

      <DesignCanvas>
        <!-- kuprint 设计面板挂载到此容器 -->
        <div
          id="kuprint-printTemplate"
          ref="templateRef"
          class="kuprint-printTemplate"
          style="margin-top: 15px"
        ></div>
      </DesignCanvas>
    </div>

    <!-- 右侧：属性编辑面板 -->
    <PropertyPanel>
      <!-- kuprint 属性编辑器挂载到此容器 -->
      <div id="PrintElementOptionSetting" ref="optionsRef">
        <p style="color: #999; font-size: 13px; text-align: center; margin-top: 20px">
          点击设计面板中的元素<br />
          在此编辑属性
        </p>
      </div>
    </PropertyPanel>

    <!-- 预览弹窗 -->
    <PreviewModal v-if="store.showPreview" />
  </div>
</template>
