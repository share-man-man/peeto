import { NodeType } from '../root';
import { AnyType } from '../type';
import { RefNodeType } from './type';

export const isRefNode = (obj: AnyType): obj is RefNodeType => {
  return obj?.type === NodeType.REF;
};
