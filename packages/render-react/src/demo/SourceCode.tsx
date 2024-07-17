import { useState, useEffect } from 'react';
import { Typography, Space, Row, Input } from 'antd';

const Index = () => {
  // 引入依赖包

  // 状态
  const [title, setTitle] = useState('响应式状态');
  const [titleLength, setTitleLength] = useState(0);

  // ref

  // 事件

  // 副作用
  useEffect(() => {
    setTitleLength(title.length);
  }, [title]);

  // 组件树
  return (
    <>
      <Row key="d8ed5d43-f638-4248-aa8a-996cb92d89e9">
        <Space key="7f2bf61b-f467-459b-8b41-991d5c8e4eae">
          <Typography.Text key="ce4aff71-2118-4aa7-bf0e-f628506ab67f">
            字符长度：
          </Typography.Text>

          <Typography.Text key="29441d51-4dfd-4399-a7bd-81ce25d5301c">
            {titleLength}
          </Typography.Text>
        </Space>
      </Row>

      <Row key="8ec06919-bbcc-45b8-82f9-fc1347e58ff9">
        <Space key="ced3fc36-073c-401a-9873-db885e65a3bd">
          <Typography.Text key="cc44853b-3ac3-4807-a075-bdf355d0c545">
            输入的值：
          </Typography.Text>

          <Typography.Text key="3f977778-9473-46d4-9890-f9fe99aa5064">
            {title}
          </Typography.Text>
        </Space>
      </Row>

      <Input
        key="4a231882-656b-4964-9d9c-a49e19af73b1"
        value={title}
        onChange={(v) => {
          setTitle(v.target.value);
        }}
      />
    </>
  );
};

export default Index;
