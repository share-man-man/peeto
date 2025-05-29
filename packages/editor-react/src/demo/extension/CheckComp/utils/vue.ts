import { VNode, isVNode } from 'vue';
import { CompDomMap } from '../type';
import { AnyType } from '@peeto/core';

// import {
//   JSONValue,
//   deepRecursionCompTree,
//   getSchemaObjFromStr,
// } from '@peeto/core';

/**
 * 返回vnode和组件的映射关系
 */
export const getCompDomMap = ({
  node,
  peetoPrivateKey,
}: {
  node: VNode | VNode[] | null;
  peetoPrivateKey: string;
}): CompDomMap => {
  const map: CompDomMap = new Map();
  // TODO 删除了deepRecursionCompTree方法，后面再看有没有其它办法遍历
  // const schemaObj = getSchemaObjFromStr(schemaStr);
  // // 初始化map
  // deepRecursionCompTree({
  //   obj: schemaObj as unknown as JSONValue,
  //   compCallback: (obj) => {
  //     map.set(obj.id, []);
  //   },
  // });

  (Array.isArray(node) ? node : [node]).forEach((n) => {
    if (n) {
      capture({
        normalVNode: n,
        map,
        peetoPrivateKey,
      });
    }
  });

  return map;
};

/**
 * 参考代码：vue-devtools里的packages/app-backend-vue3/src/components/tree.ts -> capture
 * @param param0
 * @returns
 */
export const capture = async ({
  normalVNode,
  map,
  parentKey,
  peetoPrivateKey,
}: {
  normalVNode: VNode;
  map: CompDomMap;
  parentKey?: string;
  peetoPrivateKey: string;
}) => {
  if (!normalVNode) {
    return null;
  }
  let curParentKey = parentKey;

  if (isVNode(normalVNode)) {
    const node = normalVNode as VNode;
    const nodeKye = node.key as typeof parentKey;

    // 如果在map中，则获取el
    if (nodeKye && map.has(nodeKye as string)) {
      // console.log(normalVNode, normalVNode.el);
      curParentKey = nodeKye;
      // el是否为htmlelement。nodeType===3
    }

    const el = node.el;
    if (el instanceof HTMLElement && (node as AnyType)?.[peetoPrivateKey]) {
      const privateKey = node.key as string;
      if (!map.get(privateKey)) {
        map.set(privateKey, []);
      }
      if (!map.get(privateKey)?.some((v) => v === el)) {
        map.get(privateKey)?.push(el);
      }
    }

    // 继续遍历子节点
    // TODO 未处理suspense节点
    if (node.component) {
      const subTree = node.component.subTree;
      capture({
        normalVNode: subTree,
        map,
        parentKey: curParentKey,
        peetoPrivateKey,
      });
    } else if (Array.isArray(node.children)) {
      node.children.forEach((n) => {
        capture({
          normalVNode: n as VNode,
          map,
          parentKey: curParentKey,
          peetoPrivateKey,
        });
      });
    } else {
      // string类型的节点
      // console.log('VNode===', node.children);
    }
  } else if (
    // 判断是否为string、number
    typeof normalVNode === 'string' ||
    typeof normalVNode === 'number'
  ) {
    // TODO 需要看vue官方如何处理
  } else {
    console.error(normalVNode);
    throw new Error('非VNode节点');
  }
};
