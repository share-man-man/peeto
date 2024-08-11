import { Button, Input, Form, Checkbox } from 'antd';

const Index = () => {
  // 引入依赖包

  // 状态
  // // 加载中状态
  // const [loading, setLoading] = useState(false);

  // ref

  // 事件

  // 自定义hook

  const [form] = Form.useForm();

  // 副作用

  // 组件树
  return (
    <>
      <Form
        key="61836be2-67f0-4deb-bd9d-dd71bd5e0e84"
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
          key="ac04c920-fda9-4a95-b82a-b6e632a155b8"
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input key="7895cff8-6a2a-4075-a5bf-860d499cb5bd" />
        </Form.Item>

        <Form.Item
          key="6dc78792-2ff1-4f41-a5df-0bb0dae2ee0a"
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password key="e31c5d19-83ae-4873-bb9f-9031c366af37" />
        </Form.Item>

        <Form.Item
          key="0b9f84aa-d20f-4374-b00f-6b108d56284c"
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox key="d3017847-7957-44f3-b782-d424660f0ba7">
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item
          key="6d047bfb-b492-4c11-aa21-4b57ccd9bb6b"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            key="97d41a3a-62bf-4b7b-a734-073c4ad72e0a"
            type="primary"
            onClick={() => {
              // console.log(form);
              form.validateFields().then(() => {
                // setLoading(true);
                setTimeout(() => {
                  // setLoading(false);
                }, 1000);
              });
            }}
          >
            Submit
          </Button>

          <Button
            key="5f411c4f-3b41-4422-9901-ec5e241ac3c9"
            onClick={() => {
              // console.log(form);
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
