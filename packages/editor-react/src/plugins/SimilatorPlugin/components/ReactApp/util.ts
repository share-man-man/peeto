import { ReactNode } from 'react';
import { FiberNode } from './type';
import { SimilatorPluginCompDomMap } from '../../type';
import { AnyType, JSONValue, deepRecursionCompTree } from '@peeto/parse';

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
 * 返回fiber和组件的映射关系
 * @param param0
 * @returns
 */
export const getCompDomMap = ({
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

  // 遍历fiber节点，_owner为根fiber节点
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
