// import { SchemaRefItem } from '../ref/type';
import { HookNodeType } from '../hook/type';
import { SchemaLibItemSubsItem } from '../lib/type';
import { SchemaRefItem } from '../ref/type';
import { NodeType } from '../root';
import { SchemaStateItem } from '../state/type';

export interface SchemaEffectItem {
  /**
   * 依赖数组
   */
  dependences?: (
    | {
        type: NodeType.STATE;
        stateName: SchemaStateItem['name'];
      }
    | {
        type: NodeType.MODULE;
        name: SchemaLibItemSubsItem['name'];
      }
    | {
        type: NodeType.REF;
        refName: SchemaRefItem['name'];
      }
    | {
        type: NodeType.HOOK;
        hookName: HookNodeType['hookName'];
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
