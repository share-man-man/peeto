import { AnyType } from '../type';

export interface SchemaLibItem {
  /**
   * 包名
   */
  name: string;
  /**
   * 子模块数组
   */
  subs: SchemaLibItemSubsItem[];
}

export interface SchemaLibItemSubsItem {
  /**
   * 子模块名
   */
  name: string;
  /**
   * 别名
   */
  alias?: string;
}

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

export type ModulesMapType = Map<string, AnyType>;
