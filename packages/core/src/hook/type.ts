import { FieldTypeEnum, HookNodeType } from '.';
import { SchemaEffectItem } from '../effect/type';
// import { NodeType } from '../root';
import { AnyType } from '../type';

export interface SchemaHookItem {
  /**
   * 响应式函数
   */
  effect: SchemaEffectItem;
  field:
    | {
        type: FieldTypeEnum.NAME;
        [FieldTypeEnum.NAME]: string;
      }
    | {
        type: FieldTypeEnum.ARR;
        [FieldTypeEnum.ARR]: string[];
      }
    | {
        type: FieldTypeEnum.OBJ;
        [FieldTypeEnum.OBJ]: {
          name: string;
          alias?: string;
        }[];
      };
}

// export interface HookNodeType {
//   type: NodeType.HOOK;
//   hookName: string;
// }

export interface HookGetSetType {
  getHook: (p: Pick<HookNodeType, 'name'>) => AnyType;
}
