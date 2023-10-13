import { h } from 'vue';
import { VueRenderProps } from '../type';

const Index = (props: VueRenderProps) => {
  return props?.onCreateNode || h;
};

export default Index;
