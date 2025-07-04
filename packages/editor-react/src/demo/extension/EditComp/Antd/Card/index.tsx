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
        <Form.Item name="actions" label="卡片操作组，位置在卡片底部">
          {/* TODO 组件数组 */}
          <FieldEditor allowedFieldType={['array']} />
        </Form.Item>
        <Form.Item name="activeTabKey" label="当前激活页签的 key">
          <FieldEditor allowedFieldType={['string']} />
        </Form.Item>
        <Form.Item name="bodyStyle" label="内容区域自定义样式">
          {/* TODO css样式编辑器 */}
          <FieldEditor allowedFieldType={['object']} />
        </Form.Item>
        <Form.Item name="bordered" label="是否有边框" initialValue={true}>
          <FieldEditor allowedFieldType={['boolean']} />
        </Form.Item>
        <Form.Item name="cover" label="卡片封面">
          {/* TODO 组件渲染 */}
          <FieldEditor allowedFieldType={['comp']} />
        </Form.Item>
        <Form.Item
          name="defaultActiveTabKey"
          label="初始化选中页签的 key，如果没有设置 activeTabKey"
        >
          <FieldEditor allowedFieldType={['boolean']} />
        </Form.Item>
        <Form.Item name="extra" label="卡片右上角的操作区域">
          {/* TODO 组件渲染 */}
          <FieldEditor allowedFieldType={['comp']} />
        </Form.Item>
        <Form.Item name="headStyle" label="自定义标题区域样式">
          {/* TODO css样式编辑器 */}
          <FieldEditor allowedFieldType={['object']} />
        </Form.Item>
        <Form.Item
          name="hoverable"
          label="鼠标移过时可浮起"
          initialValue={false}
        >
          <FieldEditor allowedFieldType={['boolean']} />
        </Form.Item>
        <Form.Item
          name="loading"
          label="当卡片内容还在加载中时，可以用 loading 展示一个占位"
          initialValue={false}
        >
          <FieldEditor allowedFieldType={['boolean']} />
        </Form.Item>
        <Form.Item name="size" label="card 的尺寸" initialValue={'default'}>
          <FieldEditor
            allowedFieldType={['string']}
            customTypeRender={{
              string: ({ value, onChange }) => {
                return (
                  <Select
                    value={value}
                    onChange={onChange}
                    options={[
                      { label: 'small', value: 'small' },
                      { label: 'default', value: 'default' },
                    ]}
                  />
                );
              },
            }}
          />
        </Form.Item>
        <Form.Item name="tabBarExtraContent" label="tab bar 上额外的元素">
          {/* TODO 组件渲染 */}
          <FieldEditor allowedFieldType={['comp']} />
        </Form.Item>
        <Form.Item name="tabList" label="页签标题列表">
          {/* TODO 数组对象渲染 */}
          <FieldEditor allowedFieldType={['array']} />
        </Form.Item>
        {/* <Form.Item name="tabProps" label="Tabs">
          <FieldEditor allowedFieldType={} />
        </Form.Item> */}
        <Form.Item name="title" label="页签标题">
          <FieldEditor allowedFieldType={['string', 'comp']} />
        </Form.Item>
        <Form.Item name="type" label="卡片类型，可设置为 inner 或 不设置">
          <FieldEditor allowedFieldType={['string']} />
        </Form.Item>
        <Form.Item name="onTabChange" label="页签切换的回调">
          <FieldEditor allowedFieldType={['func-default']} />
        </Form.Item>
      </Form>

      {/* TODO slots渲染处理 */}
    </div>
  );
};

export default Index;
