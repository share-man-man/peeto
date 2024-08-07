import { v4 as id } from 'uuid';

import {
  AnonymousFunctionNode,
  AnyType,
  HookNodeType,
  SchemaRootObj,
  StateNodeType,
} from '../packages/core/src';
import {
  isBasicNode,
  SchemaCompTreeItem,
} from '../packages/core/src/component';
import { RefNodeType } from '../packages/core/src/ref';
import { JSONObject } from 'packages/core/src/type';
export class CustomCompNode extends SchemaCompTreeItem {
  constructor(componentName: string, props: Record<string, AnyType> = {}) {
    const selfId = id();
    super({
      componentName,
      id: selfId,
      props,
    });
  }
}

export const createSchemaConfig = ({
  desc,
  schema,
}: {
  desc: string;
  schema: Omit<SchemaRootObj, 'compTree' | 'schemaNodePaths'> & {
    compTree: AnyType;
  };
}): { desc: string; schema: SchemaRootObj } => {
  const schemaNodePaths: SchemaRootObj['schemaNodePaths'] = [];
  const deep = ({
    cur,
    path = [],
  }: {
    cur: AnyType;
    path: AnyType[];
  }): AnyType => {
    if (
      cur &&
      [
        CustomCompNode.prototype,
        AnonymousFunctionNode.prototype,
        StateNodeType.prototype,
        RefNodeType.prototype,
        HookNodeType.prototype,
      ].includes(Object.getPrototypeOf(cur))
    ) {
      schemaNodePaths.push(path);
      const res = cur as JSONObject;
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

  const compTree = deep({ cur: schema.compTree, path: [] });

  return {
    desc,
    schema: {
      ...schema,
      schemaNodePaths,
      compTree,
    },
  };
};
