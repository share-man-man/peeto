<script setup lang="ts">
import { ElButton, ElRow, ElSpace, ElRadioGroup, ElRadio } from 'element-plus';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';

import {
  anonymousFunction,
  basic,
  conditionBool,
  listLoop,
  state,
} from '../../../../demo-schema/vue/basic';
import { table } from '../../../../demo-schema/vue/table';

import { VueRender } from '../index';
import { vueEffect, vueState } from '../utils';

// const toVueStr = (v: string) => {
//   return v;
// };

const enumOp: {
  key: string;
  label: string;
  str: string;
}[] = [
  {
    key: 'testObj',
    label: basic.desc,
    str: JSON.stringify(basic.schema),
  },
  {
    key: 'anonymousFunction',
    label: anonymousFunction.desc,
    str: JSON.stringify(anonymousFunction.schema),
  },
  {
    key: 'state',
    label: state.desc,
    str: JSON.stringify(state.schema),
  },
  {
    key: 'listLoop',
    label: listLoop.desc,
    str: JSON.stringify(listLoop.schema),
  },
  {
    key: 'conditionBool',
    label: conditionBool.desc,
    str: JSON.stringify(conditionBool.schema),
  },
  {
    key: 'table',
    label: table.desc,
    str: JSON.stringify(table.schema),
  },
  // {
  //   key: 'form',
  //   label: form.desc,
  //   str: JSON.stringify(form.schema),
  // },
];

const [key, setKey] = vueState(
  localStorage.getItem('_test_vue_cur_key') || 'testObj'
);

const [str, setStr] = vueState('');

// const vueCode = vueMemo(
//   () => {
//     if (!str.value) {
//       return '';
//     }
//     return toVueStr(str.value);
//   },
//   () => [str.value]
// );

vueEffect(
  () => {
    if (key.value) {
      setStr(enumOp.find((e) => e.key === key.value)?.str || '');
      localStorage.setItem('_test_vue_cur_key', key.value);
    }
  },
  () => [key.value]
);
</script>

<template>
  <div>
    <div :style="{ position: 'fixed', right: '24px', zIndex: 999 }">
      <el-space>
        <el-button
          type="primary"
          circle
          size="large"
          :icon="ArrowLeftBold"
          @click="
            () => {
              let index = enumOp.findIndex((i) => {
                return i.key === key;
              });
              if (index === 0) {
                index = enumOp.length - 1;
              } else {
                index -= 1;
              }
              setKey(enumOp[index].key);
            }
          "
        />
        <el-button
          type="primary"
          circle
          size="large"
          :icon="ArrowRightBold"
          @click="
            () => {
              let index = enumOp.findIndex((i) => {
                return i.key === key;
              });

              if (index === enumOp.length - 1) {
                index = 0;
              } else {
                index += 1;
              }

              setKey(enumOp[index].key);
            }
          "
        />
      </el-space>
    </div>
    <el-row>
      <h2>schema</h2>
    </el-row>
    <el-row>
      <el-radio-group v-model="key">
        <el-radio v-for="e in enumOp" :key="e.key" :value="e.key">
          {{ e.label }}
        </el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <h2>渲染结果</h2>
    </el-row>
    <VueRender
      :schema-str="str || '{}'"
      :lib-list="[
        {
          name: 'element-plus',
          load: async () => import('element-plus'),
        },
      ]"
    >
      <template #loadingRender><div>vue-loading</div></template>
      <template #noMatchCompRender="{ schema }">
        <div
          :style="{
            color: 'red',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'red',
            padding: '12px',
          }"
        >
          木有组件{{ schema.componentName }}
        </div>
      </template>
      <template #errorBoundaryRender="[e]">
        <div>渲染错误{{ e.message }}</div>
      </template>
    </VueRender>
    <!-- 出码 -->
  </div>
</template>

<style scoped></style>
