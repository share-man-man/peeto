import { SchemaEffectDependenceType } from './index';
import { HookNodeType } from '../hook';
import { SchemaLibItemSubsItem } from '../lib/type';
import { RefNodeType } from '../ref';
import { StateNodeType } from '../state';
import { SchemaStateItem } from '../state/type';

/**
 * 副作用函数
 */
export interface SchemaEffectItem {
  /**
   * 依赖数组
   */
  dependences?: (
    | {
        type: SchemaEffectDependenceType.STATE;
        name: StateNodeType['name'];
      }
    | {
        type: SchemaEffectDependenceType.MODULE;
        name: SchemaLibItemSubsItem['name'];
      }
    | {
        type: SchemaEffectDependenceType.REF;
        name: RefNodeType['name'];
      }
    | {
        type: SchemaEffectDependenceType.HOOK;
        name: HookNodeType['name'];
      }
  )[];
  /**
   * 执行的函数
   */
  body: string;
  /**
   * 执行事件会影响的状态
   */
  effectStates?: SchemaStateItem['name'][];
}
