import type { AnyType, JSONValue } from '@peeto/parse';
import { SchemaCompTree, deepRecursionCompTree } from '@peeto/parse';
import { ReactRender } from '@peeto/render-react';
import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { FiberNode } from './type';

import {
  SIMILATOR_MAP_EVENT_KEY,
  SIMILATOR_CONFIG_SET_EVENT_KEY,
  SIMILATOR_REQUEST_EVENT_KEY,
} from '../EditorWorkbench/util';
import { WorkBenchProps } from '../EditorWorkbench/type';

/**
 * 获取模拟器容器dom
 * @param dom
 * @returns
 */
const getSimilatorContainerDom = (dom: HTMLDivElement | null) =>
  dom?.parentElement?.parentElement;

/**
 * 遍历fiber树
 * @param param0
 * @returns
 */
export const deepRecursionFiberNode = ({
  fiberNode,
  callBack,
}: {
  fiberNode?: FiberNode;
  callBack: (n: FiberNode) => void;
}): undefined => {
  if (!fiberNode) {
    return;
  }
  callBack(fiberNode);
  deepRecursionFiberNode({
    fiberNode: fiberNode?.child,
    callBack,
  });

  deepRecursionFiberNode({
    fiberNode: fiberNode?.sibling,
    callBack,
  });
};

const App = () => {
  const [delay, setDelay] = useState<WorkBenchProps['delay']>();
  const [schemaStr, setSchemaStr] = useState<WorkBenchProps['schemaStr']>();
  const [packageList, setPackageList] =
    useState<WorkBenchProps['packageList']>();
  const renderContainerRef = useRef<HTMLDivElement>(null);
  const renderNodeRef = useRef<ReactNode | ReactNode[] | null>(null);
  const domMapRef = useRef<Map<SchemaCompTree['id'], HTMLElement[]>>(new Map());

  const peetoPrivateKey = useMemo(() => `__peeto_${new Date().getTime()}`, []);

  // 获取初始化配置
  useLayoutEffect(() => {
    const similatorContainerDom = getSimilatorContainerDom(
      renderContainerRef.current
    );
    similatorContainerDom?.dispatchEvent(
      new CustomEvent(SIMILATOR_REQUEST_EVENT_KEY, {
        detail: {
          getConfig: (config: WorkBenchProps) => {
            setSchemaStr(config.schemaStr);
            setPackageList(config.packageList);
            setDelay(config.delay);
          },
        },
      })
    );
  }, []);

  // 监听配置修改
  useLayoutEffect(() => {
    const similatorContainerDom = getSimilatorContainerDom(
      renderContainerRef.current
    );
    similatorContainerDom?.addEventListener(
      SIMILATOR_CONFIG_SET_EVENT_KEY,
      (e) => {
        const config = (e as CustomEvent).detail as WorkBenchProps;
        setSchemaStr(config.schemaStr);
        setPackageList(config.packageList);
      }
    );
  }, []);

  // 监听dom变化：真实 dom 修改后，通过虚拟 dom 创建映射关系
  useLayoutEffect(() => {
    if (!schemaStr || !packageList) {
      return;
    }

    const run = () => {
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
            let privateKey = curNode?.pendingProps?.[peetoPrivateKey];
            while (curNode && !domMapRef.current.has(privateKey || '')) {
              curNode = curNode?.return;
              privateKey = curNode?.pendingProps?.[peetoPrivateKey];
            }
            if (!curNode) {
              throw new Error('找不到对应的fiberNode');
            } else {
              domMapRef.current.get(privateKey)?.push(n.stateNode);
            }
          }
        },
      });

      // 触发回调，传入映射关系
      const similatorContainerDom = getSimilatorContainerDom(
        renderContainerRef.current
      );
      similatorContainerDom?.dispatchEvent(
        new CustomEvent(SIMILATOR_MAP_EVENT_KEY, {
          detail: new Map(domMapRef.current),
        })
      );
    };
    let runTimeout: NodeJS.Timeout | null;
    const observer = new MutationObserver(() => {
      if (runTimeout) {
        clearTimeout(runTimeout);
        runTimeout = null;
      }
      runTimeout = setTimeout(run, delay);
    });

    // TODO 监测不到renderContainer以外的的dom，比如@antd.Modal
    if (renderContainerRef.current) {
      observer.observe(renderContainerRef.current, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
      if (runTimeout) {
        clearTimeout(runTimeout);
      }
    };
  }, [delay, packageList, peetoPrivateKey, schemaStr]);

  return (
    <div ref={renderContainerRef}>
      {schemaStr && packageList && (
        <ReactRender
          onNodeChange={(node) => {
            // 存储虚拟dom
            renderNodeRef.current = node;
          }}
          loadingRender={() => {
            return <div>react-loading</div>;
          }}
          onCreateNode={(Comp, p, children) => {
            const res = (
              <Comp
                {...{
                  ...p,
                  // 传入私有参数原因：@antd.Button会重新定义子组件的key，导致无法在fiber节点通过key获取组件配置
                  [peetoPrivateKey]: p?.key,
                }}
              >
                {children}
              </Comp>
            );

            return res;
          }}
          schemaStr={schemaStr}
          packageList={packageList}
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
