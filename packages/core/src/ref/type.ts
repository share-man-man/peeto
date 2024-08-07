import { AnyType, JSONValue } from '../type';

export interface SchemaRefItem {
  /**
   * ref名
   */
  name: string;
  /**
   * 描述
   */
  desc?: string;
  /**
   * 初始值
   */
  initialValue?: JSONValue;
}

export interface RefGetSetType {
  getRef: (p: { refName: SchemaRefItem['name'] }) => AnyType;
}
