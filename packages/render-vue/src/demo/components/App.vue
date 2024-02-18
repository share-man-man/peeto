<script setup lang="ts">
import { v4 as id } from 'uuid';
import { SchemaRootObj } from '@peeto/parse';
import { h, ref } from 'vue';
import { VueRender, SlotPrefix } from '../../index';
import Test from './MyTest.vue';
import Button from './MyButton.vue';

const packageList = ref([
  {
    name: 'element-plus',
    load: async () => import('element-plus'),
  },
  {
    name: 'test',
    load: async () => ({
      Test,
      Button,
      Text: ({ text }: { text: string }) => {
        return h('div', text);
      },
    }),
  },
]);

const testObj: SchemaRootObj = {
  states: [
    {
      desc: '响应式状态',
      name: 'title',
      initialValue: '111',
    },
    {
      desc: '状态依赖展示字符串',
      name: 'titleLengthDesc',
    },
  ],
  effects: [
    {
      desc: 'title和titleLengthDesc的状态依赖',
      dependences: ['title'],
      effectStates: [
        {
          name: 'titleLengthDesc',
          value: 'return `字符串长度为：${this.title.length || 0}`',
        },
      ],
    },
  ],
  compTree: [
    {
      id: id(),
      packageName: 'element-plus',
      componentName: 'ElConfigProvider',
      props: {},
      children: [
        {
          id: id(),
          packageName: 'element-plus',
          componentName: 'ElText',
          props: {},
          children: [
            {
              id: id(),
              packageName: 'test',
              componentName: 'Text',
              props: {
                text: {
                  type: 'JSExpression',
                  state: 'title',
                },
              },
            },
          ],
        },
        {
          id: id(),
          packageName: 'element-plus',
          componentName: 'ElText',
          props: {},
          children: [
            {
              id: id(),
              packageName: 'test',
              componentName: 'Text',
              props: {
                text: {
                  type: 'JSExpression',
                  state: 'titleLengthDesc',
                },
              },
            },
          ],
        },
        {
          id: id(),
          packageName: 'element-plus',
          componentName: 'ElInput',
          props: {
            modelValue: {
              type: 'JSExpression',
              state: 'title',
            },
            onInput: {
              type: 'JSFunction',
              params: ['v'],
              value: `this.onChangeState([['title',v]])`,
              effects: ['title'],
            },
          },
        },
        {
          id: id(),
          packageName: 'element-plus',
          componentName: 'ElButton',
          props: {
            type: 'primary',
            loading: true,
            [SlotPrefix]: {
              loading: {
                type: 'JSFunction',
                params: [],
                children: [
                  {
                    id: id(),
                    packageName: 'element-plus',
                    componentName: 'ElTag',
                    props: {
                      type: 'success',
                    },
                    children: ['加载插槽'],
                  },
                ],
              },
            },
          },
          children: [
            {
              id: id(),
              packageName: 'test',
              componentName: 'Text',
              props: {
                text: '哈哈哈哈',
              },
            },
          ],
        },
        {
          id: id(),
          packageName: 'test',
          componentName: 'Button',
          props: {
            [SlotPrefix]: {
              default: {
                type: 'JSFunction',
                params: [],
                children: [
                  {
                    id: id(),
                    packageName: 'element-plus',
                    componentName: 'ElButton',
                    children: ['default插槽'],
                  },
                ],
              },
              test: {
                type: 'JSFunction',
                params: ['value'],
                children: [
                  {
                    id: id(),
                    packageName: 'element-plus',
                    componentName: 'ElButton',
                    props: {
                      type: 'primary',
                    },
                    children: [
                      {
                        type: 'JSExpression',
                        paramns: [],
                        value:
                          '`test插槽-${JSON.stringify(this.scope.value.list)}`',
                      },
                    ],
                  },
                ],
              },
            },
          },
        },
      ],
    },
  ],
};

const schemaStr = ref(JSON.stringify(testObj));
</script>

<template>
  <VueRender :schema-str="schemaStr" :package-list="packageList">
    <template #loading><div>vue-loading</div></template>
    <template #noMatchPackage="{ packageName }">
      <div>木有包{{ packageName }}</div>
    </template>
    <template #noMatchComp="{ componentName }">
      <div>木有组件{{ componentName }}</div>
    </template>
  </VueRender>
</template>

<style scoped></style>
