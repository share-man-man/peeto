import ReactRender from '../ReactRender';

import { useEffect, useState } from 'react';

import { Button, message, Radio, Row, Typography } from 'antd';

import {
  basic,
  state,
  anonymousFunction,
  table,
} from '../../../../demo-schema/react/basic';
import { AnyType, NodeType, parseObj, SchemaRootObj } from '@peeto/core';
import { getSetStateFuncName } from '../../../core/src/event';
import SourceCode from './SourceCode';

const funcName = '_getPeetoValue';
const getPropStr = (v: AnyType): AnyType => {
  if (!v?.[funcName]) {
    return [
      '[object String]',
      // '[object Number]',
      // '[object Boolean]',
      // '[object Undefined]',
      null,
    ].includes(Object.prototype.toString.call(v))
      ? `"${v}"`
      : `{${v}}`;
  }
  if (
    [
      NodeType.REF,
      NodeType.STATE,
      NodeType.ANONYMOUSFUNCTION,
      NodeType.EVENT,
    ].includes(v.type)
  ) {
    return `{${v?.[funcName]?.()}}`;
  }
  return v?.[funcName]?.();
};
const getChildStr = (v: AnyType): AnyType => {
  if (Array.isArray(v)) {
    return v.map((i) => getChildStr(i)).join('\n');
  }

  if (!v?.[funcName]) {
    return [
      '[object String]',
      // '[object Number]',
      // '[object Boolean]',
      // '[object Undefined]',
      null,
    ].includes(Object.prototype.toString.call(v))
      ? `${v}`
      : `{${v}}`;
  }
  if (
    [
      NodeType.REF,
      NodeType.STATE,
      NodeType.ANONYMOUSFUNCTION,
      NodeType.EVENT,
    ].includes(v.type)
  ) {
    return `{${v?.[funcName]?.()}}`;
  }
  return v?.[funcName]?.();
};

const toReactStr = (str: string) => {
  const {
    states = [],
    compTree = [],
    compTreePaths = [],
    effects = [],
  } = JSON.parse(str || '{}') as SchemaRootObj;

  const libList: { [key: string]: Set<string> } = {};

  const treeObj = parseObj({
    node: compTree,
    nodePath: compTreePaths || [],
    parseStateNode: ({ curSchema }) => {
      return {
        type: NodeType.STATE,
        [funcName]: () => curSchema.stateName,
      };
    },
    parseAnonymousFunctionNode: ({ curSchema }) => {
      return {
        type: NodeType.ANONYMOUSFUNCTION,
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
        type: NodeType.COMPONENT,
        [funcName]: () => `<${componentName}\n${Object.keys(newProps)
          .map((k) => `${k}=${getPropStr(newProps[k])}`)
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
        `const [${s.name},${getSetStateFuncName({
          stateName: s.name,
        })}] = useState(${JSON.stringify(s.initialValue)});`
    )
    .join('\n');

  const effectsStr = effects
    .map(
      ({ dependences, body }) => `useEffect(()=>{
    ${body}
    },[${dependences.join(',')}]);`
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
          size="small"
          onClick={() => {
            navigator.clipboard.writeText(toReactStr(str));
            message.success('复制成功，请粘贴到SourceCode.tsx');
          }}
        >
          复制
        </Button>
      </Typography.Title>
      <pre>{str && toReactStr(str)}</pre>
      <Typography.Title level={2}>出码渲染验证</Typography.Title>
      <SourceCode />
    </div>
  );
}

export default App;
