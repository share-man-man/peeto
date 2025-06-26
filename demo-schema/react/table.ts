import { AnyType, SchemaEffectDependenceType } from '../../packages/core';
import { ConditionTypeEnum, FuncTypeEnum } from '../../packages/core/src/func';
import {
  createFunc,
  createComp,
  createRef,
  createSchemaConfig,
} from '../utils';
import { libModules } from './basic';

export const table = createSchemaConfig({
  desc: '表格-表达式、渲染函数',
  schema: {
    libModules,
    refs: [{ name: 'actionRef', desc: '表格ref' }],
    compTree: [
      123,
      createComp('ProTable', {
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
              open: {
                text: createFunc({
                  IIFE: true,
                  func: {
                    body: '"表达式-".repeat(50)',
                  },
                }),
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
            renderFormItem: createFunc({
              params: ['_', 'config'],
              func: {
                body: 'return config.defaultRender(_)',
              },
            }),
            render: createFunc({
              params: ['_', 'record'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  createComp('Space', {
                    children: [
                      createComp('Tag', {
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
            renderFormItem: createFunc({
              params: ['_', 'config'],
              func: {
                body: 'return config.defaultRender(_)',
              },
            }),
            render: createFunc({
              funcType: FuncTypeEnum.RENDERFUNC,
              params: ['_', 'record'],
              renderFunc: {
                compTree: [
                  createComp('Space', {
                    children: [
                      createFunc({
                        IIFE: true,
                        funcType: FuncTypeEnum.RENDERFUNC,
                        renderFunc: {
                          conditionType: ConditionTypeEnum.LISTLOOP,
                          listLoop: {
                            data: createFunc({
                              IIFE: true,
                              func: {
                                body: 'record.labels',
                              },
                            }) as AnyType,
                            mapParams: ['lablesItem', 'lablesIndex'],
                          },
                          compTree: createComp('Tag', {
                            key: createFunc({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.name',
                              },
                            }),
                            color: createFunc({
                              IIFE: true,
                              func: {
                                body: 'lablesItem.color',
                              },
                            }),
                            children: createFunc({
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
              transform: createFunc({
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
            render: createFunc({
              params: ['text', 'record', '_', 'action'],
              funcType: FuncTypeEnum.RENDERFUNC,
              renderFunc: {
                compTree: [
                  createComp('Button', {
                    key: 'editable',
                    type: 'link',
                    onClick: createFunc({
                      func: {
                        body: 'action?.startEditable?.(record.id);',
                      },
                    }),
                    children: '编辑',
                  }),
                  createComp('Button', {
                    key: 'view',
                    type: 'link',
                    href: createFunc({
                      IIFE: true,
                      func: {
                        body: 'record.url',
                      },
                    }),
                    rel: 'noopener noreferrer',
                    children: '查看',
                  }),
                  createComp('TableDropdown', {
                    key: 'actionGroup',
                    onSelect: createFunc({
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
        actionRef: createRef({ name: 'actionRef' }),
        cardBordered: true,
        request: createFunc({
          dependences: [
            {
              type: SchemaEffectDependenceType.MODULE,
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
          onChange: createFunc({
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
          syncToUrl: createFunc({
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
        toolBarRender: createFunc({
          funcType: FuncTypeEnum.RENDERFUNC,
          renderFunc: {
            conditionType: ConditionTypeEnum.DEFAULT,
            compTree: [
              createComp('Button', {
                key: 'button',
                // icon: createComp('@ant-design/icons', 'PlusOutlined'),
                onClick: createFunc({
                  dependences: [
                    {
                      type: SchemaEffectDependenceType.REF,
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
              createComp('Dropdown', {
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
                children: createComp('Button', {
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
