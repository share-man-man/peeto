import { AnyType, SchemaCompTree } from '..';
import { JSExpressionType, JSFunctionType } from '../AsyncRender/type';

/**
 * 生成包-组件的唯一标识
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
  return obj.type === 'JSExpression';
};
/**
 * 是否为函数节点
 * @param obj
 * @returns
 */
export const isFunction = (obj: AnyType): obj is JSFunctionType => {
  return obj.type === 'JSFunction';
};
