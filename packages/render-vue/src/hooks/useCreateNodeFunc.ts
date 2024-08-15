import { h } from 'vue';
import { VueRenderProps } from '../type';

const Index = (
  props: Pick<VueRenderProps, 'onCreateCompNode'>
): Required<VueRenderProps>['onCreateCompNode'] => {
  return (
    props?.onCreateCompNode ||
    (({ comp, props: p = {}, slots = {} }) => h(comp, p, slots))
  );
};

export default Index;
