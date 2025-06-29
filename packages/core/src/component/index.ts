import { NodeType } from '../schema';
import { AnyType, JSONValue } from '../type';
import { BasicNodeType } from './type';
// import { SchemaCompTreeItem } from './type';

/**
 * 组件节点类型
 */
export class SchemaCompTreeItem {
  type = NodeType.COMPONENT;
  id: string = '';
  /**
   * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
   */
  componentName: string = '';
  /**
   * 组件参数
   */
  props?: Record<string, JSONValue> | undefined;
  /**
   * 插槽，vue用的较多
   */
  slots?: Record<string, JSONValue> | undefined;
  constructor(p: Omit<SchemaCompTreeItem, 'type'>) {
    Object.assign(this, p);
  }
}

/**
 * 是否为基础节点
 * @param obj
 * @returns
 */
export const isBasicNode = (obj: AnyType): obj is BasicNodeType => {
  return [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Undefined]',
    '[object Null]',
  ].includes(Object.prototype.toString.call(obj));
};

/**
 * 是否是组件节点
 * @param obj
 * @returns
 */
export const isSchemaCompTree = (obj: AnyType): obj is SchemaCompTreeItem => {
  return obj?.type === NodeType.COMPONENT;
};
