/**
 * any类型逃生舱
 */
export type AnyType = ReturnType<typeof JSON.parse>;

/**
 * JSON节点类型
 */
export type JSONValue =
  // 字符串节点
  | string
  // 数字节点
  | number
  // 布尔节点
  | boolean
  // 对象节点
  | JSONObject
  // 数组节点
  | JSONArray
  // 空节点
  | null
  | undefined;

/**
 * 对象节点
 */
export type JSONObject = {
  [k: string]: JSONValue;
};

/**
 * 数组节点
 */
export type JSONArray = Array<JSONValue>;

/**
 * 对象节点->表达式节点
 */
export type JSExpressionType = {
  type: 'JSExpression';
  /**
   * js表达式，和依赖状态名互斥
   */
  value?: string;
  /**
   * 依赖状态名，和表达式互斥
   */
  state?: string;
};
/**
 * 对象节点->函数节点
 */
export type JSFunctionType = {
  type: 'JSFunction';
  /**
   * 函数参数
   */
  params: string[];
  value?: string;
  /**
   * 函数返回组件
   */
  children?: SchemaCompTree | SchemaCompTree[];
  /**
   * 受影响的状态，函数内部调用this.onChangeState
   */
  effects?: string[];
};
/**
 * schema组件数
 */
export interface SchemaCompTree extends JSONObject {
  id: string;
  /**
   * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
   */
  componentName: string;
  /**
   * 组件所属包名
   */
  packageName: string;
  /**
   * 组件参数
   */
  props:
    | Record<string, JSONValue | JSExpressionType | JSFunctionType>
    | undefined;
  children?: SchemaCompTree | SchemaCompTree[] | undefined;
}

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
  schemaCompTree: SchemaCompTree;
  /**
   * 创建节点（虚拟dom）
   * @param comp 组件渲染函数
   * @param props 组件参数
   * @param children 组件children
   * @returns 节点对象（虚拟dom）
   */
  onCreateNode: (comp: AnyType, props: AnyType, children: AnyType) => VNodeType;
  /**
   * 异步加载组件
   * @param obj schema节点对象
   * @returns 组件渲染函数
   */
  asyncLoadComp: (obj: SchemaCompTree) => Promise<AnyType>;
}
