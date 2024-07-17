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
    compTree: [
      createCompNode('antd', 'Row', {
        children: [
          createCompNode('antd', 'Space', {
            children: [
              createCompNode('antd', 'Typography.Text', {
                children: '字符长度：',
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
                children: '输入的值：',
              }),
              createCompNode('antd', 'Typography.Text', {
                children: createStateNode({ stateName: 'title' }),
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
          effects: ['title'],
        }),
      }),
    ],
  },
});

// const testObj: SchemaRootObj = {
//   states: [
//     {
//       desc: '状态依赖展示字符串',
//       name: 'titleLengthDesc',
//     },
//   ],
//   events: [
//     {
//       desc: 'title和titleLengthDesc的状态依赖',
//       dependences: ['title'],
//       effectStates: [
//         {
//           name: 'titleLengthDesc',
//           value: 'return `字符串长度为：${this.title.length || 0}`',
//         },
//       ],
//     },
//   ],
//   compTree: [
//     {
//       id: id(),
//       // packageName: '@ant-design/pro-components',
//       // componentName: 'ProTable',
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
//                 // TODO 结局表达式的问题
//                 // {type:'JSExpresson',vaue:'"超长".repeat(50)'}
//                 text: '默认超长文本',
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