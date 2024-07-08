import { SchemaCompTreeItem, SchemaCompTreePath } from '../component/type';
import { SchemaEventItem } from '../event/type';
import { SchemaStateItem } from '../state/type';
import { SchemaRefItem } from '../ref/type';
// import { LibListItem } from '../lib/type';

export interface CompTreeLibMapItem {
  path: SchemaCompTreePath[];
  /**
   * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
   */
  componentName: string;
  /**
   * 组件所属包名
   */
  packageName: string;
}

export interface AnonymousFunction {
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
   * 引用集合
   */
  refs?: SchemaRefItem[];
  /**
   * 组件树
   */
  compTree?: SchemaCompTreeItem[];
  /**
   * 组件-lib包映射
   * 一对多
   */
  compTreeLibMap?: CompTreeLibMapItem[];
  /**
   * 状态-组件树映射
   * 一对多
   */
  stateCompTreeeMap?: {
    stateName: SchemaStateItem['name'];
    paths: SchemaCompTreePath[];
  }[];
  /**
   * 事件-组件树映射
   * 一对多
   */
  eventCompTreeeMap?: {
    eventName: SchemaEventItem['name'];
    paths: SchemaCompTreePath[];
  }[];
  /**
   * 匿名函数路径
   */
  anonymousFunctionList: {
    path: SchemaCompTreePath;
  }[];
  /**
   * 引用-组件树映射
   * 一对一
   */
  refCompTreeeMap?: {
    refName: SchemaRefItem['name'];
    paths: SchemaCompTreePath[];
  }[];
  /**
   * 状态-事件映射
   * 多对一
   */
  stateEventMap?: {
    /**
     * 监听状态变更
     */
    dependences: SchemaStateItem['name'][];
    /**
     * 状态改变后的执行函数
     */
    eventName: SchemaEventItem['name'];
    /**
     * 描述
     */
    desc?: string;
  }[];
}
