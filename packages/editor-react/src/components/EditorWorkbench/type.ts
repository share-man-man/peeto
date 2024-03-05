import { PackageListType } from '@peeto/parse';
import { EDITOR_LIB_TYPE } from '../../type';

export interface WorkBenchProps {
  type: EDITOR_LIB_TYPE;
  schemaStr: string;
  packageList: PackageListType;
  /**
   * 加载映射关系的节流时间
   */
  delay?: number;
}
