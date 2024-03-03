import { SchemaRootObj } from '@peeto/parse';
import { v4 as id } from 'uuid';

export const schema: SchemaRootObj = {
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
  effects: [],
  compTree: [
    {
      id: `modal-${id()}`,
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
          id: `text-1-${id()}`,
          packageName: 'my-custom',
          componentName: 'Text',
          props: {
            text: '111',
          },
        },
        {
          id: `${id()}`,
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
              id: `${id()}`,
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
                  id: `${id()}`,
                  packageName: 'antd',
                  componentName: 'Input',
                },
              ],
            },
            {
              id: `${id()}`,
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
                  id: `${id()}`,
                  packageName: 'antd',
                  componentName: 'Input.Password',
                },
              ],
            },
            {
              id: `${id()}`,
              packageName: 'antd',
              componentName: 'Form.Item',
              props: {
                name: 'remember',
                valuePropName: 'checked',
                wrapperCol: { offset: 8, span: 16 },
              },
              children: [
                {
                  id: `${id()}`,
                  packageName: 'antd',
                  componentName: 'Checkbox',
                  children: [
                    {
                      id: `${id()}`,
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
              id: `${id()}`,
              packageName: 'antd',
              componentName: 'Form.Item',
              props: {
                wrapperCol: { offset: 8, span: 16 },
              },
              children: [
                {
                  id: `${id()}`,
                  packageName: 'antd',
                  componentName: 'Button',
                  props: {
                    type: 'primary',
                    htmlType: 'submit',
                  },
                  children: [
                    {
                      id: `${id()}`,
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
      id: `button-${id()}`,
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
          id: `text-打开-${id()}`,
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
