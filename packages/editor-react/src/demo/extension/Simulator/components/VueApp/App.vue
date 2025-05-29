<script setup lang="ts">
import { PropType, computed, h, shallowRef, watch } from 'vue';
import { VueRender, VueRenderProps } from '@peeto/render-vue';
import { VueAppProps } from './type';
import { SimulatorConfigType } from '../../type';
import { AnyType } from '@peeto/core';

const props = defineProps({
  actionRef: {
    type: Function as PropType<VueAppProps['actionRef']>,
    default: null,
  },
  peetoPrivateKey: {
    type: String,
    default: '',
  },
});

const schemaStr = shallowRef<SimulatorConfigType['schemaStr']>();
const packageList = shallowRef<SimulatorConfigType['packageList']>();

watch(
  () => [props.actionRef],
  () => {
    props.actionRef({
      setConfig: (config) => {
        schemaStr.value = config.schemaStr;
        packageList.value = config.packageList;
      },
    });
  },
  { immediate: true }
);

const onCreateNode: VueRenderProps['onCreateCompNode'] = ({
  comp,
  fields,
  parseProps,
}) => {
  const k = fields.props?.key || parseProps.curSchema.id;
  const res = h(
    comp,
    {
      key: k,
      ...fields.props,
      // 不能添加自定义参数，否则报错：Extraneous non-props attributes
      // [props.peetoPrivateKey]: `__simulator_vue_app_${k}`,
    },
    fields.slots
  );
  // 强行绑定一个私有属性，方便便利节点时匹配到schema中的组件
  (res as AnyType)[props.peetoPrivateKey] = `__simulator_vue_app_${k}`;

  return res;
};

const renderFlag = computed(() => {
  return schemaStr.value && packageList.value;
});
</script>

<template>
  <div>
    <VueRender
      v-if="renderFlag"
      :schema-str="schemaStr"
      :lib-list="packageList"
      @create-comp-node="onCreateNode"
    >
      <!-- <template #loading><div>vue-loading</div></template>
      <template #noMatchPackage="{ packageName }">
        <div>木有包{{ packageName }}</div>
      </template>
      <template #noMatchComp="{ componentName }">
        <div>木有组件{{ componentName }}</div>
      </template> -->
    </VueRender>
  </div>
</template>
