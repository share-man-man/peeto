import { SchemaCompTreeItem, SchemaCompTreePath } from '../component/type';
import { SchemaEventItem } from '../event/type';
import { SchemaStateItem } from '../state/type';
import { SchemaRefItem } from '../ref/type';

/**
 * schema根对象
 */
export interface SchemaRootObj {
  /**
   * 状态集合
   */
  states?: SchemaStateItem[];
  /**
   * 事件集合
   */
  events?: SchemaEventItem[];
  /**
   * ref集合
   */
  refs?: SchemaRefItem[];
  /**
   * 组件树
   */
  compTree?: SchemaCompTreeItem[];
  /**
   * 需要特殊处理的节点路径
   */
  compTreePaths?: SchemaCompTreePath[];
  // /**
  //  * 组件-lib包映射
  //  * 一对多
  //  */
  // compTreeLibMap?: CompTreeLibMapItem[];
  // /**
  //  * 状态-组件树映射
  //  * 一对多
  //  */
  // stateCompTreeeMap?: {
  //   stateName: SchemaStateItem['name'];
  //   paths: SchemaCompTreePath[];
  // }[];
  // /**
  //  * 事件-组件树映射
  //  * 一对多
  //  */
  // eventCompTreeeMap?: {
  //   eventName: SchemaEventItem['name'];
  //   paths: SchemaCompTreePath[];
  // }[];
  // /**
  //  * 匿名函数路径
  //  */
  // anonymousFunctionList: {
  //   path: SchemaCompTreePath;
  // }[];
  // /**
  //  * 引用-组件树映射
  //  * 一对一
  //  */
  // refCompTreeeMap?: {
  //   refName: SchemaRefItem['name'];
  //   paths: SchemaCompTreePath[];
  // }[];
  // /**
  //  * 状态-事件映射
  //  * 多对一
  //  */
  // stateEventMap?: {
  //   /**
  //    * 监听状态变更
  //    */
  //   dependences: SchemaStateItem['name'][];
  //   /**
  //    * 状态改变后的执行函数
  //    */
  //   eventName: SchemaEventItem['name'];
  //   /**
  //    * 描述
  //    */
  //   desc?: string;
  // }[];
}
