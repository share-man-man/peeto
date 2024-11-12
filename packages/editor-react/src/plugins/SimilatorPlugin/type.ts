import { LibListItem, SchemaCompTreeItem } from '@peeto/core';
import { EXTENSION_LIB_TYPE } from '@peeto/extension';

export interface AppActionRef {
  setConfig: (c: SimilatorPluginConfig) => void;
  getMap: () => SimilatorPluginCompDomMap;
}

export type SimilatorPluginCompDomMap = Map<
  SchemaCompTreeItem['id'],
  HTMLElement[]
>;
export interface SimilatorPluginConfig {
  /**
   * ui库类型
   */
  type: EXTENSION_LIB_TYPE;
  /**
   * schema
   */
  schemaStr: string;
  /**
   * 组件库
   */
  packageList: LibListItem[];
}
