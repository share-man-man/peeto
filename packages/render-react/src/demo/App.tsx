import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import ReactRender from '../ReactRender';

import { Component, ReactNode, useEffect, useMemo, useState } from 'react';

import { Button, message, Radio, Row, Space, Typography } from 'antd';

import {
  basic,
  state,
  anonymousFunction,
  listLoop,
  conditionBool,
} from '../../../../demo-schema/react/basic';
import { table } from '../../../../demo-schema/react/table';
import { form } from '../../../../demo-schema/react/form';
import SourceCode from './SourceCode';
import { toReactStr } from './ToSource';
import { AnyType } from '@peeto/core';

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
    key: 'anonymousFunction',
    label: anonymousFunction.desc,
    str: JSON.stringify(anonymousFunction.schema),
  },
  {
    key: 'state',
    label: state.desc,
    str: JSON.stringify(state.schema),
  },
  {
    key: 'listLoop',
    label: listLoop.desc,
    str: JSON.stringify(listLoop.schema),
  },
  {
    key: 'conditionBool',
    label: conditionBool.desc,
    str: JSON.stringify(conditionBool.schema),
  },
  {
    key: 'table',
    label: table.desc,
    str: JSON.stringify(table.schema),
  },
  {
    key: 'form',
    label: form.desc,
    str: JSON.stringify(form.schema),
  },
];

class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: AnyType) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function App() {
  const [key, setKey] = useState(
    localStorage.getItem('_test_cur_key') || 'state'
  );

  const [str, setStr] = useState('');

  const reactCode = useMemo(() => {
    if (!str) {
      return '';
    }
    return toReactStr(str);
  }, [str]);

  useEffect(() => {
    if (key) {
      setStr(enumOp.find((e) => e.key === key)?.str || '');
      localStorage.setItem('_test_cur_key', key);
    }
  }, [key]);

  return (
    <div>
      <div style={{ position: 'fixed', right: 24, zIndex: 999 }}>
        <Space>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<LeftCircleOutlined />}
            onClick={() => {
              let index = enumOp.findIndex((i) => {
                return i.key === key;
              });
              if (index === 0) {
                index = enumOp.length - 1;
              } else {
                index -= 1;
              }

              setKey(enumOp[index].key);
            }}
          />
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<RightCircleOutlined />}
            onClick={() => {
              let index = enumOp.findIndex((i) => {
                return i.key === key;
              });

              if (index === enumOp.length - 1) {
                index = 0;
              } else {
                index += 1;
              }

              setKey(enumOp[index].key);
            }}
          />
        </Space>
      </div>
      <Typography.Title level={2}>schema</Typography.Title>
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
        onCreateCompNode={({ comp: Comp, props }) => {
          // 编译工具根据react版本，决定使用createElement或jsx-runtime
          // const res = <Comp {...props}>{children}</Comp>;
          const res = (
            <ErrorBoundary
              fallback={<div style={{ color: 'red' }}>react-组件渲染错误</div>}
            >
              <Comp {...props} />
            </ErrorBoundary>
          );
          // const res = createElement(Comp, props);
          // console.log(11, res);
          return res;

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
          {
            name: 'umi-request',
            load: async () => import('umi-request'),
          },
        ]}
        // noMatchLibRender={({ schema }) => {
        //   const { id: componentId, packageName } = schema;
        //   return (
        //     <div
        //       key={`nomatch-package-${componentId}`}
        //       style={{
        //         color: 'red',
        //         borderWidth: 2,
        //         borderStyle: 'solid',
        //         borderColor: 'red',
        //         padding: 12,
        //       }}
        //     >
        //       没有找到包:{packageName}
        //     </div>
        //   );
        // }}
        noMatchCompRender={({ schema }) => {
          const { id: componentId, componentName } = schema;
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
              没有找到组件:{componentName}
            </div>
          );
        }}
      />
      <Typography.Title level={2}>
        出码
        <Button
          style={{ marginLeft: 20 }}
          type="primary"
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(reactCode);
            message.success('复制成功，请粘贴到SourceCode.tsx以验证');
          }}
        >
          复制代码
        </Button>
      </Typography.Title>
      <pre>{reactCode}</pre>
      <Typography.Title level={2}>出码渲染验证</Typography.Title>
      <SourceCode />
    </div>
  );
}

export default App;
