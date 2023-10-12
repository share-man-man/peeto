import { FunctionComponent, ReactNode, createElement } from 'react';

import type {
  SchemaCompTree,
  PackageListType,
  RenderProps,
} from '@peeto/parse';

export interface ReactRenderProps {
  /**
   * 自定义创建节点。
   * 内部为了兼容react16，默认使用createElement
   * 如果要用到react17及以上版本，可自定义通过react/jsx-runtime创建节点
   */
  onCreateNode?: RenderProps<ReactNode>['onCreateNode'];
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
   * 没有找到组件
   * @param obj
   * @returns
   */
  noMatchCompRender?: (obj: SchemaCompTree) => ReactNode;
  /**
   * 没有找到包
   * @param obj
   * @returns
   */
  noMatchPackageRender?: (obj: SchemaCompTree) => ReactNode;
  /**
   * 加载中
   */
  loadingRender?: FunctionComponent;
}

/**
 * 默认的加载中
 * @returns
 */
export const defaultLoading = () => {
  return createElement('div', undefined, 'loading');
};

export const defaultNoMatchPackageRender: Required<ReactRenderProps>['noMatchPackageRender'] =
  ({ id: componentId, packageName }) =>
    createElement(
      'div',
      {
        key: `nomatch-package-${componentId}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },
      `没有找到包:${packageName}`
    );

export const defaultNoMatchCompRender: Required<ReactRenderProps>['noMatchCompRender'] =
  ({ id: componentId, componentName, packageName }) =>
    createElement(
      'div',
      {
        key: `nomatch-package-component-${componentId}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },
      `包:${packageName}里没有找到组件:${componentName}`
    );
