// import { NodeType } from '../root';
import type { /* JSExpressionType, */ AnyType, JSONValue } from '../type';

// export interface StateJSExpressionType extends JSExpressionType {
//   packages: string[];
// }

/**
 * 状态数组
 */
export interface SchemaStateItem {
  /**
   * 状态名
   */
  name: string;
  /**
   * 状态描述
   */
  desc?: string;
  /**
   * 初始值
   */
  initialValue?: /* StateJSExpressionType | */ JSONValue;
}

/**
 * 操作state
 */
export interface StateGetSetType {
  /**
   * 获取状态
   * @param P
   * @returns
   */
  getState: (P: { stateName: SchemaStateItem['name'] }) => AnyType;
  /**
   * 设置状态
   * @param fieldList 状态列表
   * @returns
   */
  setState: (p: { fieldList: { name: string; value: AnyType }[] }) => void;
}
