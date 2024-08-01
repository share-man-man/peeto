import ReactRender from '../ReactRender';

import { useEffect, useState } from 'react';

import { Button, message, Radio, Row, Typography } from 'antd';

import {
  basic,
  state,
  anonymousFunction,
  table,
  listLoop,
  conditionBool,
} from '../../../../demo-schema/react/basic';
import { getLibInRoot, SchemaRootObj } from '@peeto/core';
import SourceCode from './SourceCode';
import { getStateStr } from './ToSource/state';
import { getEffectStr } from './ToSource/effect';
import { getCompTreeStr, recusionCompTree } from './ToSource/compTree';
import { getLibStr } from './ToSource/lib';
import { getRefStr } from './ToSource/ref';

const toReactStr = (str: string) => {
  const libStr = getLibStr(
    getLibInRoot({ obj: JSON.parse(str || '{}') as SchemaRootObj })
  );
  const stateStr = getStateStr(JSON.parse(str || '{}') as SchemaRootObj);
  const refStr = getRefStr(JSON.parse(str || '{}') as SchemaRootObj);
  const effectsStr = getEffectStr(JSON.parse(str || '{}') as SchemaRootObj);
  const { treeObj } = recusionCompTree(
    JSON.parse(str || '{}') as SchemaRootObj
  );
  const treeStr = getCompTreeStr(treeObj, { parentNode: 'comp' });

  return `import { useState, useEffect, useRef } from "react";
${libStr}

const Index = () => {
  // 引入依赖包

  // 状态
  ${stateStr}

  // ref
  ${refStr}

  // 事件

  // 副作用
  ${effectsStr}

  // 组件树
  return (
    <>
      ${treeStr}
    </>
  );
};

export default Index
`;
};

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
  const [key, setKey] = useState('table');

  const [str, setStr] = useState('');

  useEffect(() => {
    if (key) {
      setStr(enumOp.find((e) => e.key === key)?.str || '');
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
      <Typography.Title level={2}>
        出码
        <Button
          style={{ marginLeft: 20 }}
          type="primary"
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(toReactStr(str));
            message.success('复制成功，请粘贴到SourceCode.tsx以验证');
          }}
        >
          复制代码
        </Button>
      </Typography.Title>
      <pre>{str && toReactStr(str)}</pre>
      <Typography.Title level={2}>出码渲染验证</Typography.Title>
      <SourceCode />
    </div>
  );
}

export default App;
