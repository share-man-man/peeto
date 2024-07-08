import { SchemaRefItem } from '../ref/type';
import { SchemaStateItem } from '../state/type';

export interface SchemaEventItem {
  /**
   * 事件名
   */
  name: string;
  /**
   * 事件方法体
   */
  value: string;
  /**
   * 执行事件会影响的状态
   */
  effectStates: SchemaStateItem['name'][];
  /**
   * 执行函数会调用的ref
   */
  effectRefs: SchemaRefItem['name'][];
}
