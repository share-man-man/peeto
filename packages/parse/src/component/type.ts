// import { SchemaEventItem } from '../event/type';
import { LibListMapType } from '../lib/type';
// import { SchemaRefItem } from '../ref/type';
import { CompTreeLibMapItem, SchemaRootObj } from '../root/type';
import { SchemaStateItem } from '../state/type';
import type { AnyType, JSONObject, JSONValue } from '../type';

/**
 * schema路径
 */
export type SchemaCompTreePath = (string | number)[];

export interface SchemaCompTreeItem extends JSONObject {
  id: string;
  // /**
  //  * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
  //  */
  // componentName: string;
  // /**
  //  * 组件所属包名
  //  */
  // packageName: string;
  /**
   * 组件参数
   */
  props?: Record<string, JSONValue> | undefined;
  /**
   * 子组件树
   */
  children?: SchemaCompTreeItem | SchemaCompTreeItem[] | undefined;
}

export interface GenerateNodePropType<VNodeType> {
  /**
   * schema对象
   */
  schemaRootObj: SchemaRootObj;
  /**
   * 获取状态
   * @param P
   * @returns
   */
  getState: (P: { stateName: SchemaStateItem['name'][] }) => AnyType[];
  // /**
  //  * 获取事件
  //  * @param P
  //  * @returns
  //  */
  // getEvent: (P: { eventName: SchemaEventItem['name'] }) => AnyType;
  // /**
  //  * 获取ref
  //  * @param P
  //  * @returns
  //  */
  // getRef: (P: { refName: SchemaRefItem['name'] }) => AnyType;
  /**
   * 设置状态
   * @param fieldList 状态列表
   * @returns
   */
  setState: (p: { fieldList: { name: string; value: AnyType }[] }) => void;
  /**
   * 创建节点（虚拟dom）
   * @param comp 组件渲染函数
   * @param props 组件参数
   * @param children 组件children
   * @returns 节点对象（虚拟dom）
   */
  onCreateNode: (p: {
    comp: AnyType;
    props: AnyType;
    children: AnyType;
  }) => VNodeType;
  // /**
  //  * 组件集合
  //  */
  // compMap: CompMapType;
  /**
   * 依赖包集合
   */
  libListMap: LibListMapType;
  // compTreeLibMap: SchemaRootObj['compTreeLibMap'];
  /**
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender: (p: {
    schema: SchemaCompTreeItem;
    compTreeItem: CompTreeLibMapItem;
  }) => VNodeType;
  /**
   * 没有找到包
   * @param obj
   * @returns
   */
  noMatchPackageRender: (p: {
    schema: SchemaCompTreeItem;
    compTreeItem: CompTreeLibMapItem;
  }) => VNodeType;
}
