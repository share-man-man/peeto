import { useState } from 'react';
import { Space, Tag } from 'antd';

const Index = () => {
  // 引入依赖包

  // 状态

  const [record] = useState({
    title: '🐛 [BUG]yarn install命令 antd2.4.5会报错',
    labels: [
      { name: 'error', color: 'error' },
      { name: 'success', color: 'success' },
      { name: 'processing', color: 'processing' },
      { name: 'default', color: 'default' },
      { name: 'warning ', color: 'warning' },
    ],
  });

  // ref

  // 事件

  // 副作用

  // 组件树
  return (
    <>
      <Space key="fcb947a7-89a3-442c-b7e5-a23f4edd7c82">
        {record.labels.map((lablesItem) => {
          return [
            <Tag key={lablesItem.name} color={lablesItem.color}>
              {lablesItem.color}
            </Tag>,
          ];
        })}
      </Space>
    </>
  );
};

export default Index;
