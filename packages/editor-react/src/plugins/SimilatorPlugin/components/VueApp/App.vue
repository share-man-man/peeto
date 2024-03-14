<script setup lang="ts">
import { PropType, shallowRef, watchEffect } from 'vue';
import { VueRender } from '@peeto/render-vue';
import { VueAppProps } from './type';
import { SimilatorPluginConfig } from '../../type';

const { subConfig } = defineProps({
  subConfig: {
    type: Function as PropType<VueAppProps['subConfig']>,
    default: null,
  },
  onMapChange: {
    type: Function as PropType<VueAppProps['onMapChange']>,
    default: null,
  },
});

const delay = shallowRef<SimilatorPluginConfig['delay']>();
const schemaStr = shallowRef<SimilatorPluginConfig['schemaStr']>();
const packageList = shallowRef<SimilatorPluginConfig['packageList']>();

watchEffect(() => {
  subConfig((config: SimilatorPluginConfig) => {
    schemaStr.value = config.schemaStr;
    packageList.value = config.packageList;
    delay.value = config.delay;
  });
});
</script>

<template>
  <VueRender
    v-if="schemaStr && packageList"
    :schema-str="schemaStr"
    :package-list="packageList"
  >
    <template #loading><div>vue-loading</div></template>
    <template #noMatchPackage="{ packageName }">
      <div>木有包{{ packageName }}</div>
    </template>
    <template #noMatchComp="{ componentName }">
      <div>木有组件{{ componentName }}</div>
    </template>
  </VueRender>
</template>
../../../../components/EditorSimilator/type
