<script setup lang="ts">
import { ref, PropType } from 'vue';
import { ElButton } from 'element-plus';
import type { InjectPluginCompProps } from '../../../type';

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
    name: '__peeto_similator_config_change_event',
    run: (v) => {
      schema.value = v.schemaStr;
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
