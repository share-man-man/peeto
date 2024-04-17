import { UsbOutlined } from '@ant-design/icons';
import { PluginRenderProps, TopToolBarPluginItemProps } from '@peeto/editor';
import PluginRender from '../PluginRender';
import { useContext } from 'react';
import { WORK_BENCH_ICON_CLICK_EVENT, WorkBenchContext } from '../..';

export interface TopToolBarRenderProps {
  list: PluginRenderProps<TopToolBarPluginItemProps>[];
}

const Index = ({ list }: TopToolBarRenderProps) => {
  const context = useContext(WorkBenchContext);

  return (
    <div className="peeto-workbench-content-top-tool-bar">
      <div className="peeto-workbench-content-top-tool-bar-icons">
        <div className="peeto-workbench-content-top-tool-bar-icons-left">
          {list.map(({ config }) => {
            const t = config;
            return (
              <div
                key={t.name}
                onClick={() => {
                  context.plugin?.dispatchEvent([
                    {
                      name: WORK_BENCH_ICON_CLICK_EVENT,
                      paylod: config,
                      // 触发对应的插件，而不是全部触发
                      filtert: (item) => {
                        return item.renderProps.config.name == config.name;
                      },
                    },
                  ]);
                }}
              >
                {t.icon || <UsbOutlined />}
              </div>
            );
          })}
        </div>
      </div>
      <div className="peeto-workbench-content-top-tool-bar-panel">
        {list.map((i) => {
          return <PluginRender key={i.config.name} {...i} visible={false} />;
        })}
      </div>
    </div>
  );
};

export default Index;
