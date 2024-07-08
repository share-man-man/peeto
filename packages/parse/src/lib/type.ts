import { AnyType } from '../type';

export interface LibListItem {
  /**
   * 组件库名称
   */
  name: string;
  /**
   * 加载方法
   * @returns
   */
  load: () => Promise<AnyType>;
}

export type LibListMapType = Map<string, AnyType>;
