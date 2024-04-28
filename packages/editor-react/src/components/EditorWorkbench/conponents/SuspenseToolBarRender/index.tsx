import {
  PluginRenderProps,
  SuspenseToolBarPluginItemProps,
} from '@peeto/editor';
import PluginRender from '../PluginRender';

export interface SuspenseToolBarRenderProps {
  list: PluginRenderProps<SuspenseToolBarPluginItemProps>[];
}

const Index = ({ list }: SuspenseToolBarRenderProps) => {
  return (
    <div>
      {list.map((i) => {
        return <PluginRender key={i.config.name} {...i} visible={false} />;
      })}
    </div>
  );
};

export default Index;
