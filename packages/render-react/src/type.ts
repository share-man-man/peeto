import type {
  PackageListType,
  RenderProps,
  ParseComponentProps,
  PackageMapType,
  CompMapType,
  PickRequired,
} from '@peeto/parse';
import type { FunctionComponent, ReactNode } from 'react';
import type { createElement } from 'react';

export interface ReactRenderProps
  extends Partial<
    Pick<
      ParseComponentProps<ReactNode>,
      'noMatchCompRender' | 'noMatchPackageRender'
    >
  > {
  /**
   * 自定义创建节点。
   * 内部为了兼容react16，默认使用createElement
   * 如果要用到react17及以上版本，可自定义通过react/jsx-runtime创建节点
   */
  // onCreateNode?: RenderProps<ReactNode>['onCreateNode'];
  onCreateNode?: (
    ...p: Parameters<RenderProps<ReactNode>['onCreateNode']>
  ) => ReturnType<typeof createElement>;
  /**
   * schema字符串
   * @description 之所以是字符串，是因为useEffect相比监听对象，字符串可减少函数调用次数
   */
  schemaStr: string;
  /**
   * 包列表
   * @description
   */
  packageList: PackageListType;
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

export type RenderByPackageProps = {
  packageMap: PackageMapType;
  compMap: CompMapType;
} & PickRequired<ReactRenderProps, 'onCreateNode'>;
