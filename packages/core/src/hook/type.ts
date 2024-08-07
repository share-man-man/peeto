import { SchemaEffectItem } from '../effect/type';
import { NodeType } from '../root';
import { AnyType } from '../type';

export interface SchemaHookItem {
  effect: SchemaEffectItem;
  name?: string;
  arrDestructs?: string[];
  objDestructs?: {
    name: string;
    alias?: string;
  }[];
}

export interface HookNodeType {
  type: NodeType.HOOK;
  hookName: string;
}

export interface HookGetSetType {
  getHook: (p: Pick<HookNodeType, 'hookName'>) => AnyType;
}
