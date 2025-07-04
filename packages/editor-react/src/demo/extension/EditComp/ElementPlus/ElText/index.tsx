import { Form, Select, Typography } from 'antd';
import { PropFormCompPropType, setValueByPath } from '../../util';
import { FC, useEffect, useRef } from 'react';
import { SchemaCompTreeItem, SchemaRootObj } from '@peeto/core';

import FieldEditor from '../../FieldEditor';

const Index: FC<PropFormCompPropType> = ({
  curSchema,
  onSchemaChange,
  path,
  schemaRootObj,
  libName,
  moduleItem,
}) => {
  const propsRef = useRef(curSchema.props);
  propsRef.current = curSchema.props;

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(propsRef.current || {});
  }, [form]);

  return (
    <div>
      <Typography.Title level={5}>
        {[libName, moduleItem?.name].filter((i) => !!i).join('@')}
      </Typography.Title>
      <Form
        form={form}
        onFieldsChange={(fields) => {
          const newSchemaRootObj = JSON.parse(
            JSON.stringify(schemaRootObj)
          ) as SchemaRootObj;

          if (newSchemaRootObj.compTree) {
            fields.forEach(({ name, value }) => {
              setValueByPath(
                [...path, 'props', ...name],
                value,
                newSchemaRootObj.compTree as SchemaCompTreeItem[]
              );
            });
          }
          onSchemaChange(JSON.stringify(newSchemaRootObj));
        }}
      >
        <Form.Item name="type" label="类型">
          <FieldEditor
            allowedFieldType={['string', 'undefined']}
            customTypeRender={{
              string: ({ value, onChange }) => {
                return (
                  <Select
                    {...{ value, onChange }}
                    options={[
                      { label: 'primary', value: 'primary' },
                      { label: 'success', value: 'success' },
                      { label: 'warning', value: 'warning' },
                      { label: 'danger', value: 'danger' },
                      { label: 'info', value: 'info' },
                    ]}
                  />
                );
              },
            }}
          />
        </Form.Item>
        <Form.Item name="size" label="大小">
          <FieldEditor
            allowedFieldType={['string', 'undefined']}
            customTypeRender={{
              string: ({ value, onChange }) => {
                return (
                  <Select
                    value={value}
                    onChange={onChange}
                    options={[
                      { label: '大', value: 'large' },
                      { label: '默认', value: 'default' },
                      { label: '小', value: 'small' },
                    ]}
                  />
                );
              },
            }}
          />
        </Form.Item>
        <Form.Item name="truncated" label="是否省略号">
          <FieldEditor allowedFieldType={['boolean']} />
        </Form.Item>
        <Form.Item name="line-clamp" label="最大行数">
          <FieldEditor allowedFieldType={['string', 'number']} />
        </Form.Item>
        <Form.Item name="tag" label="自定义元素标签">
          <FieldEditor allowedFieldType={['string']} />
        </Form.Item>
      </Form>

      {/* TODO slots渲染处理 */}
    </div>
  );
};

export default Index;
