import { FieldTypeEnum } from '../../packages/core';
import { NodeType } from '../../packages/core/src/root';
import {
  createFunc,
  createComp,
  createHook,
  createSchemaConfig,
} from '../utils';
import { libModules } from './basic';

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
        field: {
          type: FieldTypeEnum.ARR,
          [FieldTypeEnum.ARR]: ['form'],
        },
      },
    ],
    compTree: createComp('Form', {
      form: createHook({ name: 'form' }),
      name: 'basic',
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { maxWidth: 600 },
      initialValues: { remember: true },
      autoComplete: 'off',
      children: [
        createComp('Form.Item', {
          label: 'Username',
          name: 'username',
          rules: [{ required: true, message: 'Please input your username!' }],
          children: [createComp('Input', {})],
        }),
        createComp('Form.Item', {
          label: 'Password',
          name: 'password',
          rules: [{ required: true, message: 'Please input your password!' }],
          children: [createComp('Input.Password', {})],
        }),
        createComp('Form.Item', {
          name: 'remember',
          valuePropName: 'checked',
          wrapperCol: { offset: 8, span: 16 },
          children: [
            createComp('Checkbox', {
              children: 'Remember me',
            }),
          ],
        }),
        createComp('Form.Item', {
          wrapperCol: { offset: 8, span: 16 },
          children: [
            createComp('Button', {
              type: 'primary',
              children: 'Submit',
              onClick: createFunc({
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
            createComp('Button', {
              onClick: createFunc({
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
