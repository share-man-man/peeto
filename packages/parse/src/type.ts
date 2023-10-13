import type { SchemaCompTree } from './ParseComponent/type';
import type { SchemaEffectItem } from './ParseEffect/type';
import type { SchemaStateItem } from './ParseState/type';

/**
 * any类型逃生舱
 */
export type AnyType = ReturnType<typeof JSON.parse>;

/**
 * 将某些字段置为required
 */
export type PickRequired<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P];
};

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
};
/**
 * 对象节点-> 普通函数节点
 */
export type JSFunctionType = {
  type: 'JSFunction';
  /**
   * 函数参数
   */
  params: string[];
  /**
   * 函数方法体
   */
  value?: string;
  /**
   * 函数内注入的状态
   */
  states?: string[];
};
/**
 * 对象节点-> 渲染函数
 */
export type JSFunctionRenderType = JSFunctionType & {
  /**
   * 函数返回组件
   */
  children?: SchemaCompTree | SchemaCompTree[];
};
/**
 * 对象节点->状态节点
 */
export type JSStateType = Omit<JSExpressionType, 'value'> & {
  /**
   * 依赖状态名，和表达式互斥
   */
  state: string;
};
/**
 * 对象节点->修改状态节点
 */
export type JSStateEffectType = Omit<JSFunctionType, 'children'> & {
  /**
   * 受影响的状态
   */
  effects: string[];
};

/**
 * schema组件
 */

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
  effects?: SchemaEffectItem[];
  /**
   * 组件树
   */
  compTree: SchemaCompTree[];
}

/**
 * 组件库集合
 */
export type PackageListType = {
  /**
   * 组件库名称
   */
  name: string;
  /**
   * 加载方法
   * @returns
   */
  load: () => Promise<AnyType>;
}[];

/**
 * 包集合
 */
export type PackageMapType = Map<string, AnyType>;

/**
 * 组件集合
 */
export type CompMapType = PackageMapType;
