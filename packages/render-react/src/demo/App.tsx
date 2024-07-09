import ReactRender from '../ReactRender';

import { useEffect, useState } from 'react';

import { Radio, Row, Typography } from 'antd';

import { basic, state } from '../../../../demo-schema/react/basic';

const enumOp: {
  key: string;
  label: string;
  str: string;
}[] = [
  {
    key: 'testObj',
    label: basic.desc,
    str: JSON.stringify(basic.schema),
  },
  {
    key: 'state',
    label: state.desc,
    str: JSON.stringify(state.schema),
  },
];

function App() {
  const [key, setKey] = useState('state');
  const [str, setStr] = useState('');

  useEffect(() => {
    if (key) {
      setStr(enumOp.find((e) => e.key === key)?.str || '');
    }
  }, [key]);

  return (
    <div>
      <Typography.Title level={2}>schema类型</Typography.Title>
      <Row>
        <Radio.Group
          value={key}
          onChange={(v) => {
            setKey(v.target.value);
          }}
          options={enumOp.map((e) => ({ label: e.label, value: e.key }))}
        />
      </Row>
      <Typography.Title level={2}>渲染结果</Typography.Title>
      <ReactRender
        loadingRender={() => {
          return <div>react-loading</div>;
        }}
        onCreateCompNode={({ comp: Comp, props, children }) => {
          // 编译工具根据react版本，决定使用createElement或jsx-runtime
          return <Comp {...props}>{children}</Comp>;
          // return jsxDEV(Comp, {
          //   ...props,
          //   children,
          // });
        }}
        schemaStr={str || '{}'}
        // 有些打包器（如vite），默认不能通过import($param)动态加载包名，需要提前写好放到异步函数里去
        libList={[
          {
            name: 'antd',
            load: async () => import('antd'),
          },
          {
            name: '@ant-design/pro-components',
            load: async () => import('@ant-design/pro-components'),
          },
          {
            name: `my-custom`,
            load: async () => {
              return {
                Text: ({ text }: { text: string }) => {
                  return <span>{text}</span>;
                },
              };
            },
          },
        ]}
        noMatchLibRender={({ schema }) => {
          const { id: componentId, packageName } = schema;
          return (
            <div
              key={`nomatch-package-${componentId}`}
              style={{
                color: 'red',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'red',
                padding: 12,
              }}
            >
              没有找到包:{packageName}
            </div>
          );
        }}
        noMatchCompRender={({ schema }) => {
          const { id: componentId, componentName, packageName } = schema;
          return (
            <div
              key={`nomatch-package-component-${componentId}`}
              style={{
                color: 'red',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'red',
                padding: 12,
              }}
            >
              包:{packageName}里没有找到组件:{componentName}
            </div>
          );
        }}
      />
    </div>
  );
}

export default App;
