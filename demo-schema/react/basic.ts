import {
  AnyType,
  HookNodeType,
  JSONValue,
  RefNodeType,
  SchemaRootObj,
  StateNodeType,
} from '../../packages/core';
import {
  AnonymousFunctionNode,
  ConditionTypeEnum,
  FuncTypeEnum,
} from '../../packages/core/src/func';
import { NodeType } from '../../packages/core/src/root';
import {
  CustomCompNode,
  // new AnonymousFunctionNode,
  // new StateNodeType,
  createSchemaConfig,
  // createRefNode,
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
      new CustomCompNode('Card', {
        title: 'antd.Card',
        children: new CustomCompNode('Typography.Text', {
          children: '包：my-custom  组件：Text',
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
      new CustomCompNode('Button', {
        type: 'primary',
        onClick: new AnonymousFunctionNode({
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
      new CustomCompNode('Row', {
        children: [
          new CustomCompNode('Space', {
            children: [
              new CustomCompNode('Typography.Text', {
                children: 'title值：',
              }),
              new CustomCompNode('Typography.Text', {
                children: new StateNodeType({ name: 'title' }),
              }),
            ],
          }),
        ],
      }),
      new CustomCompNode('Row', {
        children: [
          new CustomCompNode('Space', {
            children: [
              new CustomCompNode('Typography.Text', {
                children: 'titleLength(effect监听改变)：',
              }),
              new CustomCompNode('Typography.Text', {
                children: new StateNodeType({ name: 'titleLength' }),
              }),
            ],
          }),
        ],
      }),
      new CustomCompNode('Row', {
        children: [
          new CustomCompNode('Space', {
            children: [
              new CustomCompNode('Typography.Text', {
                children: 'title长度(表达式)：',
              }),
              new CustomCompNode('Typography.Text', {
                children: new AnonymousFunctionNode({
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
      new CustomCompNode('Input', {
        value: new StateNodeType({
          name: 'title',
        }),
        onChange: new AnonymousFunctionNode({
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
      new CustomCompNode('Space', {
        children: [
          new AnonymousFunctionNode({
            IIFE: true,
            funcType: FuncTypeEnum.RENDERFUNC,
            renderFunc: {
              conditionType: ConditionTypeEnum.LISTLOOP,
              listLoop: {
                data: new AnonymousFunctionNode({
                  IIFE: true,
                  dependences: [{ type: NodeType.STATE, name: 'record' }],
                  func: {
                    body: 'record.labels',
                  },
                }) as AnyType,
                mapParams: ['lablesItem', 'lablesIndex'],
              },
              compTree: [
                new CustomCompNode('Tag', {
                  key: new AnonymousFunctionNode({
                    IIFE: true,
                    func: {
                      body: 'lablesItem.name',
                    },
                  }),
                  color: new AnonymousFunctionNode({
                    IIFE: true,
                    func: {
                      body: 'lablesItem.color',
                    },
                  }),
                  children: new AnonymousFunctionNode({
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
    libModules,
    states: [
      {
        name: 'visible',
        initialValue: true,
      },
    ],
    compTree: [
      new CustomCompNode('Switch', {
        checked: new StateNodeType({ name: 'visible' }),
        onChange: new AnonymousFunctionNode({
          params: ['checked'],
          dependences: [{ type: NodeType.STATE, name: 'visible' }],
          effectStates: ['visible'],
          func: {
            body: 'setVisible(!visible)',
          },
        }),
      }),
      new AnonymousFunctionNode({
        IIFE: true,
        funcType: FuncTypeEnum.RENDERFUNC,
        renderFunc: {
          conditionType: ConditionTypeEnum.BOOLEAN,
          boolean: {
            data: new StateNodeType({
              name: 'visible',
            }) as unknown as JSONValue,
          },
          compTree: new CustomCompNode('Typography.Text', {
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
    libModules,
    refs: [{ name: 'actionRef', desc: '表格ref' }],
    compTree: [
      123,
      new CustomCompNode('ProTable', {
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
                text: new AnonymousFunctionNode({
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
            renderFormItem: new AnonymousFunctionNode({
              params: ['_', 'config'],
              func: {
                body: 'return config.defaultRender(_)',
              },
            }),
            render: new AnonymousFunctionNode({
              params: ['_', 'record'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  new CustomCompNode('Space', {
                    children: [
                      new CustomCompNode('Tag', {
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
            renderFormItem: new AnonymousFunctionNode({
              params: ['_', 'config'],
              func: {
                body: 'return config.defaultRender(_)',
              },
            }),
            render: new AnonymousFunctionNode({
              params: ['_', 'record'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  new CustomCompNode('Space', {
                    children: [
                      new AnonymousFunctionNode({
                        IIFE: true,
                        funcType: FuncTypeEnum.RENDERFUNC,
                        renderFunc: {
                          conditionType: ConditionTypeEnum.LISTLOOP,
                          listLoop: {
                            data: new AnonymousFunctionNode({
                              IIFE: true,
                              func: {
                                body: 'record.labels',
                              },
                            }) as AnyType,
                            mapParams: ['lablesItem', 'lablesIndex'],
                          },
                          compTree: new CustomCompNode('Tag', {
                            key: new AnonymousFunctionNode({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.name',
                              },
                            }),
                            color: new AnonymousFunctionNode({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.color',
                              },
                            }),
                            children: new AnonymousFunctionNode({
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
              transform: new AnonymousFunctionNode({
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
            render: new AnonymousFunctionNode({
              params: ['text', 'record', '_', 'action'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  new CustomCompNode('Button', {
                    key: 'editable',
                    type: 'link',
                    onClick: new AnonymousFunctionNode({
                      func: {
                        body: 'action?.startEditable?.(record.id);',
                      },
                    }),
                    children: '编辑',
                  }),
                  new CustomCompNode('Button', {
                    key: 'view',
                    type: 'link',
                    href: new AnonymousFunctionNode({
                      IIFE: true,
                      func: {
                        body: 'record.url',
                      },
                    }),
                    rel: 'noopener noreferrer',
                    children: '查看',
                  }),
                  new CustomCompNode('TableDropdown', {
                    key: 'actionGroup',
                    onSelect: new AnonymousFunctionNode({
                      func: {
                        body: 'action?.reload()',
                      },
                    }),
                    menus: [
                      { key: 'copy', name: '复制' },
                      { key: 'delete', name: '删除' },
                    ],
                  }),
                ],
              },
            }),
          },
        ],
        actionRef: new RefNodeType({ name: 'actionRef' }),
        cardBordered: true,
        request: new AnonymousFunctionNode({
          dependences: [
            {
              type: NodeType.MODULE,
              name: 'request',
              // libName: 'umi-request',
              // alias: 'request',
              // subName: 'default',
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
          onChange: new AnonymousFunctionNode({
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
          syncToUrl: new AnonymousFunctionNode({
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
        toolBarRender: new AnonymousFunctionNode({
          funcType: FuncTypeEnum.RENDERFUNC,
          renderFunc: {
            conditionType: ConditionTypeEnum.DEFAULT,
            compTree: [
              new CustomCompNode('Button', {
                key: 'button',
                // icon: new CustomCompNode('@ant-design/icons', 'PlusOutlined'),
                onClick: new AnonymousFunctionNode({
                  dependences: [
                    {
                      type: NodeType.REF,
                      name: 'actionRef',
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
              new CustomCompNode('Dropdown', {
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
                children: new CustomCompNode('Button', {
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

export const form = createSchemaConfig({
  desc: '表单-自定义hooks',
  schema: {
    libModules,
    states: [
      {
        name: 'visible',
        desc: '弹框可见性',
        initialValue: false,
      },
      {
        name: 'loading',
        desc: '加载中状态',
        initialValue: false,
      },
      // {
      //   name: 'form',
      //   desc: '表单ref',
      //   initialValue: {
      //     type: 'JSExpression',
      //     packages: ['antd'],
      //     value: `(function(){
      //     return this.antd.Form.useForm()[0]
      //   }).call(this)`,
      //   },
      // },
    ],
    customHooks: [
      {
        effect: {
          body: 'Form.useForm()',
          dependences: [
            {
              type: NodeType.MODULE,
              name: 'Form',
            },
          ],
        },
        arrDestructs: ['form'],
      },
    ],
    compTree: new CustomCompNode('Form', {
      form: new HookNodeType({ name: 'form' }),
      name: 'basic',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { maxWidth: 600 },
      initialValues: { remember: true },
      autoComplete: 'off',
      children: [
        new CustomCompNode('Form.Item', {
          label: 'Username',
          name: 'username',
          rules: [{ required: true, message: 'Please input your username!' }],
          children: [new CustomCompNode('Input', {})],
        }),
        new CustomCompNode('Form.Item', {
          label: 'Password',
          name: 'password',
          rules: [{ required: true, message: 'Please input your password!' }],
          children: [new CustomCompNode('Input.Password', {})],
        }),
        new CustomCompNode('Form.Item', {
          name: 'remember',
          valuePropName: 'checked',
          wrapperCol: { offset: 8, span: 16 },
          children: [
            new CustomCompNode('Checkbox', {
              children: 'Remember me',
            }),
          ],
        }),
        new CustomCompNode('Form.Item', {
          wrapperCol: { offset: 8, span: 16 },
          children: [
            new CustomCompNode('Button', {
              type: 'primary',
              children: 'Submit',
              onClick: new AnonymousFunctionNode({
                func: {
                  body: `
                  console.log(form);  
                  form.validateFields().then(()=>{
                    setLoading(true);
                    setTimeout(()=>{
                      setLoading(false);
                    },1000)
                  })
                  `,
                },
                effectStates: ['loading'],
                dependences: [
                  {
                    type: NodeType.HOOK,
                    name: 'form',
                  },
                ],
              }),
            }),
            new CustomCompNode('Button', {
              onClick: new AnonymousFunctionNode({
                func: {
                  body: `
                  console.log(form);
                  form.resetFields()`,
                },
                dependences: [
                  {
                    type: NodeType.HOOK,
                    name: 'form',
                  },
                ],
              }),
              children: 'Reset',
            }),
          ],
        }),
      ],
    }),
  },
});
