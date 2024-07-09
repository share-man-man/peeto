import { v4 as id } from 'uuid';

import { AnyType, NodeType, SchemaRootObj } from '../packages/core/src';
import { isBasicNode } from '../packages/core/src/component';
import { AnonymousFunctionNode } from '../packages/core/src/event/type';
import { StateNodeType } from 'packages/core/src/state/type';

export const createCompNode = (
  packageName: string,
  componentName: string,
  props: Record<string, AnyType> = {},
  children: AnyType = null
): (() => AnyType) => {
  const selfId = id();
  return () => ({
    type: NodeType.COMPONENT,
    packageName,
    componentName,
    id: selfId,
    props,
    children,
  });
};

export const createAnonymousFunction = (
  p: Omit<AnonymousFunctionNode, 'type'>
) => {
  return () => ({
    ...p,
    type: NodeType.ANONYMOUSFUNCTION,
  });
};

export const createStateNode = (p: Omit<StateNodeType, 'type'>) => {
  return () => ({
    ...p,
    type: NodeType.STATE,
  });
};

export const createSchemaConfig = ({
  desc,
  schema,
}: {
  desc: string;
  schema: Omit<SchemaRootObj, 'compTree' | 'compTreePaths'> & {
    compTree: AnyType;
  };
}): { desc: string; schema: SchemaRootObj } => {
  const compTreePaths: SchemaRootObj['compTreePaths'] = [];
  const deep = ({
    cur,
    path = [],
  }: {
    cur: AnyType;
    path: AnyType[];
  }): AnyType => {
    if (cur instanceof Function) {
      compTreePaths.push(path);
      const res = cur() as Record<string, AnyType>;
      return Object.fromEntries(
        Object.keys(res).map((k) => {
          return [
            k,
            deep({
              cur: res[k],
              path: [...path, k],
            }),
          ];
        })
      );
    }
    // 基础节点，直接返回
    if (isBasicNode(cur)) {
      return cur;
    }
    // 遍历数组
    if (Array.isArray(cur)) {
      return cur.map((o, oIndex) => deep({ cur: o, path: [...path, oIndex] }));
    }
    // null、undefined等非对象类型类型
    if (!(cur instanceof Object)) {
      return cur;
    }
    // 遍历对象
    return Object.fromEntries(
      Object.keys(cur).map((k) => [
        k,
        deep({ cur: cur[k], path: [...path, k] }),
      ])
    );
  };
  return {
    desc,
    schema: {
      ...schema,
      compTreePaths,
      compTree: deep({ cur: schema.compTree, path: [] }),
    },
  };
};
