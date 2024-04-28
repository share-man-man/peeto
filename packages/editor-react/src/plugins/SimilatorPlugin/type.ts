import { PackageListType, SchemaCompTree } from '@peeto/parse';
import { PLUGIN_LIB_TYPE } from '@peeto/editor';

export interface AppActionRef {
  setConfig: (c: SimilatorPluginConfig) => void;
  getMap: () => SimilatorPluginCompDomMap;
}

export type SimilatorPluginCompDomMap = Map<
  SchemaCompTree['id'],
  HTMLElement[]
>;
export interface SimilatorPluginConfig {
  /**
   * ui库类型
   */
  type: PLUGIN_LIB_TYPE;
  /**
   * schema
   */
  schemaStr: string;
  /**
   * 组件库
   */
  packageList: PackageListType;
}
