import { PackageListType } from '@peeto/parse';
import { EDITOR_LIB_TYPE } from '../../type';

export interface EditorSimilatorProps {
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
}

export type EditorSimilatorDispatchProps =
  | {
      type: 'config';
      paylod: EditorSimilatorProps;
    }
  | { type: 'comp-dom-map' };
