// import { SchemaRefItem } from '../ref/type';
import { SchemaStateItem } from '../state/type';

export interface SchemaEffectItem {
  /**
   * 依赖的状态
   */
  dependences: SchemaStateItem['name'][];
  /**
   * 执行的函数
   */
  body: string;
  /**
   * 执行事件会影响的状态
   */
  effectStates: SchemaStateItem['name'][];
  //   /**
  //    * 执行函数会调用的ref
  //    */
  //   effectRefs: SchemaRefItem['name'][];
}
