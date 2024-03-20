<script setup lang="ts">
import { PropType, VNode, h, shallowRef, watch } from 'vue';
import { VueRender, VueRenderProps } from '@peeto/render-vue';
import { VueAppProps } from './type';
import {
  AppActionRef,
  SimilatorPluginCompDomMap,
  SimilatorPluginConfig,
} from '../../type';
import { getCompDomMap } from './util';

const props = defineProps({
  actionRef: {
    type: Function as PropType<VueAppProps['actionRef']>,
    default: null,
  },
});

const schemaStr = shallowRef<SimilatorPluginConfig['schemaStr']>();
const packageList = shallowRef<SimilatorPluginConfig['packageList']>();
// const peetoPrivateKey = shallowRef(generateKey());
const renderNodeRef = shallowRef<VNode | VNode[] | null>(null);

const onGetMap: AppActionRef['getMap'] = () => {
  // 获取组件包含的dom（不包含子组件的dom）
  const node = renderNodeRef.value;
  let map: SimilatorPluginCompDomMap = new Map();
  if (schemaStr.value && packageList) {
    map = getCompDomMap({
      node,
      schemaStr: schemaStr.value,
    });
  }
  return map;
};

watch(
  () => [props.actionRef],
  () => {
    props.actionRef({
      getMap: () => {
        return onGetMap();
      },
      setConfig: (config) => {
        schemaStr.value = config.schemaStr;
        packageList.value = config.packageList;
      },
    });
  },
  { immediate: true }
);

const onNodeChange: VueRenderProps['onNodeChange'] = (n) => {
  renderNodeRef.value = n;
};

const onCreateNode: VueRenderProps['onCreateNode'] = (comp, p, children) => {
  const res = h(
    comp,
    {
      ...p,
      // [peetoPrivateKey.value]: p?.key
    },
    children
  );
  return res;
};
</script>

<template>
  <div>
    <VueRender
      v-if="schemaStr && packageList"
      :schema-str="schemaStr"
      :package-list="packageList"
      @node-change="onNodeChange"
      @create-node="onCreateNode"
    >
      <template #loading><div>vue-loading</div></template>
      <template #noMatchPackage="{ packageName }">
        <div>木有包{{ packageName }}</div>
      </template>
      <template #noMatchComp="{ componentName }">
        <div>木有组件{{ componentName }}</div>
      </template>
    </VueRender>
  </div>
</template>
