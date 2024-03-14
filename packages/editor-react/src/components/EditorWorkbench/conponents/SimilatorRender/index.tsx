import { useMemo } from 'react';
import { BaseToolBarPluginProps, SimilatorPluginItemProps } from '../../type';
import PluginRender from '../../../PluginRender';

export interface SimilatorRenderProps {
  list: SimilatorPluginItemProps[];
}

const Index = ({ list }: SimilatorRenderProps) => {
  const lastItem = useMemo(() => {
    return list[list.length - 1];
  }, [list]);

  return (
    <div>
      {lastItem && <PluginRender item={lastItem as BaseToolBarPluginProps} />}
    </div>
  );
};

export default Index;
