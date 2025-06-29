import { NodeType } from '../schema';
import { AnyType } from '../type';
// import { HookNodeType } from './type';

export enum FieldTypeEnum {
  NAME = 'name',
  ARR = 'arr',
  OBJ = 'obj',
}

export class HookNodeType {
  public type = NodeType.HOOK;
  public name: string = '';
  constructor(p: Omit<HookNodeType, 'type'>) {
    Object.assign(this, p);
  }
}

/**
 * 是否为hook节点
 * @param obj
 * @returns
 */
export const isHookNode = (obj: AnyType): obj is HookNodeType => {
  return obj?.type === NodeType.HOOK;
};
