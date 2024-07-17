import ReactRender from '../ReactRender';

import { useEffect, useState } from 'react';

import { Radio, Row, Typography } from 'antd';

import {
  basic,
  state,
  anonymousFunction,
} from '../../../../demo-schema/react/basic';
import { AnyType, parseObj, SchemaRootObj } from '@peeto/core';
import { getSetStateName } from '../../../core/src/event';

const funcName = '_getPeetoValue';
const getValueStr = (v: AnyType): AnyType => {
  return (
    v?.[funcName]?.() ||
    ([
      '[object String]',
      // '[object Number]',
      // '[object Boolean]',
      // '[object Undefined]',
      null,
    ].includes(Object.prototype.toString.call(v))
      ? `"${v}"`
      : v)
  );
};
const getChildStr = (v: AnyType): AnyType => {
  return Array.isArray(v) ? v.map((i) => getValueStr(i)).join('\n') : v;
};

const toReactStr = (str: string) => {
  const {
    states = [],
    compTree = [],
    compTreePaths = [],
  } = JSON.parse(str || '{}') as SchemaRootObj;

  const libList: { [key: string]: Set<string> } = {};

  const treeObj = parseObj({
    node: compTree,
    nodePath: compTreePaths || [],
    parseStateNode: ({ curSchema }) => {
      return {
        [funcName]: () => curSchema.stateName,
      };
    },
    parseAnonymousFunctionNode: ({ curSchema }) => {
      return {
        [funcName]: () => `(${(curSchema.params || []).join(',')})=>{
        ${curSchema.body}
      }`,
      };
    },
    parseSchemaComp: ({ curSchema, props }) => {
      const { packageName: pName, componentName } = curSchema;
      const cName = componentName.split('.')[0];

      if (!libList[pName]) {
        libList[pName] = new Set();
      }
      libList[pName].add(cName);

      const { children, ...newProps } = props || {};

      return {
        [funcName]: () => `<${componentName}\n${Object.keys(newProps)
          .map((k) => `${k}={${getValueStr(newProps[k])}}`)
          .join('\n')}${
          !children
            ? ` />`
            : `
>
${getChildStr(children)}
</${curSchema.componentName}>`
        }

      `,
      };
    },
  });

  const libStr = Object.keys(libList)
    .map((k) => `import { ${Array.from(libList[k]).join(',')} } from '${k}';`)
    .join('\n');

  const treeStr = getChildStr(treeObj);

  const stateStr = states
    ?.map(
      (s) =>
        `const [${s.name},${getSetStateName({
          stateName: s.name,
        })}] = useState(${JSON.stringify(s.initialValue)});`
    )
    .join('\n');

  return `import { useState, useEffect } from "react";
${libStr}

const Index = () => {
  // 引入依赖包

  // 状态
  ${stateStr}

  // ref

  // 事件

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
      <Typography.Title level={2}>出码</Typography.Title>
      <pre>{str && toReactStr(str)}</pre>
    </div>
  );
}

export default App;
