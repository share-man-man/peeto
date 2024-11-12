import {
  ExtensionRenderProps,
  SuspenseToolBarExtensionItemProps,
} from '@peeto/extension';
import PluginRender from '../PluginRender';

export interface SuspenseToolBarRenderProps {
  list: ExtensionRenderProps<SuspenseToolBarExtensionItemProps>[];
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
