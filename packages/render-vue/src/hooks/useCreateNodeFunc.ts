import { h } from 'vue';
import { VueRenderProps } from '../type';

const Index = (props: VueRenderProps) => {
  return props?.onCreateNode || (h as Required<VueRenderProps>['onCreateNode']);
};

export default Index;
