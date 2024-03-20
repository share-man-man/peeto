import { AnyType, RenderProps, SchemaCompTree } from '@peeto/parse';
import { Slot, VNode, h } from 'vue';

export interface VueRenderProps {
  /**
   * 自定义创建节点
   */
  onCreateNode?: (
    ...p: Parameters<RenderProps<VNode>['onCreateNode']>
  ) => ReturnType<typeof h>;
  /**
   * schema字符串
   * @description 之所以是字符串，是因为useEffect相比监听对象，字符串可减少函数调用次数
   */
  schemaStr: string;
  /**
   * 包列表
   * @description
   */
  packageList: { name: string; load: () => Promise<AnyType> }[];
  /**
   * 创建节点树之后的钩子函数
   * @param node
   * @returns
   */
  onNodeChange?: (node: VNode) => void;
}

export interface VueRenderSlots {
  noMatchComp: Slot<SchemaCompTree>;
  noMatchPackage: Slot<SchemaCompTree>;
  loading: Slot<AnyType>;
}
