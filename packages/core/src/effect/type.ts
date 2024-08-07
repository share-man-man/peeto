import { HookNodeType } from '../hook';
import { SchemaLibItemSubsItem } from '../lib/type';
import { RefNodeType } from '../ref';
import { NodeType } from '../root';
import { StateNodeType } from '../state';
import { SchemaStateItem } from '../state/type';

export interface SchemaEffectItem {
  /**
   * 依赖数组
   */
  dependences?: (
    | {
        type: NodeType.STATE;
        name: StateNodeType['name'];
      }
    | {
        type: NodeType.MODULE;
        name: SchemaLibItemSubsItem['name'];
      }
    | {
        type: NodeType.REF;
        name: RefNodeType['name'];
      }
    | {
        type: NodeType.HOOK;
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
