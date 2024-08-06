import ReactRender from '../ReactRender';

import { useEffect, useMemo, useState } from 'react';

import { Button, message, Radio, Row, Typography } from 'antd';

import {
  basic,
  state,
  anonymousFunction,
  table,
  listLoop,
  conditionBool,
} from '../../../../demo-schema/react/basic';
import SourceCode from './SourceCode';
import { toReactStr } from './ToSource';

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
];

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
          const res = <Comp {...props} />;
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
