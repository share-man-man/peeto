import type {
  GenerateNodePropType,
  LibListItem,
  PickPartial,
  StateRefHookGetSetType,
} from '@peeto/core';
import type { ReactNode, createElement } from 'react';

export type SchemaCompProps = {
  /**
   * schema字符串
   * @description 之所以是字符串，是因为useEffect相比监听对象，字符串可减少函数调用次数
   */
  schemaStr: string;
  /**
   * 创建节点树之后的钩子函数
   * @param node
   * @returns
   */
  onNodeChange?: (node: ReactNode) => void;
} & Omit<
  GenerateNodePropType<ReactNode>,
  'schemaRootObj' | keyof StateRefHookGetSetType
>;

export interface ReactRenderProps
  extends PickPartial<
    Omit<SchemaCompProps, 'modulesMap'>,
    | 'onCreateCompNode'
    | 'noMatchCompRender'
    | 'errorBoundaryRender'
    | 'parseSchemaCompFields'
  > {
  /**
   * lib包列表
   * @description
   */
  libList: LibListItem[];
  /**
   * 加载中
   */
  loadingRender?: Parameters<typeof createElement>[0];
}
