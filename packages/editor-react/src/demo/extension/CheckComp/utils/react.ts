import { ReactElement, ReactNode } from 'react';
import {
  AnyType,
  // JSONValue,
  // deepRecursionCompTree,
  // getSchemaObjFromStr,
} from '@peeto/core';
import { CompDomMap } from '../type';

export interface FiberNode {
  child?: FiberNode;
  key?: ReactElement['key'];
  return?: FiberNode;
  sibling?: FiberNode;
  stateNode?: AnyType;
  pendingProps?: AnyType;
}

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
  peetoPrivateKey,
}: {
  node: ReactNode | ReactNode[] | null;
  peetoPrivateKey: string;
}): CompDomMap => {
  const map: CompDomMap = new Map();
  // 遍历fiber节点，_owner为根fiber节点
  const rootFiberNode = (Array.isArray(node)
    ? node?.[0]
    : node) as AnyType as FiberNode;
  deepRecursionFiberNode({
    fiberNode: rootFiberNode,
    callBack: (n) => {
      let curNode: FiberNode | undefined = n;
      let privateKey = curNode?.pendingProps?.[peetoPrivateKey];
      // 找到了有dom的fiber节点，需要确定被最近的哪个schema节点包裹
      if (n?.stateNode instanceof HTMLElement) {
        // let curNode: FiberNode | undefined = n;
        // let privateKey = curNode?.pendingProps?.[peetoPrivateKey];
        // while (curNode && !map.has(privateKey || '')) {
        //   curNode = curNode?.return;
        //   privateKey = curNode?.pendingProps?.[peetoPrivateKey];
        // }
        // if (!curNode) {
        //   throw new Error('找不到对应的fiberNode');
        // } else {
        //   map.get(privateKey)?.push(n.stateNode);
        // }
        while (curNode && !privateKey) {
          curNode = curNode?.return;
          privateKey = curNode?.pendingProps?.[peetoPrivateKey];
        }
        if (curNode?.stateNode) {
          if (!map.get(privateKey)) {
            map.set(privateKey, []);
          }
          if (!map.get(privateKey)?.some((v) => v === curNode?.stateNode)) {
            map.get(privateKey)?.push(curNode.stateNode);
          }
        }
      }
    },
  });
  return map;
};
