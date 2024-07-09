import { NodeType } from '../root';
import { AnyType } from '../type';
import { SchemaCompTreeItem } from './type';

/**
 * 是否为基础节点
 * @param obj
 * @returns
 */
export const isBasicNode = (obj: AnyType): boolean => {
  return [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Undefined]',
    null,
  ].includes(Object.prototype.toString.call(obj));
};

/**
 * 是否是组件节点
 * @param obj
 * @returns
 */
export const isSchemaCompTree = (obj: AnyType): obj is SchemaCompTreeItem => {
  return obj?.type === NodeType.COMPONENT;
};
