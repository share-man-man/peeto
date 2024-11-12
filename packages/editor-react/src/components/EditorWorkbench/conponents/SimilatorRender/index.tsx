import { useMemo } from 'react';
import PluginRender from '../PluginRender';
import {
  ExtensionRenderProps,
  SimilatorExtensionItemProps,
} from '@peeto/extension';

export interface SimilatorRenderProps {
  list: ExtensionRenderProps<SimilatorExtensionItemProps>[];
}

const Index = ({ list }: SimilatorRenderProps) => {
  // 默认用最后一个注册的模拟器
  const lastItem = useMemo(() => {
    return list[list.length - 1];
  }, [list]);

  return <div>{lastItem && <PluginRender {...lastItem} />}</div>;
};

export default Index;
