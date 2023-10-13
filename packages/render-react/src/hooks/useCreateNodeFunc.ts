import { createElement } from 'react';
import { ReactRenderProps } from '../type';

const Index = (props: ReactRenderProps) => {
  return props?.onCreateNode || createElement;
};

export default Index;
