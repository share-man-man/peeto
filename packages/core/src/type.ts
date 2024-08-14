export type { SchemaRootObj } from './root/type';

/**
 * any类型逃生舱
 */
export type AnyType = ReturnType<typeof JSON.parse>;

/**
 * 将某些字段置为required
 */
export type PickRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * 将某些字段置为required
 */
export type PickPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

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
