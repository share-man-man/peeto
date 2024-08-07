import { Button, Input, Form, Checkbox } from 'antd';

const Index = () => {
  // 引入依赖包

  // 状态

  // ref

  // 事件

  // 自定义hook

  const [form] = Form.useForm();

  // 副作用

  // 组件树
  return (
    <>
      <Form
        key="bcee1737-a9e1-40ae-a966-9a954d37a4b5"
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
      >
        <Form.Item
          key="5cce8162-183f-4d69-9c14-66b6e3a28469"
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input key="6ddba2a6-1383-4403-98c1-86da416655d3" />
        </Form.Item>

        <Form.Item
          key="28f40a52-c097-46c6-a978-556f0dbe5e0b"
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password key="32ba8420-9eb2-47e2-b221-06224301e35a" />
        </Form.Item>

        <Form.Item
          key="88d2dc8a-0850-44ee-b852-14829467b15d"
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox key="4127b368-be02-4877-93b6-98b4b9464c0f">
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item
          key="1a899207-e077-45e4-8ac3-e7410737eea1"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            key="76e10e4e-1f01-4c40-9931-1fb32f366987"
            onClick={() => {
              form.resetFields();
            }}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Index;
