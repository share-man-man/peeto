import { useState, useEffect } from 'react';
import { Typography, Row, Input, Space } from 'antd';

const Index = () => {
  // 引入依赖包

  // 状态
  // 响应式状态
  const [title, setTitle] = useState('响应式状态');
  // title长度
  const [titleLength, setTitleLength] = useState(0);

  // ref

  // 事件

  // 自定义hook

  // 副作用
  useEffect(() => {
    setTitleLength(title.length);
  }, [title]);

  // 组件树
  return (
    <>
      <Row>
        <Space>
          <Typography.Text>title值：</Typography.Text>

          <Typography.Text>{title}</Typography.Text>
        </Space>
      </Row>

      <Row>
        <Space>
          <Typography.Text>titleLength(effect监听改变)：</Typography.Text>

          <Typography.Text>{titleLength}</Typography.Text>
        </Space>
      </Row>

      <Row>
        <Space>
          <Typography.Text>title长度(表达式)：</Typography.Text>

          <Typography.Text>{(title || '').length}</Typography.Text>
        </Space>
      </Row>

      <Input
        value={title}
        onChange={(v) => {
          setTitle(v.target.value);
        }}
      />
    </>
  );
};

export default Index;
