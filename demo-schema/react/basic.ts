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
                  dependences: ['title'],
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
            funcType: 'renderFunc',
            renderFunc: {
              conditionType: 'listLoop',
              listLoop: {
                data: createAnonymousFunction({
                  IIFE: true,
                  dependences: ['record'],
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
    states: [
      {
        name: 'visible',
        initialValue: false,
      },
    ],
    compTree: [
      createCompNode('antd', 'Switch', {
        checked: createStateNode({ stateName: 'visible' }),
        onChange: createAnonymousFunction({
          params: ['checked'],
          dependences: ['visible'],
          effectStates: ['visible'],
          func: {
            body: 'setVisible(!visible)',
          },
        }),
      }),
      createAnonymousFunction({
        IIFE: true,
        funcType: 'renderFunc',
        renderFunc: {
          conditionType: 'boolean',
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
              funcType: 'renderFunc',
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
              funcType: 'renderFunc',
              renderFunc: {
                compTree: [
                  createCompNode('antd', 'Space', {
                    children: [
                      createAnonymousFunction({
                        IIFE: true,
                        funcType: 'renderFunc',
                        renderFunc: {
                          conditionType: 'listLoop',
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
                                body: 'lablesItem.color',
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
                        },
                      }),
                    ],
                  }),
                ],
              },
            }),
          },
          // {
          //   disable: true,
          //   title: '渲染函数-复杂组件树',
          //   dataIndex: 'name',
          //   search: false,
          //   renderFormItem: createAnonymousFunction({
          //     params: ['_', 'config'],
          //     body: 'return config.defaultRender(_)',
          //   }),
          //   render: createAnonymousFunction({
          //     params: ['text', 'record'],
          //     body: '',
          //     isCompTree: true,
          //     compTree: [
          //       createCompNode('antd', 'Card', {
          //         title: createAnonymousFunction({
          //           IIFE: true,
          //           body: 'record.name',
          //         }),
          //         children: [
          //           createCompNode('antd', 'Collapse', {
          //             defaultActiveKey: ['1', '3'],
          //             children: [
          //               createCompNode('antd', 'Collapse.Panel', {
          //                 key: 1,
          //                 header: 'This is panel header 1',
          //                 children: createAnonymousFunction({
          //                   IIFE: true,
          //                   body: 'record.labels',
          //                 }),
          //               }),
          //               createCompNode('antd', 'Collapse.Panel', {
          //                 key: 2,
          //                 header: 'This is panel header 2',
          //                 children: '222',
          //               }),
          //             ],
          //           }),
          //         ],
          //       }) as AnyType,
          //     ],
          //   }),
          // },
        ],
        // actionRef={actionRef}

        cardBordered: true,
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
        dateFormatter: 'string',
        headerTitle: '高级表格',
        dataSource: [
          {
            id: 624748504,
            number: 6689,
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
            state: 'all',
            locked: false,
            comments: 1,
            created_at: '2020-05-26T09:42:56Z',
            updated_at: '2020-05-26T10:03:02Z',
            closed_at: null,
            author_association: 'NONE',
            user: 'chenshuai2144',
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          },
          {
            id: 624691229,
            number: 6688,
            title: '🐛 [BUG]无法创建工程npm create umi',
            labels: [
              {
                name: 'bug',
                color: 'error',
              },
            ],
            state: 'open',
            locked: false,
            comments: 0,
            created_at: '2020-05-26T08:19:22Z',
            updated_at: '2020-05-26T08:19:22Z',
            closed_at: null,
            author_association: 'NONE',
            user: 'chenshuai2144',
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          },
          {
            id: 624674790,
            number: 6685,
            title: '🧐 [问题] build 后还存在 es6 的代码（Umi@2.13.13）',
            labels: [
              {
                name: 'question',
                color: 'success',
              },
            ],
            state: 'closed',
            locked: false,
            comments: 0,
            created_at: '2020-05-26T07:54:25Z',
            updated_at: '2020-05-26T07:54:25Z',
            closed_at: null,
            author_association: 'NONE',
            user: 'chenshuai2144',
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          },
          {
            id: 624620220,
            number: 6683,
            title: '2.3.1版本如何在业务页面修改头部状态',
            labels: [
              {
                name: 'question',
                color: 'success',
              },
            ],
            state: 'processing',
            locked: false,
            comments: 2,
            created_at: '2020-05-26T05:58:24Z',
            updated_at: '2020-05-26T07:17:39Z',
            closed_at: null,
            author_association: 'NONE',
            user: 'chenshuai2144',
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          },
          {
            id: 624592471,
            number: 6682,
            title: 'hideChildrenInMenu设置后，子路由找不到了',
            labels: [
              {
                name: 'bug',
                color: 'error',
              },
            ],
            state: 'open',
            locked: false,
            comments: 2,
            created_at: '2020-05-26T04:25:59Z',
            updated_at: '2020-05-26T08:00:51Z',
            closed_at: null,
            author_association: 'NONE',
            user: 'chenshuai2144',
            avatar:
              'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          },
        ],
        // form={{
        //   // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        //   syncToUrl: (values, type) => {
        //     if (type === 'get') {
        //       return {
        //         ...values,
        //         created_at: [values.startTime, values.endTime],
        //       };
        //     }
        //     return values;
        //   },
        // }}
        // pagination={{
        //   pageSize: 5,
        //   onChange: (page) => console.log(page),
        // }}
        // toolBarRender={() => [
        //   <Button
        //     key="button"
        //     icon={<PlusOutlined />}
        //     onClick={() => {
        //       actionRef.current?.reload();
        //     }}
        //     type="primary"
        //   >
        //     新建
        //   </Button>,
        //   <Dropdown
        //     key="menu"
        //     menu={{
        //       items: [
        //         {
        //           label: '1st item',
        //           key: '1',
        //         },
        //         {
        //           label: '2nd item',
        //           key: '2',
        //         },
        //         {
        //           label: '3rd item',
        //           key: '3',
        //         },
        //       ],
        //     }}
        //   >
        //     <Button>
        //       <EllipsisOutlined />
        //     </Button>
        //   </Dropdown>,
        // ]}
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
