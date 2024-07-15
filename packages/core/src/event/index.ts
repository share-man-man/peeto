import { NodeType } from '../root';
import { SchemaStateItem } from '../state/type';
import { AnyType } from '../type';
import { AnonymousFunctionNode } from './type';

export const isAnonymousFunctionNode = (
  obj: AnyType
): obj is AnonymousFunctionNode => {
  return obj?.type === NodeType.ANONYMOUSFUNCTION;
};

export const getSetStateName = ({
  stateName,
}: {
  stateName: SchemaStateItem['name'];
}) => {
  return `set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`;
};
