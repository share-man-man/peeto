import { ConditionTypeEnum, FuncTypeEnum } from '../../packages/core/src/func';
import { NodeType } from '../../packages/core/src/root';
import {
  createCompNode,
  createAnonymousFunction,
  createStateNode,
  createSchemaConfig,
  createRefNode,
} from '../utils';

// export const libModules: SchemaRootObj['libModules'] = [
//   { libName: 'antd', subName: '' },
//   {
//     libName: '@ant-design/pro-components',
//     subName: '',
//   },
// ];

export const basic = createSchemaConfig({
  desc: '基础-自定义包',
  schema: {
    // libModules,
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
    // libModules,
    compTree: [
      createCompNode('antd', 'Button', {
        type: 'primary',
        onClick: createAnonymousFunction({
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
    // libModules,
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
        dependences: [{ type: NodeType.STATE, stateName: 'title' }],
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
                  dependences: [{ type: NodeType.STATE, stateName: 'title' }],
                  func: {
                    body: '(title || "").length',
                  },
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
    // libModules,
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
      createCompNode('antd', 'Space', {
        children: [
          createAnonymousFunction({
            IIFE: true,
            funcType: FuncTypeEnum.RENDERFUNC,
            renderFunc: {
              conditionType: ConditionTypeEnum.LISTLOOP,
              listLoop: {
                data: createAnonymousFunction({
                  IIFE: true,
                  dependences: [{ type: NodeType.STATE, stateName: 'record' }],
                  func: {
                    body: 'record.labels',
                  },
                }),
                mapParams: ['lablesItem', 'lablesIndex'],
              },
              compTree: [
                createCompNode('antd', 'Tag', {
                  key: createAnonymousFunction({
                    IIFE: true,
                    func: {
                      body: 'lablesItem.name',
                    },
                  }),
                  color: createAnonymousFunction({
                    IIFE: true,
                    func: {
                      body: 'lablesItem.color',
                    },
                  }),
                  children: createAnonymousFunction({
                    IIFE: true,
                    func: {
                      body: 'lablesItem.color',
                    },
                  }),
                }),
              ],
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
    // libModules,
    states: [
      {
        name: 'visible',
        initialValue: true,
      },
    ],
    compTree: [
      createCompNode('antd', 'Switch', {
        checked: createStateNode({ stateName: 'visible' }),
        onChange: createAnonymousFunction({
          params: ['checked'],
          dependences: [{ type: NodeType.STATE, stateName: 'visible' }],
          effectStates: ['visible'],
          func: {
            body: 'setVisible(!visible)',
          },
        }),
      }),
      createAnonymousFunction({
        IIFE: true,
        funcType: FuncTypeEnum.RENDERFUNC,
        renderFunc: {
          conditionType: ConditionTypeEnum.BOOLEAN,
          boolean: {
            data: createStateNode({ stateName: 'visible' }),
          },
          compTree: createCompNode('antd', 'Typography.Text', {
            children: '===条件展示===',
          }),
        },
      }),
    ],
  },
});

export const table = createSchemaConfig({
  desc: '表格-表达式、渲染函数',
  schema: {
    // libModules,
    refs: [{ name: 'actionRef', desc: '表格ref' }],
    compTree: [
      123,
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
            dataIndex: 'title',
            copyable: true,
            ellipsis: true,
            tooltip: '标题过长会自动收缩',
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
                  IIFE: true,
                  func: {
                    body: '"表达式-".repeat(50)',
                  },
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
            title: '标签',
            dataIndex: 'labels',
            search: false,
            renderFormItem: createAnonymousFunction({
              params: ['_', 'config'],
              func: {
                body: 'return config.defaultRender(_)',
              },
            }),
            render: createAnonymousFunction({
              params: ['_', 'record'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  createCompNode('antd', 'Space', {
                    children: [
                      createCompNode('antd', 'Tag', {
                        color: 'warning',
                        key: '1',
                        children: 'aaa',
                      }),
                    ],
                  }),
                ],
              },
            }),
          },
          {
            disable: true,
            title: '渲染函数-组件树',
            dataIndex: '_renders2',
            search: false,
            renderFormItem: createAnonymousFunction({
              params: ['_', 'config'],
              func: {
                body: 'return config.defaultRender(_)',
              },
            }),
            render: createAnonymousFunction({
              params: ['_', 'record'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  createCompNode('antd', 'Space', {
                    children: [
                      createAnonymousFunction({
                        IIFE: true,
                        funcType: FuncTypeEnum.RENDERFUNC,
                        renderFunc: {
                          conditionType: ConditionTypeEnum.LISTLOOP,
                          listLoop: {
                            data: createAnonymousFunction({
                              IIFE: true,
                              func: {
                                body: 'record.labels',
                              },
                            }),
                            mapParams: ['lablesItem', 'lablesIndex'],
                          },
                          compTree: createCompNode('antd', 'Tag', {
                            key: createAnonymousFunction({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.name',
                              },
                            }),
                            color: createAnonymousFunction({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.color',
                              },
                            }),
                            children: createAnonymousFunction({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.name',
                              },
                            }),
                          }),
                        },
                      }),
                    ],
                  }),
                ],
              },
            }),
          },
          {
            title: '创建时间',
            key: 'showTime',
            dataIndex: 'created_at',
            valueType: 'date',
            sorter: true,
            hideInSearch: true,
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
              transform: createAnonymousFunction({
                params: ['value'],
                func: {
                  body: `return {
                  startTime: value[0],
                  endTime: value[1],
                  }`,
                },
              }),
            },
          },
          {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: createAnonymousFunction({
              params: ['text', 'record', '_', 'action'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  createCompNode('antd', 'Button', {
                    key: 'editable',
                    type: 'link',
                    onClick: createAnonymousFunction({
                      func: {
                        body: 'action?.startEditable?.(record.id);',
                      },
                    }),
                    children: '编辑',
                  }),
                  createCompNode('antd', 'Button', {
                    key: 'view',
                    type: 'link',
                    href: createAnonymousFunction({
                      IIFE: true,
                      func: {
                        body: 'record.url',
                      },
                    }),
                    rel: 'noopener noreferrer',
                    children: '查看',
                  }),
                  createCompNode(
                    '@ant-design/pro-components',
                    'TableDropdown',
                    {
                      key: 'actionGroup',
                      onSelect: createAnonymousFunction({
                        func: {
                          body: 'action?.reload()',
                        },
                      }),
                      menus: [
                        { key: 'copy', name: '复制' },
                        { key: 'delete', name: '删除' },
                      ],
                    }
                  ),
                ],
              },
            }),
          },
        ],
        actionRef: createRefNode({ refName: 'actionRef' }),
        cardBordered: true,
        request: createAnonymousFunction({
          dependences: [
            {
              type: NodeType.LIB,
              libName: 'umi-request',
              alias: 'request',
              subName: 'default',
            },
          ],
          params: ['params', 'sort', 'filter'],
          isPromise: true,
          func: {
            body: `return new Promise((resolve)=>{
            setTimeout(()=>{
              request('https://proapi.azurewebsites.net/github/issues', {
                params,
              }).then((res)=>{
                resolve(res)
              })
            },500)
            })`,
          },
        }),
        editable: {
          type: 'multiple',
        },
        columnsState: {
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange: createAnonymousFunction({
            params: ['value'],
            func: {
              body: 'console.log("value: ", value)',
            },
          }),
        },
        rowKey: 'id',
        search: {
          labelWidth: 'auto',
        },
        options: {
          setting: {
            listsHeight: 400,
          },
        },
        form: {
          ignoreRules: false,
          syncToUrl: createAnonymousFunction({
            params: ['values', 'type'],
            func: {
              body: `if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;`,
            },
          }),
        },
        pagination: {
          pageSize: 5,
        },
        dateFormatter: 'string',
        headerTitle: '高级表格',
        toolBarRender: createAnonymousFunction({
          funcType: FuncTypeEnum.RENDERFUNC,
          renderFunc: {
            conditionType: ConditionTypeEnum.DEFAULT,
            compTree: [
              createCompNode('antd', 'Button', {
                key: 'button',
                // icon: createCompNode('@ant-design/icons', 'PlusOutlined'),
                onClick: createAnonymousFunction({
                  dependences: [
                    {
                      type: NodeType.REF,
                      refName: 'actionRef',
                    },
                  ],
                  func: {
                    body: `
                    actionRef.current?.reload()`,
                  },
                }),
                type: 'primary',
                children: '新建',
              }),
              createCompNode('antd', 'Dropdown', {
                key: 'menu',
                menu: {
                  items: [
                    {
                      label: '1st item',
                      key: '1',
                    },
                    {
                      label: '2nd item',
                      key: '2',
                    },
                    {
                      label: '3rd item',
                      key: '3',
                    },
                  ],
                },
                children: createCompNode('antd', 'Button', {
                  children: '...',
                }),
              }),
            ],
          },
        }),
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
// {
//   id: id(),
//   packageName: 'antd',
//   componentName: 'Collapse',
//   props: {
//     defaultActiveKey: ['1', '3'],
//   },
//   children: [
//     {
//       id: id(),
//       packageName: 'antd',
//       componentName: 'Collapse.Panel',
//       props: {
//         key: 1,
//         header: 'This is panel header 1',
//       },
//       children: {
//         type: 'JSExpression',
//         value: 'this.scope?.record?.name',
//       },
//     },
//     {
//       id: id(),
//       packageName: 'antd',
//       componentName: 'Collapse.Panel',
//       props: {
//         key: 2,
//         header: 'This is panel header 2',
//       },
//       children: '222',
//     },
//     {
//       id: id(),
//       packageName: 'antd',
//       componentName: 'Collapse.Panel',
//       props: {
//         key: 3,
//         header: 'This is panel header 3',
//       },
//       children: {
//         type: 'JSExpression',
//         value: 'this.scope?.text',
//       },
//     },
//   ],
// },
// ],
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
