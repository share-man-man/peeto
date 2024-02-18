import type { JSExpressionType, JSONValue } from '../type';

export interface StateJSExpressionType extends JSExpressionType {
  packages: string[];
}

/**
 * 状态数组
 */
export interface SchemaStateItem {
  /**
   * 状态名
   */
  name: string;
  /**
   * 状态外显名称
   */
  desc?: string;
  /**
   * 初始值
   */
  initialValue?: StateJSExpressionType | JSONValue;
}
