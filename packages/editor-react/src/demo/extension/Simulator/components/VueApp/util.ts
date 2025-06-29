import { VNode, isVNode } from 'vue';
import { SimulatorExtensionCompDomMap } from '../../type';
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
}: // schemaStr,
{
  node: VNode | VNode[] | null;
  schemaStr: string;
}): SimulatorExtensionCompDomMap => {
  const map: SimulatorExtensionCompDomMap = new Map();
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
}: {
  normalVNode: VNode;
  map: SimulatorExtensionCompDomMap;
  parentKey?: string;
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
    if (
      el instanceof HTMLElement &&
      curParentKey &&
      !map.get(curParentKey)?.some((d) => d === el)
    ) {
      map.get(curParentKey)?.push(el);
    } // else if (el?.nodeType === 3) {
    // 暂不处理文本节点
    // }

    // 继续遍历子节点
    // TODO 未处理suspense节点
    if (node.component) {
      const subTree = node.component.subTree;
      capture({ normalVNode: subTree, map, parentKey: curParentKey });
    } else if (Array.isArray(node.children)) {
      node.children.forEach((n) => {
        capture({ normalVNode: n as VNode, map, parentKey: curParentKey });
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
