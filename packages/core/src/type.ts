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
 * 将某些字段置为Partial
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

/**
 * 将首字母转换为大写
 */
export type UppercaseFirstLetter<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T;

/**
 * 将首字母转换为小写
 */
export type LowercaseFirstLetter<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : T;

/**
 * 获取Set类型中的元素类型
 */
export type GetSetType<T> = T extends Set<infer U> ? U : never;

/**
 * 获取数组类型中的元素类型
 */
export type GetArrayItemType<T> = T extends Array<infer U> ? U : never;
