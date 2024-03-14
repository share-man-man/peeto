import { useEffect, useRef, useState } from 'react';
import { InjectPluginCompProps } from '../../type';
import { SimilatorPluginCompDomMap, SimilatorPluginConfig } from './type';
import AppRender from '../../components/AppRender';

import ReactApp from './components/ReactApp';
import { ReactAppProps } from './components/ReactApp/type';
import VueApp from './components/VueApp/App.vue';
import { VueAppProps } from './components/VueApp/type';

export const SIMILATOR_CONFIG_CHANGE_EVENT =
  '__peeto_similator_config_change_event';

const Index = ({ subscribeEvent }: InjectPluginCompProps) => {
  const mapRef = useRef<SimilatorPluginCompDomMap>(new Map());
  const [config, setConfig] = useState<SimilatorPluginConfig>();
  useEffect(() => {
    subscribeEvent([
      {
        name: SIMILATOR_CONFIG_CHANGE_EVENT,
        run: (v) => {
          setConfig({
            ...v,
          });
        },
      },
    ]);
  }, [subscribeEvent]);

  const cbRef = useRef<Parameters<ReactAppProps['subConfig']>[0]>();

  useEffect(() => {
    if (!config) {
      return;
    }
    cbRef.current?.(config);
  }, [config]);

  if (!config) {
    return <div>没有配置</div>;
  }

  return (
    <div
      onClick={(e) => {
        mapRef.current.forEach((doms, key) => {
          if (doms.includes(e.target as HTMLElement)) {
            // TODO 合并dom，获取最大宽高、位置
            console.log(11, key);
          }
        });
      }}
    >
      <AppRender
        type={config.type}
        reactProps={{
          comp: ReactApp,
          prop: {
            // 订阅config改变
            subConfig: (cb) => {
              cbRef.current = cb;
              cbRef.current?.(config);
            },
            onMapChange: (map) => {
              // console.log('react-映射关系===', map);
              mapRef.current = map;
            },
          } as ReactAppProps,
        }}
        vueProps={{
          comp: VueApp,
          prop: {
            subConfig: (cb) => {
              cbRef.current = cb;
              cbRef.current?.(config);
            },
            onMapChange: (map) => {
              // console.log('vue-映射关系===', map);
              mapRef.current = map;
            },
          } as VueAppProps,
        }}
      />
    </div>
  );
};

export default Index;
