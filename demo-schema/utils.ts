import { v4 as id } from 'uuid';

import {
  AnonymousFunctionNode,
  AnyType,
  FuncTypeEnum,
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

export const createComp = (
  componentName: string,
  props: Record<string, AnyType> = {},
  {
    slots,
  }: {
    slots?: Record<string, AnyType>;
  } = {}
) => {
  const selfId = id();
  return new SchemaCompTreeItem({
    componentName,
    id: selfId,
    props,
    slots,
  });
};

export const createState = (
  ...p: ConstructorParameters<typeof StateNodeType>
) => {
  return new StateNodeType(...p) as unknown as JSONObject;
};

export const createHook = (
  ...p: ConstructorParameters<typeof HookNodeType>
) => {
  return new HookNodeType(...p) as unknown as JSONObject;
};

export const creatAnonymousFunc = (
  ...p: ConstructorParameters<typeof AnonymousFunctionNode>
) => {
  return new AnonymousFunctionNode(...p) as unknown as JSONObject;
};

export const createSlot = ({ compTree }: { compTree: AnyType[] }) => {
  return new AnonymousFunctionNode({
    funcType: FuncTypeEnum.RENDERFUNC,
    [FuncTypeEnum.RENDERFUNC]: {
      compTree: compTree as AnyType,
    },
  });
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
    // 是否是自定义节点的原型
    if (
      cur &&
      [
        SchemaCompTreeItem.prototype,
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
    // 遍历对象
    if (cur instanceof Object) {
      return Object.fromEntries(
        Object.keys(cur).map((k) => [
          k,
          deep({ cur: cur[k], path: [...path, k] }),
        ])
      );
    }
    return cur;
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
