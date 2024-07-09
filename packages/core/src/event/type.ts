import { SchemaRefItem } from '../ref/type';
import { NodeType } from '../root';
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

export interface AnonymousFunctionNode {
  type: NodeType.ANONYMOUSFUNCTION;
  /**
   * 函数参数
   */
  params?: string[];
  /**
   * 函数方法体
   */
  body: string;
  /**
   * 影响的状态，使得在方法体内部可修改状态，也方便追踪哪那些函数修改了状态
   */
  effects?: string[];
}
