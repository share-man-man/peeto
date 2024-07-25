import { v4 as id } from 'uuid';

import { AnyType, NodeType, SchemaRootObj } from '../packages/core/src';
import { isBasicNode } from '../packages/core/src/component';
import { AnonymousFunctionNode } from '../packages/core/src/event/type';
import { StateNodeType } from 'packages/core/src/state/type';

class SchemaNode {
  schema: Record<string, AnyType> = {};
  constructor(s: SchemaNode['schema']) {
    this.schema = s;
  }
  getSchema() {
    return this.schema;
  }
}

export const createCompNode = (
  packageName: string,
  componentName: string,
  props: Record<string, AnyType> = {}
) => {
  const selfId = id();
  return new SchemaNode({
    type: NodeType.COMPONENT,
    packageName,
    componentName,
    id: selfId,
    props,
  }) as unknown as AnyType;
};

export const createAnonymousFunction = (
  p: Omit<AnonymousFunctionNode, 'type' | 'compTree'> & {
    compTree?: SchemaNode[];
  }
) => {
  return new SchemaNode({
    ...p,
    type: NodeType.ANONYMOUSFUNCTION,
  }) as unknown as AnyType;
};

export const createStateNode = (p: Omit<StateNodeType, 'type'>) => {
  return new SchemaNode({
    ...p,
    type: NodeType.STATE,
  }) as unknown as AnyType;
};

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
    // SchemaNode创建的对象，需要添加path
    if (cur && Object.getPrototypeOf(cur) === SchemaNode.prototype) {
      schemaNodePaths.push(path);
      const res = (cur as SchemaNode).getSchema();
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
