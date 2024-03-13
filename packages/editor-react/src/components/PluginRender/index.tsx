import { BaseToolBarPluginProps } from '../EditorWorkbench/type';
import useApp from '../../hooks/useApp';
import { AnyType } from '@peeto/parse';

export interface PluginRenderProps {
  visible: boolean;
  item: BaseToolBarPluginProps;
}

const Index = ({ visible, item }: PluginRenderProps) => {
  const { child } = useApp({
    type: item.renderProps.libType,
    vueProps: {
      comp: item.renderProps.node as AnyType,
      prop: item.renderProps.props,
    },
    reactProps: {
      comp: item.renderProps.node as AnyType,
      prop: item.renderProps.props,
    },
  });
  return <div style={{ display: visible ? '' : 'none' }}>{child}</div>;
};

export default Index;
