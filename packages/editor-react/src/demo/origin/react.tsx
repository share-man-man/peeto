import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Table,
  TableProps,
} from 'antd';
import { useEffect, useState } from 'react';

const Index = () => {
  const [form] = Form.useForm();
  const [visilbe, setVisible] = useState(false);
  const [options] = useState<SelectProps['options']>([
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
  ]);
  const [types, setTypes] = useState<Record<string, SelectProps['options']>>(
    {}
  );
  const [columns, setColumns] = useState<TableProps['columns']>([]);

  useEffect(() => {
    // requeist请求
    setTypes({});
  }, []);

  useEffect(() => {
    setColumns([
      {
        title: '1',
        render: () => {
          return <div>123</div>;
        },
      },
      {
        title: '2',
        render: () => {
          return <div>{JSON.stringify(types)}</div>;
        },
      },
    ]);
  }, [types]);

  return (
    <>
      <Row>
        <Row>
          <Form form={form}>
            <Form.Item name="name" label="用户名">
              <Input />
            </Form.Item>
            <Form.Item name="id" label="orgId">
              <Select options={options} />
            </Form.Item>
          </Form>
        </Row>
        <Row>
          <Button>重置</Button>
          <Button>查询</Button>
        </Row>
        <Row>
          <Button>新增</Button>
        </Row>
        <Row>
          <Table columns={columns} />
        </Row>
        <Modal
          open={visilbe}
          onCancel={() => {
            setVisible(false);
          }}
        ></Modal>
      </Row>
    </>
  );
};

export default Index;
