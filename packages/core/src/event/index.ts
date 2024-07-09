import { NodeType } from '../root';
import { AnyType } from '../type';
import { AnonymousFunctionNode } from './type';

export const isAnonymousFunctionNode = (
  obj: AnyType
): obj is AnonymousFunctionNode => {
  return obj?.type === NodeType.ANONYMOUSFUNCTION;
};
