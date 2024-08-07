import { NodeType } from '../root';
import type { JSONObject, JSONValue } from '../type';

/**
 * schema路径
 */
export type SchemaCompTreePath = (string | number)[];

/**
 * 组件节点类型
 */
export interface SchemaCompTreeItem extends JSONObject {
  type: NodeType.COMPONENT;
  id: string;
  /**
   * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
   */
  componentName: string;
  /**
   * 组件参数
   */
  props?: Record<string, JSONValue> | undefined;
}
