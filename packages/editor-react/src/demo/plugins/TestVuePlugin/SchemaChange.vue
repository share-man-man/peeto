<script setup lang="ts">
import { ref, defineProps, PropType } from 'vue';
import { ElButton } from 'element-plus';
import type { InjectPluginCompProps } from '../../components/EditorWorkbench/type';

const props = defineProps({
  subscribeEvent: {
    type: Function as PropType<InjectPluginCompProps['subscribeEvent']>,
    default: null,
  },
  dispatchEvent: {
    type: Function as PropType<InjectPluginCompProps['dispatchEvent']>,
    default: null,
  },
});

const schema = ref<string>();

props.subscribeEvent?.([
  {
    name: 'onSchemaChange',
    run: (v) => {
      schema.value = v;
    },
  },
]);
</script>

<template>
  <div>
    Button
    <div>
      <el-button>vue-插件</el-button>
      {{ schema }}
    </div>
  </div>
</template>
