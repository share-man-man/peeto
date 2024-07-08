import type {
  // RenderProps,
  GenerateNodePropType,
  // PackageMapType,
  // CompMapType,
  // PickRequired,
  LibListItem,
} from '@peeto/parse';
import type { FunctionComponent, ReactNode } from 'react';
// import type { createElement } from 'react';

export interface ReactRenderProps
  extends Partial<
    Pick<
      GenerateNodePropType<ReactNode>,
      'noMatchCompRender' | 'noMatchPackageRender' | 'onCreateNode'
    >
  > {
  // /**
  //  * 自定义创建节点。
  //  * 内部为了兼容react16，默认使用createElement
  //  * 如果要用到react17及以上版本，可自定义通过react/jsx-runtime创建节点
  //  */
  // onCreateNode?: (
  //   ...p: Parameters<GenerateNodePropType<ReactNode>['onCreateNode']>
  // ) => ReturnType<typeof createElement>;
  /**
   * schema字符串
   * @description 之所以是字符串，是因为useEffect相比监听对象，字符串可减少函数调用次数
   */
  schemaStr: string;
  /**
   * lib包列表
   * @description
   */
  libList: LibListItem[];
  /**
   * 加载中
   */
  loadingRender?: FunctionComponent;
  /**
   * 创建节点树之后的钩子函数
   * @param node
   * @returns
   */
  onNodeChange?: (node: ReactNode) => void;
}

// export type RenderByPackageProps = {
//   packageMap: PackageMapType;
//   compMap: CompMapType;
// } & PickRequired<ReactRenderProps, 'onCreateNode'>;
