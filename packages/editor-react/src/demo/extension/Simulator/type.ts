import { LibListItem, SchemaCompTreeItem } from '@peeto/core';
import { EXTENSION_LIB_TYPE } from '../ChangeProp';

export interface AppActionRef {
  setConfig: (c: SimulatorConfigType) => void;
  // getMap: () => SimulatorExtensionCompDomMap;
}

export type SimulatorExtensionCompDomMap = Map<
  SchemaCompTreeItem['id'],
  HTMLElement[]
>;
export interface SimulatorConfigType {
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
