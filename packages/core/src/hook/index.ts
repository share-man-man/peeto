import { NodeType } from '../root';
import { AnyType } from '../type';
import { HookNodeType } from './type';

/**
 * 是否为hook节点
 * @param obj
 * @returns
 */
export const isHookNode = (obj: AnyType): obj is HookNodeType => {
  return obj?.type === NodeType.HOOK;
};
