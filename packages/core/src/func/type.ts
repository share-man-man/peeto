import { SchemaEffectItem } from '../effect/type';
import { ModulesMapType } from '../lib/type';
import {
  ContextType,
  ParseObjOptionType,
  StateRefHookGetSetType,
} from '../root/type';
import { AnyType, PickRequired } from '../type';
import type { AnonymousFunctionNode } from './';

export interface GenerateArgumentsType {
  (
    option: StateRefHookGetSetType &
      Pick<SchemaEffectItem, 'effectStates' | 'dependences'> &
      Pick<AnonymousFunctionNode, 'params'> & {
        paramsValueList?: AnyType[];
        ctx: ContextType;
      } & {
        modulesMap: ModulesMapType;
      }
  ): {
    argNameList: string[];
    argList: AnyType[];
  };
}

export type GenerateFuncBaseOptionType<VNodeType> = Parameters<
  PickRequired<
    ParseObjOptionType<VNodeType>,
    'parseAnonymousFunctionNode'
  >['parseAnonymousFunctionNode']
>[0] &
  ReturnType<GenerateArgumentsType>;
