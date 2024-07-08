import { createElement } from 'react';
import { ReactRenderProps } from '../type';

const Index = (
  props: ReactRenderProps
): Required<ReactRenderProps>['onCreateNode'] => {
  return (
    props?.onCreateNode ||
    (({ comp, props: p, children }) => createElement(comp, p, children))
  );
};

export default Index;
