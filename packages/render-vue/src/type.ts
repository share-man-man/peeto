import type {
  AnyType,
  GenerateNodePropType,
  LibListItem,
  PickPartial,
  StateRefHookGetSetType,
} from '@peeto/core';
import { Slot, VNode } from 'vue';

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
  onNodeChange?: (node: VNode) => void;
} & Omit<
  GenerateNodePropType<VNode>,
  'schemaRootObj' | keyof StateRefHookGetSetType
>;

export interface VueRenderProps
  extends PickPartial<
    Omit<
      SchemaCompProps,
      'modulesMap' | 'noMatchCompRender' | 'errorBoundaryRender'
    >,
    'onCreateCompNode'
  > {
  /**
   * lib包列表
   * @description
   */
  libList: LibListItem[];
  // /**
  //  * 加载中
  //  */
  // loadingRender?: Parameters<typeof h>[0];
}

export interface VueRenderSlots {
  loadingRender: Slot<AnyType>;
  noMatchCompRender: Slot<
    Parameters<SchemaCompProps['noMatchCompRender']>['0']
  >;
  errorBoundaryRender: Slot<Parameters<SchemaCompProps['errorBoundaryRender']>>;
}
