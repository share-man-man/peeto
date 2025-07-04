import { AnyType } from '@peeto/core';
import { Button, message, Radio, Row, Space, Typography } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

import {
  cloneElement,
  Component,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import ReactRender from '../ReactRender';
import SourceCode from './SourceCode';
import { toReactStr } from './ToSource';

import { enumOp } from '../../../../demo-schema/react';

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
    const { children: c, fallback, ...p } = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return fallback;
    }

    // Form.Item会传入value，onChange给子组件，需要透传
    return cloneElement(c as ReactElement, { ...p });
  }
}

function App() {
  const [key, setKey] = useState(
    localStorage.getItem('_test_react_cur_key') || 'state'
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
      localStorage.setItem('_test_react_cur_key', key);
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
        onCreateCompNode={({ comp: Comp, fields, parseProps }) => {
          // 编译工具根据react版本，决定使用createElement或jsx-runtime
          // 有可能循环渲染，优先取key值
          const k = fields.props?.key || parseProps.curSchema.id;
          if (!k) {
            console.error('没有找到key值');
          }
          const res = (
            <ErrorBoundary
              key={`ErrorBoundary-${k}`}
              fallback={<div style={{ color: 'red' }}>react-组件渲染错误</div>}
            >
              <Comp key={k} {...fields.props} />
            </ErrorBoundary>
          );
          return res;
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
