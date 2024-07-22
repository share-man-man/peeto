import { SchemaCompTreeItem } from '../component/type';
import { SchemaEffectItem } from '../effect/type';
import { NodeType } from '../root';

export interface SchemaEventItem {
  /**
   * 事件名
   */
  name: string;
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
  body?: string;
  /**
   * 影响的状态，使得在方法体内部可修改状态，也方便追踪哪那些函数修改了状态
   */
  effectStates?: SchemaEffectItem['effectStates'];
  dependences?: SchemaEffectItem['dependences'];
  /**
   * 立即执行
   * https://developer.mozilla.org/en-US/docs/Glossary/IIFE
   */
  IIFE?: boolean;
  /**
   * 是否返回组件树
   */
  isCompTree?: boolean;
  /**
   * 渲染函数返回的组件树
   */
  compTree?: SchemaCompTreeItem | SchemaCompTreeItem[];
}
