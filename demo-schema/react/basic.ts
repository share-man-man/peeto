import { SchemaRootObj } from '../../packages/core';
import { ConditionTypeEnum, FuncTypeEnum } from '../../packages/core/src/func';
import { NodeType } from '../../packages/core/src/root';
import {
  creatAnonymousFunc,
  createComp,
  createSchemaConfig,
  createState,
} from '../utils';

export const libModules: SchemaRootObj['libModules'] = [
  {
    name: 'antd',
    subs: [
      {
        name: 'Button',
      },
      {
        name: 'Card',
      },
      {
        name: 'Typography',
      },
      {
        name: 'Row',
      },
      {
        name: 'Input',
      },
      {
        name: 'Space',
      },
      {
        name: 'Tag',
      },
      {
        name: 'Switch',
      },
      {
        name: 'Dropdown',
      },
      {
        name: 'Form',
      },
      {
        name: 'Modal',
      },
      {
        name: 'Checkbox',
      },
    ],
  },
  {
    name: '@ant-design/pro-components',
    subs: [
      {
        name: 'ProTable',
      },
      {
        name: 'TableDropdown',
      },
    ],
  },
  {
    name: 'umi-request',
    subs: [
      {
        name: 'default',
        alias: 'request',
      },
    ],
  },
];

export const basic = createSchemaConfig({
  desc: '基础-自定义包',
  schema: {
    libModules,
    compTree: [
      createComp('Card', {
        title: 'antd.Card',
        children: createComp('Typography.Text', {
          children: '包：Typography.Text  组件：Text',
        }),
      }),
    ],
  },
});

export const anonymousFunction = createSchemaConfig({
  desc: '基础-匿名函数',
  schema: {
    libModules,
    compTree: [
      createComp('Button', {
        type: 'primary',
        onClick: creatAnonymousFunc({
          params: ['e'],
          func: {
            body: 'alert("点击了按钮")',
          },
        }),
        children: '点击弹出提示框',
      }),
    ],
  },
});

export const state = createSchemaConfig({
  desc: '基础-状态响应式',
  schema: {
    libModules,
    states: [
      {
        desc: '响应式状态',
        name: 'title',
        initialValue: '响应式状态',
      },
      {
        desc: 'title长度',
        name: 'titleLength',
        initialValue: 0,
      },
    ],
    effects: [
      {
        dependences: [{ type: NodeType.STATE, name: 'title' }],
        effectStates: ['titleLength'],
        body: `
        setTitleLength(title.length)
        `,
      },
    ],
    compTree: [
      createComp('Row', {
        children: [
          createComp('Space', {
            children: [
              createComp('Typography.Text', {
                children: 'title值：',
              }),
              createComp('Typography.Text', {
                children: createState({ name: 'title' }),
              }),
            ],
          }),
        ],
      }),
      createComp('Row', {
        children: [
          createComp('Space', {
            children: [
              createComp('Typography.Text', {
                children: 'titleLength(effect监听改变)：',
              }),
              createComp('Typography.Text', {
                children: createState({ name: 'titleLength' }),
              }),
            ],
          }),
        ],
      }),
      createComp('Row', {
        children: [
          createComp('Space', {
            children: [
              createComp('Typography.Text', {
                children: 'title长度(表达式)：',
              }),
              createComp('Typography.Text', {
                children: creatAnonymousFunc({
                  IIFE: true,
                  dependences: [{ type: NodeType.STATE, name: 'title' }],
                  func: {
                    body: '(title || "").length',
                  },
                }),
              }),
            ],
          }),
        ],
      }),
      createComp('Input', {
        value: createState({
          name: 'title',
        }),
        onChange: creatAnonymousFunc({
          params: ['v'],
          effectStates: ['title'],
          func: {
            body: `setTitle(v.target.value)`,
          },
        }),
      }),
    ],
  },
});

export const listLoop = createSchemaConfig({
  desc: '基础-数组渲染',
  schema: {
    libModules,
    states: [
      {
        name: 'record',
        initialValue: {
          title: '🐛 [BUG]yarn install命令 antd2.4.5会报错',
          labels: [
            {
              name: 'error',
              color: 'error',
            },
            {
              name: 'success',
              color: 'success',
            },
            {
              name: 'processing',
              color: 'processing',
            },
            {
              name: 'default',
              color: 'default',
            },
            {
              name: 'warning ',
              color: 'warning',
            },
          ],
        },
      },
    ],
    compTree: [
      createComp('Space', {
        children: [
          creatAnonymousFunc({
            IIFE: true,
            funcType: FuncTypeEnum.RENDERFUNC,
            renderFunc: {
              conditionType: ConditionTypeEnum.LISTLOOP,
              listLoop: {
                data: creatAnonymousFunc({
                  IIFE: true,
                  dependences: [{ type: NodeType.STATE, name: 'record' }],
                  func: {
                    body: 'record.labels',
                  },
                }),
                mapParams: ['lablesItem', 'lablesIndex'],
              },
              compTree: createComp('Tag', {
                key: creatAnonymousFunc({
                  IIFE: true,
                  func: {
                    body: 'lablesItem.name',
                  },
                }),
                color: creatAnonymousFunc({
                  IIFE: true,
                  func: {
                    body: 'lablesItem.color',
                  },
                }),
                children: creatAnonymousFunc({
                  IIFE: true,
                  func: {
                    body: 'lablesItem.color',
                  },
                }),
              }),
            },
          }),
        ],
      }),
    ],
  },
});

export const conditionBool = createSchemaConfig({
  desc: '基础-是否渲染',
  schema: {
    libModules,
    states: [
      {
        name: 'visible',
        initialValue: true,
      },
    ],
    compTree: [
      createComp('Switch', {
        checked: createState({ name: 'visible' }),
        onChange: creatAnonymousFunc({
          params: ['checked'],
          dependences: [{ type: NodeType.STATE, name: 'visible' }],
          effectStates: ['visible'],
          func: {
            body: 'setVisible(!visible)',
          },
        }),
      }),
      creatAnonymousFunc({
        IIFE: true,
        funcType: FuncTypeEnum.RENDERFUNC,
        renderFunc: {
          conditionType: ConditionTypeEnum.BOOLEAN,
          boolean: {
            data: createState({
              name: 'visible',
            }),
          },
          compTree: createComp('Typography.Text', {
            children: '===条件展示===',
          }),
        },
      }),
    ],
  },
});
