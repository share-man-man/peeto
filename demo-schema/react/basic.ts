import { AnyType } from '@peeto/core';
import {
  createCompNode,
  createAnonymousFunction,
  createStateNode,
  createSchemaConfig,
} from '../utils';

export const basic = createSchemaConfig({
  desc: '基础-自定义包',
  schema: {
    compTree: [
      createCompNode('antd', 'Card', {
        title: 'antd.Card',
        children: createCompNode('antd', 'Typography.Text', {
          children: '包：my-custom  组件：Text',
        }),
      }),
    ],
  },
});

export const anonymousFunction = createSchemaConfig({
  desc: '基础-匿名函数',
  schema: {
    compTree: [
      createCompNode('antd', 'Button', {
        type: 'primary',
        onClick: createAnonymousFunction({
          params: ['e'],
          body: 'alert("点击了按钮")',
        }),
        children: '点击弹出提示框',
      }),
    ],
  },
});

export const state = createSchemaConfig({
  desc: '基础-状态响应式',
  schema: {
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
        dependences: ['title'],
        effectStates: ['titleLength'],
        body: `
        setTitleLength(title.length)`,
      },
    ],
    compTree: [
      createCompNode('antd', 'Row', {
        children: [
          createCompNode('antd', 'Space', {
            children: [
              createCompNode('antd', 'Typography.Text', {
                children: 'title值：',
              }),
              createCompNode('antd', 'Typography.Text', {
                children: createStateNode({ stateName: 'title' }),
              }),
            ],
          }),
        ],
      }),
      createCompNode('antd', 'Row', {
        children: [
          createCompNode('antd', 'Space', {
            children: [
              createCompNode('antd', 'Typography.Text', {
                children: 'titleLength(effect监听改变)：',
              }),
              createCompNode('antd', 'Typography.Text', {
                children: createStateNode({ stateName: 'titleLength' }),
              }),
            ],
          }),
        ],
      }),
      createCompNode('antd', 'Row', {
        children: [
          createCompNode('antd', 'Space', {
            children: [
              createCompNode('antd', 'Typography.Text', {
                children: 'title长度(表达式)：',
              }),
              createCompNode('antd', 'Typography.Text', {
                children: createAnonymousFunction({
                  IIFE: true,
                  body: '(title || "").length',
                  dependences: ['title'],
                }),
              }),
            ],
          }),
        ],
      }),
      createCompNode('antd', 'Input', {
        value: createStateNode({
          stateName: 'title',
        }),
        onChange: createAnonymousFunction({
          params: ['v'],
          body: `setTitle(v.target.value)`,
          effectStates: ['title'],
        }),
      }),
    ],
  },
});

export const table = createSchemaConfig({
  desc: '表格-表达式、渲染函数',
  schema: {
    compTree: [
      createCompNode('@ant-design/pro-components', 'ProTable', {
        columns: [
          {
            title: '序号',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
          },
          {
            title: '标题',
            dataIndex: 'labels',
            copyable: true,
            ellipsis: true,
            tip: '标题过长会自动收缩',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项',
                },
              ],
            },
          },
          {
            disable: true,
            title: '状态',
            dataIndex: 'state',
            filters: true,
            onFilter: true,
            ellipsis: true,
            valueType: 'select',
            valueEnum: {
              all: {
                text: createAnonymousFunction({
                  body: '"表达式-".repeat(50)',
                  IIFE: true,
                }),
              },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
                disabled: true,
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            },
          },
          {
            disable: true,
            title: '渲染函数-字段',
            dataIndex: '_renders',
            search: false,
            render: createAnonymousFunction({
              params: ['_', 'record'],
              body: 'return record.state',
            }),
          },
          {
            disable: true,
            title: '渲染函数-组件树',
            dataIndex: '_renders',
            search: false,
            renderFormItem: createAnonymousFunction({
              params: ['_', 'config'],
              body: 'return config.defaultRender(_)',
            }),
            render: createAnonymousFunction({
              params: ['_', 'record'],
              body: '',
              isCompTree: true,
              compTree: [
                createCompNode('antd', 'Space', {
                  children: [
                    createCompNode('antd', 'Tag', {
                      color: 'red',
                      // TODO 上下文引用；渲染函数立即执行，支持条件判断，循环遍历
                      // children: '默认字段',
                      children: createAnonymousFunction({
                        body: 'this.ctx.record.labels',
                        IIFE: true,
                      }),
                    }),
                  ],
                }) as AnyType,
              ],
            }),
          },
          // {
          //   disable: true,
          //   title: '渲染函数-（字段+组件树）',
          //   dataIndex: '_renders',
          //   search: false,
          //   renderFormItem: createAnonymousFunction({
          //     params: ['_', 'config'],
          //     body: 'return config.defaultRender(_)',
          //   }),
          //   render: createAnonymousFunction({
          //     params: ['_', 'record'],
          //     body: '',
          //     isCompTree: true,
          //     compTree: [
          //       createCompNode('antd', 'Space', {
          //         children: [
          //           createCompNode('antd', 'Tag', {
          //             color: 'red',
          //             // TODO 上下文引用；渲染函数立即执行，支持条件判断，循环遍历
          //             children: createAnonymousFunction({
          //               body: 'return record.labels',
          //               IIFE: true,
          //             }),
          //           }),
          //         ],
          //       }) as AnyType,
          //     ],
          //   }),
          // },
        ],
        dataSource: [
          {
            key: 111,
            labels: 'aaa',
            name: '小小',
            state: 'open',
            tagList: ['11', '22'],
          },
          {
            key: 222,
            labels: 'bbb',
            name: '大大',
            state: 'all',
            tagList: ['33', '44'],
          },
        ],
      }),
    ],
  },
});

// const testObj: SchemaRootObj = {
//   compTree: [
//     {
//       id: id(),
//       // packageName: '@ant-design/pro-components',
//       // componentName: 'ProTable',
//       props: {
//         columns: [
//           {
//             render: {
//               type: 'JSFunction',
//               params: ['text', 'record'],
//               children: [
//                 {
//                   id: id(),
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
//                       id: id(),
//                       packageName: 'antd',
//                       componentName: 'Collapse',
//                       props: {
//                         defaultActiveKey: ['1', '3'],
//                       },
//                       children: [
//                         {
//                           id: id(),
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
//                           id: id(),
//                           packageName: 'antd',
//                           componentName: 'Collapse.Panel',
//                           props: {
//                             key: 2,
//                             header: 'This is panel header 2',
//                           },
//                           children: '222',
//                         },
//                         {
//                           id: id(),
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
// };

// const modalForm: SchemaRootObj = {
//   states: [
//     {
//       name: 'visible',
//       desc: '弹框可见',
//       initialValue: false,
//     },
//     {
//       name: 'loading',
//       desc: '加载中状态',
//       initialValue: false,
//     },
//     {
//       name: 'form',
//       desc: '表单ref',
//       initialValue: {
//         type: 'JSExpression',
//         packages: ['antd'],
//         value: `(function(){
//           return this.antd.Form.useForm()[0]
//         }).call(this)`,
//       },
//     },
//   ],
//   anonymousFunctionList: [],
//   events: [],
//   compTreeLibMap: [],
//   compTree: [
//     {
//       id: id(),
//       packageName: 'antd',
//       componentName: 'Modal',
//       props: {
//         title: '测试表单',
//         open: {
//           type: 'JSExpression',
//           state: 'visible',
//         },
//         onCancel: {
//           type: 'JSFunction',
//           effects: ['visible'],
//           value: `this.onChangeState([['visible',false]])`,
//         },
//         confirmLoading: {
//           type: 'JSExpression',
//           state: 'loading',
//         },
//         maskClosable: false,
//         destroyOnClose: true,
//         bodyStyle: { display: 'flex', justifyContent: 'center' },
//       },
//       children: [
//         {
//           id: id(),
//           packageName: 'antd',
//           componentName: 'Form',
//           props: {
//             form: {
//               type: 'JSExpression',
//               state: 'form',
//             },
//             name: 'basic',
//             labelCol: { span: 8 },
//             wrapperCol: { span: 16 },
//             style: { maxWidth: 600 },
//             initialValues: { remember: true },
//             autoComplete: 'off',
//           },
//           children: [
//             {
//               id: id(),
//               packageName: 'antd',
//               componentName: 'Form.Item',
//               props: {
//                 label: 'Username',
//                 name: 'username',
//                 rules: [
//                   { required: true, message: 'Please input your username!' },
//                 ],
//               },
//               children: [
//                 {
//                   id: id(),
//                   packageName: 'antd',
//                   componentName: 'Input',
//                 },
//               ],
//             },
//             {
//               id: id(),
//               packageName: 'antd',
//               componentName: 'Form.Item',
//               props: {
//                 label: 'Password',
//                 name: 'password',
//                 rules: [
//                   { required: true, message: 'Please input your password!' },
//                 ],
//               },
//               children: [
//                 {
//                   id: id(),
//                   packageName: 'antd',
//                   componentName: 'Input.Password',
//                 },
//               ],
//             },
//             {
//               id: id(),
//               packageName: 'antd',
//               componentName: 'Form.Item',
//               props: {
//                 name: 'remember',
//                 valuePropName: 'checked',
//                 wrapperCol: { offset: 8, span: 16 },
//               },
//               children: [
//                 {
//                   id: id(),
//                   packageName: 'antd',
//                   componentName: 'Checkbox',
//                   children: [
//                     {
//                       id: id(),
//                       packageName: 'my-custom',
//                       componentName: 'Text',
//                       props: {
//                         text: 'Remember me',
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               id: id(),
//               packageName: 'antd',
//               componentName: 'Form.Item',
//               props: {
//                 wrapperCol: { offset: 8, span: 16 },
//               },
//               children: [
//                 {
//                   id: id(),
//                   packageName: 'antd',
//                   componentName: 'Button',
//                   props: {
//                     type: 'primary',
//                     htmlType: 'submit',
//                   },
//                   children: [
//                     {
//                       id: id(),
//                       packageName: 'my-custom',
//                       componentName: 'Text',
//                       props: {
//                         text: 'Submit',
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: id(),
//       packageName: 'antd',
//       componentName: 'Button',
//       props: {
//         type: 'primary',
//         onClick: {
//           type: 'JSFunction',
//           effects: ['visible'],
//           value: `this.onChangeState([['visible',true]])`,
//         },
//       },
//       children: [
//         {
//           id: id(),
//           packageName: 'my-custom',
//           componentName: 'Text',
//           props: {
//             text: '打开表单',
//           },
//         },
//       ],
//     },
//   ],
// };
