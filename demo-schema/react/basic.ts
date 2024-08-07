import { SchemaRootObj } from '@peeto/core';
import { ConditionTypeEnum, FuncTypeEnum } from '../../packages/core/src/func';
import { NodeType } from '../../packages/core/src/root';
import {
  createCompNode,
  createAnonymousFunction,
  createStateNode,
  createSchemaConfig,
  createRefNode,
  createHookNode,
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
      createCompNode('Card', {
        title: 'antd.Card',
        children: createCompNode('Typography.Text', {
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
      createCompNode('Button', {
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
        dependences: [{ type: NodeType.STATE, stateName: 'title' }],
        effectStates: ['titleLength'],
        body: `
        setTitleLength(title.length)`,
      },
    ],
    compTree: [
      createCompNode('Row', {
        children: [
          createCompNode('Space', {
            children: [
              createCompNode('Typography.Text', {
                children: 'title值：',
              }),
              createCompNode('Typography.Text', {
                children: createStateNode({ stateName: 'title' }),
              }),
            ],
          }),
        ],
      }),
      createCompNode('Row', {
        children: [
          createCompNode('Space', {
            children: [
              createCompNode('Typography.Text', {
                children: 'titleLength(effect监听改变)：',
              }),
              createCompNode('Typography.Text', {
                children: createStateNode({ stateName: 'titleLength' }),
              }),
            ],
          }),
        ],
      }),
      createCompNode('Row', {
        children: [
          createCompNode('Space', {
            children: [
              createCompNode('Typography.Text', {
                children: 'title长度(表达式)：',
              }),
              createCompNode('Typography.Text', {
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
      createCompNode('Input', {
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
      createCompNode('Space', {
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
                createCompNode('Tag', {
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
    libModules,
    states: [
      {
        name: 'visible',
        initialValue: true,
      },
    ],
    compTree: [
      createCompNode('Switch', {
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
          compTree: createCompNode('Typography.Text', {
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
      createCompNode('ProTable', {
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
                  createCompNode('Space', {
                    children: [
                      createCompNode('Tag', {
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
                  createCompNode('Space', {
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
                          compTree: createCompNode('Tag', {
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
                  createCompNode('Button', {
                    key: 'editable',
                    type: 'link',
                    onClick: createAnonymousFunction({
                      func: {
                        body: 'action?.startEditable?.(record.id);',
                      },
                    }),
                    children: '编辑',
                  }),
                  createCompNode('Button', {
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
                  createCompNode('TableDropdown', {
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
                  }),
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
              createCompNode('Button', {
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
              createCompNode('Dropdown', {
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
                children: createCompNode('Button', {
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
          body: 'return Form.useForm()',
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
    compTree: [
      createCompNode('Modal', {
        title: '测试表单',
        open: createStateNode({ stateName: 'visible' }),
        onCancel: createAnonymousFunction({
          func: {
            body: 'setVisible(false)',
          },
          effectStates: ['visible'],
        }),
        confirmLoading: createStateNode({ stateName: 'loading' }),
        maskClosable: false,
        destroyOnClose: true,
        children: [
          createCompNode('Form', {
            form: createHookNode({ hookName: 'form' }),
            name: 'basic',
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            style: { maxWidth: 600 },
            initialValues: { remember: true },
            autoComplete: 'off',
            children: [
              createCompNode('Form.Item', {
                label: 'Username',
                name: 'username',
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
                children: [createCompNode('Input', {})],
              }),
              createCompNode('Form.Item', {
                label: 'Password',
                name: 'password',
                rules: [
                  { required: true, message: 'Please input your password!' },
                ],
                children: [createCompNode('Input.Password', {})],
              }),
              createCompNode('Form.Item', {
                name: 'remember',
                valuePropName: 'checked',
                wrapperCol: { offset: 8, span: 16 },
                children: [
                  createCompNode('Checkbox', {
                    children: 'Remember me',
                  }),
                ],
              }),
              createCompNode('Form.Item', {
                wrapperCol: { offset: 8, span: 16 },
                children: [
                  createCompNode('Button', {
                    type: 'primary',
                    children: 'Submit',
                    onClick: createAnonymousFunction({
                      func: {
                        body: `
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
                          hookName: 'form',
                        },
                      ],
                    }),
                  }),
                  createCompNode('Button', {
                    onClick: createAnonymousFunction({
                      func: {
                        body: `
                        console.log(form);
                        form.resetFields()`,
                      },
                      dependences: [
                        {
                          type: NodeType.HOOK,
                          hookName: 'form',
                        },
                      ],
                    }),
                    children: 'Reset',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      createCompNode('Button', {
        type: 'primary',
        children: '打开表单',
        onClick: createAnonymousFunction({
          func: {
            body: 'setVisible(true)',
          },
          effectStates: ['visible'],
        }),
      }),
    ],
  },
});
