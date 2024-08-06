import { AnyType } from '../type';

export interface SchemaLibItem {
  name: string;
  subs: SchemaLibItemSubsItem[];
}

export interface SchemaLibItemSubsItem {
  name: string;
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
