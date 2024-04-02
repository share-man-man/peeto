import { useMemo } from 'react';
import { PluginRenderProps } from '../../type';
import PluginRender from '../PluginRender';

export interface SimilatorRenderProps {
  list: PluginRenderProps[];
}

const Index = ({ list }: SimilatorRenderProps) => {
  // 默认用最后一个注册的模拟器
  const lastItem = useMemo(() => {
    return list[list.length - 1];
  }, [list]);

  return <div>{lastItem && <PluginRender {...lastItem} />}</div>;
};

export default Index;
