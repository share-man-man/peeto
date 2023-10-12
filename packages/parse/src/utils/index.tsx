import type { SchemaCompTree } from '../ParseComponent/type';
import type {
  AnyType,
  JSExpressionType,
  JSFunctionRenderType,
  JSFunctionType,
  JSStateEffectType,
  JSStateType,
} from '../type';

/**
 * 生成 包名+组件名 的唯一标识
 * @param obj
 * @returns
 */
export const getCompId = (obj: SchemaCompTree): string => {
  return `${obj.packageName}-${obj.componentName}`;
};

/**
 * 是否为基础节点
 * @param obj
 * @returns
 */
export const isBasicType = (obj: AnyType): boolean => {
  return [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Undefined]',
    null,
  ].includes(Object.prototype.toString.call(obj));
};

/**
 * 是否为schema节点
 * @param obj
 * @returns
 */
export const isSchemaCompTree = (obj: AnyType): obj is SchemaCompTree => {
  return !!obj?.componentName && !!obj?.packageName;
};

/**
 * 是否为表达式节点
 * @param obj
 * @returns
 */
export const isExpression = (obj: AnyType): obj is JSExpressionType => {
  return obj?.type === 'JSExpression';
};

/**
 * 是否为函数节点
 * @param obj
 * @returns
 */
export const isFunction = (obj: AnyType): obj is JSFunctionType => {
  return obj?.type === 'JSFunction';
};

/**
 * 是否为渲染函数节点
 * @param obj
 * @returns
 */
export const isRenderFunction = (obj: AnyType): obj is JSFunctionRenderType => {
  return obj?.type === 'JSFunction' && obj?.children;
};

/**
 * 是否为状态节点
 * @param obj
 * @returns
 */
export const isState = (obj: AnyType): obj is JSStateType => {
  return obj?.type === 'JSExpression' && obj?.state;
};

/**
 * 是否为修改状态节点
 * @param obj
 * @returns
 */
export const isStateEffect = (obj: AnyType): obj is JSStateEffectType => {
  return obj?.type === 'JSFunction' && obj?.effects;
};
