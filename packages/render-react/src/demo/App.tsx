import { SchemaRootObj } from '@peeto/parse';
import ReactRender from '../ReactRender';

import { v4 as id } from 'uuid';
import { useEffect, useState } from 'react';
import { Radio, Row } from 'antd';

const testObj: SchemaRootObj = {
  states: [
    {
      desc: '响应式状态',
      name: 'title',
      initialValue: '响应式状态',
    },
    {
      desc: '状态依赖展示字符串',
      name: 'titleLengthDesc',
    },
  ],
  events: [
    // {
    //   desc: 'title和titleLengthDesc的状态依赖',
    //   dependences: ['title'],
    //   effectStates: [
    //     {
    //       name: 'titleLengthDesc',
    //       value: 'return `字符串长度为：${this.title.length || 0}`',
    //     },
    //   ],
    // },
  ],
  eventCompTreeeMap: [
    // {
    //   eventName: 'title',
    //   paths: [[0, 'children', 2, 'props', 'onChange']],
    // },
  ],
  stateCompTreeeMap: [
    {
      stateName: 'title',
      paths: [
        [0, 'children', 1, 'children', 0, 'props', 'text'],
        [0, 'children', 2, 'props', 'value'],
      ],
    },
  ],
  compTreeLibMap: [
    {
      packageName: '@ant-design/pro-components',
      componentName: 'PageContainer',
      path: [[0]],
    },
    {
      packageName: 'antd',
      componentName: 'Typography.Title',
      path: [
        [0, 'children', 0],
        [0, 'children', 1],
      ],
    },
    {
      packageName: 'my-custom',
      componentName: 'Text',
      path: [
        [0, 'children', 0, 'children', 0],
        [0, 'children', 1, 'children', 0],
      ],
    },
    {
      packageName: 'antd',
      componentName: 'Input',
      path: [[0, 'children', 2]],
    },
    {
      packageName: '@ant-design/pro-components',
      componentName: 'ProTable',
      path: [[0, 'children', 3]],
    },
  ],
  anonymousFunctionList: [
    {
      path: [0, 'children', 2, 'props', 'onChange'],
    },
  ],
  compTree: [
    {
      id: id(),
      props: {
        header: {
          title: '基础验证',
        },
      },
      children: [
        {
          id: id(),
          props: {},
          children: [
            {
              id: id(),
              props: {
                text: 'antd.Title嵌套自定义组件my-custom.Text',
              },
            },
          ],
        },
        {
          id: id(),
          props: {},
          children: [
            {
              id: id(),
              props: {
                text: '默认标题',
              },
            },
          ],
        },
        {
          id: id(),
          props: {
            value: '默认值',
            onChange: {
              params: ['v'],
              body: `this.onChangeState([['title',v.target.value]])`,
              effects: ['title'],
            },
          },
        },
        // {
        //   id: id(),
        //   // packageName: '@ant-design/pro-components',
        //   // componentName: 'ProTable',
        //   props: {
        //     columns: [
        //       {
        //         dataIndex: 'index',
        //         valueType: 'indexBorder',
        //         width: 48,
        //       },
        //       {
        //         title: '标题',
        //         dataIndex: 'labels',
        //         copyable: true,
        //         ellipsis: true,
        //         tip: '标题过长会自动收缩',
        //         formItemProps: {
        //           rules: [
        //             {
        //               required: true,
        //               message: '此项为必填项',
        //             },
        //           ],
        //         },
        //       },
        //       {
        //         disable: true,
        //         title: '状态',
        //         dataIndex: 'state',
        //         filters: true,
        //         onFilter: true,
        //         ellipsis: true,
        //         valueType: 'select',
        //         valueEnum: {
        //           all: {
        //             // TODO 结局表达式的问题
        //             // {type:'JSExpresson',vaue:'"超长".repeat(50)'}
        //             text: '默认超长文本',
        //           },
        //           open: {
        //             text: '未解决',
        //             status: 'Error',
        //           },
        //           closed: {
        //             text: '已解决',
        //             status: 'Success',
        //             disabled: true,
        //           },
        //           processing: {
        //             text: '解决中',
        //             status: 'Processing',
        //           },
        //         },
        //       },
        //       // {
        //       //   disable: true,
        //       //   title: '标签',
        //       //   dataIndex: 'labels',
        //       //   search: false,
        //       //   renderFormItem: {
        //       //     type: 'JSFunction',
        //       //     params: ['_', 'config'],
        //       //     value: `return config.defaultRender(_)`,
        //       //   },
        //       //   render: {
        //       //     type: 'JSFunction',
        //       //     params: ['text', 'record'],
        //       //     children: [
        //       //       {
        //       //         id: id(),
        //       //         packageName: 'antd',
        //       //         componentName: 'Card',
        //       //         props: {
        //       //           title: {
        //       //             type: 'JSExpression',
        //       //             value: 'this.scope?.text',
        //       //           },
        //       //         },
        //       //         children: [
        //       //           {
        //       //             id: id(),
        //       //             packageName: 'antd',
        //       //             componentName: 'Collapse',
        //       //             props: {
        //       //               defaultActiveKey: ['1', '3'],
        //       //             },
        //       //             children: [
        //       //               {
        //       //                 id: id(),
        //       //                 packageName: 'antd',
        //       //                 componentName: 'Collapse.Panel',
        //       //                 props: {
        //       //                   key: 1,
        //       //                   header: 'This is panel header 1',
        //       //                 },
        //       //                 children: {
        //       //                   type: 'JSExpression',
        //       //                   value: 'this.scope?.record?.name',
        //       //                 },
        //       //               },
        //       //               {
        //       //                 id: id(),
        //       //                 packageName: 'antd',
        //       //                 componentName: 'Collapse.Panel',
        //       //                 props: {
        //       //                   key: 2,
        //       //                   header: 'This is panel header 2',
        //       //                 },
        //       //                 children: '222',
        //       //               },
        //       //               {
        //       //                 id: id(),
        //       //                 packageName: 'antd',
        //       //                 componentName: 'Collapse.Panel',
        //       //                 props: {
        //       //                   key: 3,
        //       //                   header: 'This is panel header 3',
        //       //                 },
        //       //                 children: {
        //       //                   type: 'JSExpression',
        //       //                   value: 'this.scope?.text',
        //       //                 },
        //       //               },
        //       //             ],
        //       //           },
        //       //         ],
        //       //       },
        //       //     ],
        //       //   },
        //       // },
        //     ],
        //     dataSource: [
        //       {
        //         key: 123,
        //         labels: '测试标签231312',
        //         name: '小小',
        //         state: 'open',
        //       },
        //     ],
        //   },
        //   children: [],
        // },
      ],
    },
  ],
};

const modalForm: SchemaRootObj = {
  states: [
    {
      name: 'visible',
      desc: '弹框可见',
      initialValue: false,
    },
    {
      name: 'loading',
      desc: '加载中状态',
      initialValue: false,
    },
    {
      name: 'form',
      desc: '表单ref',
      initialValue: {
        type: 'JSExpression',
        packages: ['antd'],
        value: `(function(){
          return this.antd.Form.useForm()[0]
        }).call(this)`,
      },
    },
  ],
  anonymousFunctionList: [],
  events: [],
  compTreeLibMap: [],
  compTree: [
    {
      id: id(),
      packageName: 'antd',
      componentName: 'Modal',
      props: {
        title: '测试表单',
        open: {
          type: 'JSExpression',
          state: 'visible',
        },
        onCancel: {
          type: 'JSFunction',
          effects: ['visible'],
          value: `this.onChangeState([['visible',false]])`,
        },
        confirmLoading: {
          type: 'JSExpression',
          state: 'loading',
        },
        maskClosable: false,
        destroyOnClose: true,
        bodyStyle: { display: 'flex', justifyContent: 'center' },
      },
      children: [
        {
          id: id(),
          packageName: 'antd',
          componentName: 'Form',
          props: {
            form: {
              type: 'JSExpression',
              state: 'form',
            },
            name: 'basic',
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            style: { maxWidth: 600 },
            initialValues: { remember: true },
            autoComplete: 'off',
          },
          children: [
            {
              id: id(),
              packageName: 'antd',
              componentName: 'Form.Item',
              props: {
                label: 'Username',
                name: 'username',
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              },
              children: [
                {
                  id: id(),
                  packageName: 'antd',
                  componentName: 'Input',
                },
              ],
            },
            {
              id: id(),
              packageName: 'antd',
              componentName: 'Form.Item',
              props: {
                label: 'Password',
                name: 'password',
                rules: [
                  { required: true, message: 'Please input your password!' },
                ],
              },
              children: [
                {
                  id: id(),
                  packageName: 'antd',
                  componentName: 'Input.Password',
                },
              ],
            },
            {
              id: id(),
              packageName: 'antd',
              componentName: 'Form.Item',
              props: {
                name: 'remember',
                valuePropName: 'checked',
                wrapperCol: { offset: 8, span: 16 },
              },
              children: [
                {
                  id: id(),
                  packageName: 'antd',
                  componentName: 'Checkbox',
                  children: [
                    {
                      id: id(),
                      packageName: 'my-custom',
                      componentName: 'Text',
                      props: {
                        text: 'Remember me',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: id(),
              packageName: 'antd',
              componentName: 'Form.Item',
              props: {
                wrapperCol: { offset: 8, span: 16 },
              },
              children: [
                {
                  id: id(),
                  packageName: 'antd',
                  componentName: 'Button',
                  props: {
                    type: 'primary',
                    htmlType: 'submit',
                  },
                  children: [
                    {
                      id: id(),
                      packageName: 'my-custom',
                      componentName: 'Text',
                      props: {
                        text: 'Submit',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: id(),
      packageName: 'antd',
      componentName: 'Button',
      props: {
        type: 'primary',
        onClick: {
          type: 'JSFunction',
          effects: ['visible'],
          value: `this.onChangeState([['visible',true]])`,
        },
      },
      children: [
        {
          id: id(),
          packageName: 'my-custom',
          componentName: 'Text',
          props: {
            text: '打开表单',
          },
        },
      ],
    },
  ],
};

const enumOp: {
  key: string;
  label: string;
  str: string;
}[] = [
  {
    key: 'testObj',
    label: '基础',
    str: JSON.stringify(testObj),
  },
  {
    key: 'modalForm',
    label: '表单',
    str: JSON.stringify(modalForm),
  },
];

function App() {
  const [key, setKey] = useState('testObj');
  const [str, setStr] = useState('');

  useEffect(() => {
    if (key) {
      setStr(enumOp.find((e) => e.key === key)?.str || '');
    }
  }, [key]);

  return (
    <div>
      <Row>
        <Radio.Group
          value={key}
          onChange={(v) => {
            setKey(v.target.value);
          }}
          options={enumOp.map((e) => ({ label: e.label, value: e.key }))}
        />
      </Row>
      <ReactRender
        loadingRender={() => {
          return <div>react-loading</div>;
        }}
        onCreateNode={({ comp: Comp, props, children }) => {
          // 编译工具根据react版本，决定使用createElement或jsx-runtime
          return <Comp {...props}>{children}</Comp>;
        }}
        schemaStr={str || '{}'}
        // 有些打包器（如vite），默认不能通过import($param)动态加载包名，需要提前写好放到异步函数里去
        libList={[
          {
            name: 'antd',
            load: async () => import('antd'),
          },
          {
            name: '@ant-design/pro-components',
            load: async () => import('@ant-design/pro-components'),
          },
          {
            name: `my-custom`,
            load: async () => {
              return {
                Text: ({ text }: { text: string }) => {
                  return <span>{text}</span>;
                },
              };
            },
          },
        ]}
        noMatchPackageRender={({ schema, compTreeItem }) => {
          const { id: componentId } = schema;
          const { packageName } = compTreeItem;
          return (
            <div
              key={`nomatch-package-${componentId}`}
              style={{
                color: 'red',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'red',
                padding: 12,
              }}
            >
              没有找到包:{packageName}
            </div>
          );
        }}
        noMatchCompRender={({ schema, compTreeItem }) => {
          const { id: componentId } = schema;
          const { componentName, packageName } = compTreeItem;
          return (
            <div
              key={`nomatch-package-component-${componentId}`}
              style={{
                color: 'red',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'red',
                padding: 12,
              }}
            >
              包:{packageName}里没有找到组件:{componentName}
            </div>
          );
        }}
      />
    </div>
  );
}

export default App;
