import { NodeType } from '../root';
import { AnyType } from '../type';
// import { RefNodeType } from './type';

export class RefNodeType {
  public type = NodeType.REF;
  public name: string = '';
  constructor(p: Omit<RefNodeType, 'type'>) {
    Object.assign(this, p);
  }
}

/**
 * 是否是ref节点
 * @param obj
 * @returns
 */
export const isRefNode = (obj: AnyType): obj is RefNodeType => {
  return obj?.type === NodeType.REF;
};
