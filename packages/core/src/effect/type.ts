// import { SchemaRefItem } from '../ref/type';
import { LibListItem } from '../lib/type';
import { SchemaRefItem } from '../ref/type';
import { NodeType } from '../root';
import { SchemaStateItem } from '../state/type';

export interface SchemaEffectItem {
  /**
   * 依赖的状态
   */
  dependences: (
    | {
        type: NodeType.STATE;
        stateName: SchemaStateItem['name'];
      }
    | {
        type: NodeType.LIB;
        libName: LibListItem['name'];
        alias?: string;
        subName: string;
      }
    | {
        type: NodeType.REF;
        refName: SchemaRefItem['name'];
      }
  )[];
  /**
   * 执行的函数
   */
  body: string;
  /**
   * 执行事件会影响的状态
   */
  effectStates: SchemaStateItem['name'][];
  //   /**
  //    * 执行函数会调用的ref
  //    */
  //   effectRefs: SchemaRefItem['name'][];
}
