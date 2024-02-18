import type { JSONObject } from '../type';

export interface SchemaEffectItem extends JSONObject {
  /**
   * 依赖的状态
   */
  dependences: string[];
  /**
   * 影响的状态
   */
  effectStates: { name: string; value: string }[];
  /**
   * 依赖备注
   */
  desc?: string;
}
