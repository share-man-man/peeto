import { createElement } from 'react';
import { ReactRenderProps } from './type';

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
