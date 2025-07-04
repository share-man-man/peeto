import {
  AnyType,
  getLibModuleByName,
  isSchemaCompTree,
  SchemaCompTreeItem,
  SchemaCompTreePath,
  SchemaRootObj,
} from '@peeto/core';
import { set } from 'lodash-es';

export type PropFormCompPropType = {
  schemaRootObj: SchemaRootObj;
  curSchema: SchemaCompTreeItem;
  path: SchemaCompTreePath;
  onSchemaChange: (p: string) => void;
} & ReturnType<typeof getLibModuleByName>;

export const findNodeInSchemaPathsById = ({
  id,
  schemaObj,
}: {
  schemaObj: SchemaRootObj;
  id: SchemaCompTreeItem['id'];
}): { path: SchemaCompTreePath; schema: SchemaCompTreeItem } | null => {
  // 用于递归访问路径
  function getByPath(obj: AnyType, path: (string | number)[]): AnyType {
    return path.reduce(
      (acc, key) => (acc && acc[key] != null ? acc[key] : undefined),
      obj
    );
  }

  // 遍历所有路径，查找匹配的 id
  for (const path of schemaObj.schemaNodePaths || []) {
    const node = getByPath(schemaObj.compTree || [], path);
    if (node && isSchemaCompTree(node) && node.id === id) {
      return { path, schema: node };
    }
  }
  return null;
};

export const setValueByPath = (
  path: SchemaCompTreePath,
  value: AnyType,
  schemaCompTree: SchemaCompTreeItem[]
) => {
  // TODO 判断参数路径是否在schemaObj.schemaNodePaths中，再判断节点类型。再判断是否为普通节点类型
  // 在schemaObj.schemaNodePaths路径中的节点修改，还要修改schemaObj.schemaNodePaths的值
  set(schemaCompTree, path, value);
};
