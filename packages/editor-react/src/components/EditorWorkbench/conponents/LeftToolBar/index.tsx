import { PushpinOutlined, UsbOutlined } from '@ant-design/icons';
import { useContext, useMemo, useState } from 'react';
import PluginRender from '../PluginRender';
import { LeftToolBarPluginItemProps, PluginRenderProps } from '@peeto/editor';
import { WORK_BENCH_ICON_CLICK_EVENT, WorkBenchContext } from '../..';

export interface LeftToolBarRenderProps {
  list: PluginRenderProps<LeftToolBarPluginItemProps>[];
}

/**
 * 默认icon列表宽度
 */
const defaultWidth = 40;
/**
 * 默认面板宽度
 */
const defaultPannelWidth = 300;

const Index = ({ list }: LeftToolBarRenderProps) => {
  const context = useContext(WorkBenchContext);
  const [fixPannel, setFixPannel] = useState(false);
  const [curName, setCurName] = useState<
    LeftToolBarPluginItemProps['name'] | null
  >(null);
  //   当前选中插件
  const curPlugin = useMemo(() => {
    return list.find((i) => i.config.name === curName)?.config;
  }, [curName, list]);
  const curPanneWidth = useMemo(() => {
    if (!curPlugin) {
      return 0;
    }
    return curPlugin.pannelWidth ?? defaultPannelWidth;
  }, [curPlugin]);
  const siderWidth = useMemo<number>(() => {
    return defaultWidth + (fixPannel ? 0 : curPanneWidth);
  }, [curPanneWidth, fixPannel]);

  return (
    <div
      className="peeto-workbench-left-tool-bar"
      style={{
        width: siderWidth,
      }}
    >
      <div className="peeto-workbench-left-tool-bar-icons">
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
                if (curName === t.name) {
                  setCurName(null);
                } else {
                  setCurName(t.name);
                }
              }}
            >
              {t.icon || <UsbOutlined />}
            </div>
          );
        })}
      </div>

      <div
        style={{
          width: curPanneWidth,
          position: fixPannel ? 'absolute' : 'relative',
          transform: fixPannel ? `translateX(${defaultWidth}px)` : '',
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'auto',
          }}
        >
          <PushpinOutlined
            onClick={() => {
              setFixPannel(!fixPannel);
            }}
          />
          <div>
            {list.map((item) => (
              <PluginRender key={item.config.name} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
