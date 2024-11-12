import { SchemaRootObj } from '@peeto/core';

export const schema: SchemaRootObj = {
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
    // {
    //   desc: 'title和titleLengthDesc的状态依赖',
    //   dependences: [
    //     {
    //       name: 'title',
    //       type: NodeType.STATE,
    //     },
    //   ],
    //   effectStates: ['titleLengthDesc'],
    // },
  ],
  compTree: [
    // {
    //   id: `${id()}`,
    //   packageName: '@ant-design/pro-components',
    //   componentName: 'PageContainer',
    //   props: {
    //     header: {
    //       title: '测试标题',
    //     },
    //   },
    //   children: [
    //     {
    //       id: `${id()}`,
    //       packageName: 'antd',
    //       componentName: 'Typography.Title',
    //       props: {},
    //       children: [
    //         {
    //           id: `${id()}`,
    //           packageName: 'my-custom',
    //           componentName: 'Text',
    //           props: {
    //             text: {
    //               type: 'JSExpression',
    //               state: 'title',
    //             },
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: `${id()}`,
    //       packageName: 'antd',
    //       componentName: 'Typography.Title',
    //       props: {},
    //       children: [
    //         {
    //           id: `${id()}`,
    //           packageName: 'my-custom',
    //           componentName: 'Text',
    //           props: {
    //             text: {
    //               type: 'JSExpression',
    //               state: 'titleLengthDesc',
    //             },
    //           },
    //         },
    //       ],
    //     },
    //     {
    //       id: `${id()}`,
    //       packageName: 'antd',
    //       componentName: 'Input',
    //       props: {
    //         value: {
    //           type: 'JSExpression',
    //           state: 'title',
    //         },
    //         onChange: {
    //           type: 'JSFunction',
    //           params: ['v'],
    //           value: `this.onChangeState([['title',v.target.value]])`,
    //           effects: ['title'],
    //         },
    //       },
    //     },
    //     {
    //       id: `${id()}`,
    //       packageName: '@ant-design/pro-components',
    //       componentName: 'ProTable',
    //       props: {
    //         columns: [
    //           {
    //             dataIndex: 'index',
    //             valueType: 'indexBorder',
    //             width: 48,
    //           },
    //           {
    //             title: '标题',
    //             dataIndex: 'labels',
    //             copyable: true,
    //             ellipsis: true,
    //             tip: '标题过长会自动收缩',
    //             formItemProps: {
    //               rules: [
    //                 {
    //                   required: true,
    //                   message: '此项为必填项',
    //                 },
    //               ],
    //             },
    //           },
    //           {
    //             disable: true,
    //             title: '状态',
    //             dataIndex: 'state',
    //             filters: true,
    //             onFilter: true,
    //             ellipsis: true,
    //             valueType: 'select',
    //             valueEnum: {
    //               all: {
    //                 text: {
    //                   type: 'JSExpression',
    //                   value: `'超长'.repeat(50)`,
    //                 },
    //               },
    //               open: {
    //                 text: '未解决',
    //                 status: 'Error',
    //               },
    //               closed: {
    //                 text: '已解决',
    //                 status: 'Success',
    //                 disabled: true,
    //               },
    //               processing: {
    //                 text: '解决中',
    //                 status: 'Processing',
    //               },
    //             },
    //           },
    //           {
    //             disable: true,
    //             title: '标签',
    //             dataIndex: 'labels',
    //             search: false,
    //             renderFormItem: {
    //               type: 'JSFunction',
    //               params: ['_', 'config'],
    //               value: `return config.defaultRender(_)`,
    //             },
    //             render: {
    //               type: 'JSFunction',
    //               params: ['text', 'record'],
    //               children: [
    //                 {
    //                   id: `${id()}`,
    //                   packageName: 'antd',
    //                   componentName: 'Card',
    //                   props: {
    //                     title: {
    //                       type: 'JSExpression',
    //                       value: 'this.scope?.text',
    //                     },
    //                   },
    //                   children: [
    //                     {
    //                       id: `${id()}`,
    //                       packageName: 'antd',
    //                       componentName: 'Collapse',
    //                       props: {
    //                         defaultActiveKey: ['1', '3'],
    //                       },
    //                       children: [
    //                         {
    //                           id: `${id()}`,
    //                           packageName: 'antd',
    //                           componentName: 'Collapse.Panel',
    //                           props: {
    //                             key: 1,
    //                             header: 'This is panel header 1',
    //                           },
    //                           children: {
    //                             type: 'JSExpression',
    //                             value: 'this.scope?.record?.name',
    //                           },
    //                         },
    //                         {
    //                           id: `${id()}`,
    //                           packageName: 'antd',
    //                           componentName: 'Collapse.Panel',
    //                           props: {
    //                             key: 2,
    //                             header: 'This is panel header 2',
    //                           },
    //                           children: '222',
    //                         },
    //                         {
    //                           id: `${id()}`,
    //                           packageName: 'antd',
    //                           componentName: 'Collapse.Panel',
    //                           props: {
    //                             key: 3,
    //                             header: 'This is panel header 3',
    //                           },
    //                           children: {
    //                             type: 'JSExpression',
    //                             value: 'this.scope?.text',
    //                           },
    //                         },
    //                       ],
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           },
    //         ],
    //         dataSource: [
    //           {
    //             key: 123,
    //             labels: '测试标签231312',
    //             name: '小小',
    //             state: 'open',
    //           },
    //         ],
    //       },
    //       children: [],
    //     },
    //   ],
    // },
  ],
};
