import { PackageListType, SchemaCompTree } from '@peeto/parse';
import { EDITOR_LIB_TYPE } from '../../type';

export type SimilatorPluginCompDomMap = Map<
  SchemaCompTree['id'],
  HTMLElement[]
>;
export interface SimilatorPluginConfig {
  /**
   * ui库类型
   */
  type: EDITOR_LIB_TYPE;
  /**
   * schema
   */
  schemaStr: string;
  /**
   * 组件库
   */
  packageList: PackageListType;
  /**
   * 加载映射关系的节流时间
   */
  delay?: number;
  /**
   * 映射关系改变
   * @param map
   * @returns
   */
  onMapChange?: (map: SimilatorPluginCompDomMap) => void;
}
