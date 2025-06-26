import { NodeType } from '../root';

export enum SchemaEffectDependenceType {
  STATE = NodeType.STATE,
  REF = NodeType.REF,
  HOOK = NodeType.HOOK,
  MODULE = 'module',
}
