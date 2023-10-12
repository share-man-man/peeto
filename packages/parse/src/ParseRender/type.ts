import type { AnyType, CompMapType, SchemaRootObj } from '../type';

/**
 * 解析渲染函数
 */
export interface RenderProps<VNodeType> {
  /**
   * 获取状态
   * @param stateNameList 状态名
   * @returns
   */
  getState?: (stateNameList: string[]) => AnyType[];
  /**
   * 设置状态
   * @param fieldList 状态列表
   * @returns
   */
  setState?: (fieldList: { name: string; value: AnyType }[]) => void;
  /**
   * schema对象
   */
  schemaCompTree: SchemaRootObj['compTree'];
  /**
   * 创建节点（虚拟dom）
   * @param comp 组件渲染函数
   * @param props 组件参数
   * @param children 组件children
   * @returns 节点对象（虚拟dom）
   */
  onCreateNode: (comp: AnyType, props: AnyType, children: AnyType) => VNodeType;
  /**
   * 组件集合
   */
  compMap: CompMapType;
  /**
   * 全局变量
   */
  globalStore?: Record<string, AnyType>;
}
