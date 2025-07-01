import { Form, Select, Typography } from 'antd';
import { PropFormCompPropType, setValueByPath } from '../../util';
import { FC, useEffect } from 'react';

const Index: FC<PropFormCompPropType> = ({
  curSchema,
  onChange,
  path,
  schemaRootObj,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(curSchema.props || {});
  }, [form, curSchema.props]);
  // 1、遍历first.props
  // 2、获取每个props值、类型
  // 3、根据值、类型，设置表单项
  // TODO 判断参数路径是否在schemaObj.schemaNodePaths中，再判断节点类型。再判断是否为普通节点类型
  return (
    <div>
      <Typography.Title level={5}>ElText</Typography.Title>
      <Form
        form={form}
        onFieldsChange={(fields) => {
          const newSchemaRootObj = JSON.parse(JSON.stringify(schemaRootObj));
          fields.forEach(({ name, value }) => {
            setValueByPath(
              ['compTree', ...path, 'props', ...name],
              value,
              newSchemaRootObj
            );
          });
          onChange(JSON.stringify(newSchemaRootObj));
        }}
      >
        <Form.Item name="type" label="文本类型">
          <Select
            options={[
              { label: 'primary', value: 'primary' },
              { label: 'success', value: 'success' },
              { label: 'warning', value: 'warning' },
              { label: 'danger', value: 'danger' },
              { label: 'info', value: 'info' },
            ]}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Index;
