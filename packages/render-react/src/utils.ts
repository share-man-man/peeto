import { createElement } from 'react';
import { ReactRenderProps } from './type';

/**
 * 默认的加载中
 * @returns
 */
export const defaultLoading = () => {
  return createElement('div', undefined, 'loading');
};

export const defaultNoMatchLibRender: Required<ReactRenderProps>['noMatchLibRender'] =
  ({ schema }) =>
    createElement(
      'div',
      {
        key: `nomatch-package-${schema.id}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },
      `没有找到包:${schema.packageName}`
    );

export const defaultNoMatchCompRender: Required<ReactRenderProps>['noMatchCompRender'] =
  ({ schema }) =>
    createElement(
      'div',
      {
        key: `nomatch-package-component-${schema.id}`,
        style: {
          color: 'red',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
          padding: 12,
        },
      },
      `包:${schema.packageName}里没有找到组件:${schema.componentName}`
    );
