import { FieldTypeEnum, HookNodeType } from '.';
import { SchemaEffectItem } from '../effect/type';
// import { NodeType } from '../root';
import { AnyType } from '../type';

export interface SchemaHookItem {
  /**
   * 创建hooks的函数
   */
  effect: SchemaEffectItem;
  /**
   * 解构返回值
   */
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

export interface HookGetSetType {
  getHook: (p: Pick<HookNodeType, 'name'>) => AnyType;
}
