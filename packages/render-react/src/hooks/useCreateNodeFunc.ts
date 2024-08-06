import { createElement } from 'react';
import { ReactRenderProps } from '../type';

/**
 * 自定义创建节点。
 * 内部为了兼容react16，默认使用createElement
 * 如果要用到react17及以上版本，可自定义通过react/jsx-runtime创建节点
 * 不能使用jsx语法，会自动导入react/jsx-runtime包。相关文档：https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
 */
const Index = (
  props: Pick<ReactRenderProps, 'onCreateCompNode'>
): Required<ReactRenderProps>['onCreateCompNode'] => {
  return (
    props?.onCreateCompNode ||
    (({ comp, props: { children, ...p } = {} }) =>
      createElement(comp, p, children))
  );
};

export default Index;
