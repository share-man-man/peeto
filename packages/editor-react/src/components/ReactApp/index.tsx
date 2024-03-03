import type { AnyType, JSONValue } from '@peeto/parse';
import { SchemaCompTree, deepRecursionCompTree } from '@peeto/parse';
import { ReactRender } from '@peeto/render-react';

import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { deepRecursionFiberNode } from './utils/fiber';
import type { FiberNode } from './utils/fiber';
import WrapComp, { getWrapCompKey } from './components/WrapComp';

import {
  SIMILATOR_MAP_EVENT_KEY,
  SIMILATOR_SCHEMA_KEY,
} from '../EditorWorkbench/util';

const App = () => {
  const [schemaStr, setSchemaStr] = useState<string>();
  const renderContainerRef = useRef<HTMLDivElement>(null);
  const renderNodeRef = useRef<ReactNode | ReactNode[] | null>(null);
  const domMapRef = useRef<Map<SchemaCompTree['id'], HTMLElement[]>>(new Map());

  // 获取schema
  useLayoutEffect(() => {
    const similatorDom =
      renderContainerRef.current?.parentElement?.parentElement;
    const onSimilatorChange = () => {
      const domStr = similatorDom?.getAttribute(SIMILATOR_SCHEMA_KEY);
      setSchemaStr(domStr || undefined);
    };
    onSimilatorChange();
    const observer = new MutationObserver(onSimilatorChange);

    if (similatorDom) {
      observer.observe(similatorDom, {
        childList: false,
        attributes: true,
        subtree: false,
      });
    }

    return () => observer.disconnect();
  }, []);

  // 真实 dom 修改后，通过虚拟 dom 创建映射关系
  useLayoutEffect(() => {
    if (!schemaStr) {
      return;
    }

    const observer = new MutationObserver(() => {
      // TODO 可增加节流
      // 获取组件包含的dom（不包含子组件的dom）
      const node = renderNodeRef.current;
      domMapRef.current.clear();
      const rootFiberNode = (
        (Array.isArray(node) ? node?.[0] : node) as AnyType
      )?._owner as FiberNode;
      const schemaObj = JSON.parse(schemaStr) as JSONValue;
      deepRecursionCompTree({
        obj: schemaObj,
        compCallback: (obj) => {
          domMapRef.current.set(obj.id, []);
        },
      });
      deepRecursionFiberNode({
        fiberNode: rootFiberNode,
        callBack: (n) => {
          if (n?.stateNode instanceof HTMLElement) {
            let curNode: FiberNode | undefined = n;
            while (curNode && !domMapRef.current.has(curNode.key || '')) {
              curNode = curNode?.return;
            }
            if (!curNode) {
              throw new Error('找不到对应的fiberNode');
            } else {
              domMapRef.current
                .get(curNode.key as SchemaCompTree['id'])
                ?.push(n.stateNode);
            }
          }
        },
      });

      // 上抛映射关系
      renderContainerRef.current?.parentElement?.parentElement?.dispatchEvent(
        new CustomEvent(SIMILATOR_MAP_EVENT_KEY, {
          detail: new Map(domMapRef.current),
        })
      );
    });

    if (renderContainerRef.current) {
      observer.observe(renderContainerRef.current, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, [schemaStr]);

  return (
    <div ref={renderContainerRef}>
      {schemaStr && (
        <ReactRender
          onNodeChange={(node) => {
            // 存储虚拟dom
            renderNodeRef.current = node;
          }}
          loadingRender={() => {
            return <div>react-loading</div>;
          }}
          onCreateNode={(Comp, props, children) => {
            return (
              <WrapComp // TODO 包装一层组件后，input光标会跳出来，@antd4的collapse获取不到collapse.item
                {...{
                  ...props,
                  key: getWrapCompKey(),
                }}
              >
                <Comp {...props}>{children}</Comp>
              </WrapComp>
            );
          }}
          schemaStr={schemaStr}
          packageList={
            // TODO 从外部获取
            [
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
            ]
          }
          noMatchPackageRender={({ id: componentId, packageName }) => (
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
          )}
          noMatchCompRender={({
            id: componentId,
            componentName,
            packageName,
          }) => (
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
          )}
        />
      )}
    </div>
  );
};

export default App;
