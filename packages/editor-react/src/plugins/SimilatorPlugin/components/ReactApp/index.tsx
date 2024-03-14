import type { AnyType, JSONValue } from '@peeto/parse';
import { deepRecursionCompTree } from '@peeto/parse';
import { ReactRender } from '@peeto/render-react';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { FiberNode, ReactAppProps } from './type';

// import {
//   SIMILATOR_MAP_EVENT_KEY,
//   SIMILATOR_DISPATCH_EVENT_KEY,
//   SIMILATOR_REQUEST_EVENT_KEY,
// } from '../EditorWorkbench/util';
import {
  SimilatorPluginCompDomMap,
  // EditorSimilatorDispatchProps,
  SimilatorPluginConfig,
} from '../../type';

// /**
//  * 获取模拟器容器dom
//  * @param dom
//  * @returns
//  */
// const getSimilatorContainerDom = (dom: HTMLDivElement | null) =>
//   dom?.parentElement?.parentElement;

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

/**
 * 返回映射关系
 * @param param0
 * @returns
 */
const getCompDomMap = ({
  node,
  schemaStr,
  peetoPrivateKey,
}: {
  node: ReactNode | ReactNode[] | null;
  schemaStr: string;
  peetoPrivateKey: string;
}): SimilatorPluginCompDomMap => {
  const map: SimilatorPluginCompDomMap = new Map();
  const schemaObj = JSON.parse(schemaStr) as JSONValue;
  // 初始化map
  deepRecursionCompTree({
    obj: schemaObj,
    compCallback: (obj) => {
      map.set(obj.id, []);
    },
  });
  // 遍历fiber节点，
  const rootFiberNode = ((Array.isArray(node) ? node?.[0] : node) as AnyType)
    ?._owner as FiberNode;
  deepRecursionFiberNode({
    fiberNode: rootFiberNode,
    callBack: (n) => {
      if (n?.stateNode instanceof HTMLElement) {
        let curNode: FiberNode | undefined = n;
        let privateKey = curNode?.pendingProps?.[peetoPrivateKey];
        while (curNode && !map.has(privateKey || '')) {
          curNode = curNode?.return;
          privateKey = curNode?.pendingProps?.[peetoPrivateKey];
        }
        if (!curNode) {
          throw new Error('找不到对应的fiberNode');
        } else {
          map.get(privateKey)?.push(n.stateNode);
        }
      }
    },
  });
  return map;
};

const App = ({ subConfig, onMapChange }: ReactAppProps) => {
  const [delay, setDelay] = useState<SimilatorPluginConfig['delay']>();
  const [schemaStr, setSchemaStr] =
    useState<SimilatorPluginConfig['schemaStr']>();
  const [packageList, setPackageList] =
    useState<SimilatorPluginConfig['packageList']>();
  const renderContainerRef = useRef<HTMLDivElement>(null);
  const peetoPrivateKey = useMemo(() => `__peeto_${new Date().getTime()}`, []);
  const subConfigRef = useRef(subConfig);
  subConfigRef.current = subConfig;
  useEffect(() => {
    subConfigRef.current((config: SimilatorPluginConfig) => {
      setSchemaStr(config.schemaStr);
      setPackageList(config.packageList);
      setDelay(config.delay);
    });
  }, []);

  const onMapChangeRef = useRef(onMapChange);
  onMapChangeRef.current = onMapChange;
  const renderNodeRef = useRef<ReactNode | ReactNode[] | null>(null);
  // 上抛映射关系
  const dispatch = useCallback(() => {
    // 获取组件包含的dom（不包含子组件的dom）
    const node = renderNodeRef.current;
    if (!schemaStr || !packageList) {
      return new Map();
    }
    const map = getCompDomMap({
      node,
      schemaStr,
      peetoPrivateKey,
    });
    onMapChangeRef.current?.(map);
  }, [packageList, peetoPrivateKey, schemaStr]);

  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  // 监听dom变化：创建映射关系
  const timeOutRunRef = useRef<NodeJS.Timeout | null>(null);
  const delayRef = useRef(delay);
  delayRef.current = delay;
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (timeOutRunRef.current) {
        clearTimeout(timeOutRunRef.current);
        timeOutRunRef.current = null;
      }
      timeOutRunRef.current = setTimeout(dispatchRef.current, delayRef.current);
    });

    // TODO 监测不到renderContainer以外的的dom，比如@antd.Modal
    // dom可能频繁改变，导致会回调多次
    if (renderContainerRef.current) {
      observer.observe(renderContainerRef.current, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    return () => {
      observer?.disconnect();
      if (timeOutRunRef.current) {
        clearTimeout(timeOutRunRef.current);
        timeOutRunRef.current = null;
      }
    };
  }, []);

  // // 循环计时，创建映射关系F
  // TODO 循环执行函数，影响系统流畅性
  // const intervalRunRef = useRef<NodeJS.Timeout | null>(null);
  // useEffect(() => {
  //   if (intervalRunRef.current) {
  //     clearInterval(intervalRunRef.current);
  //     intervalRunRef.current = null;
  //   }
  //   intervalRunRef.current = setInterval(dispatch, delay);
  //   return () => {
  //     if (intervalRunRef.current) {
  //       clearInterval(intervalRunRef.current);
  //       intervalRunRef.current = null;
  //     }
  //   };
  // }, [delay, dispatch]);

  return (
    <div ref={renderContainerRef}>
      {schemaStr && packageList && (
        <ReactRender
          schemaStr={schemaStr}
          packageList={packageList}
          onNodeChange={(node) => {
            // 存储虚拟dom
            renderNodeRef.current = node;
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
          loadingRender={() => {
            return <div>react-loading</div>;
          }}
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
