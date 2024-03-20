import { v4 as id } from 'uuid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { InjectPluginCompProps } from '../../type';
import {
  AppActionRef,
  SimilatorPluginCompDomMap,
  SimilatorPluginConfig,
} from './type';
import AppRender from '../../components/AppRender';

import ReactApp from './components/ReactApp';
import { ReactAppProps } from './components/ReactApp/type';
import VueApp from './components/VueApp/App.vue';
import { VueAppProps } from './components/VueApp/type';

export const SIMILATOR_CONFIG_CHANGE_EVENT =
  '__peeto_similator_config_change_event';

/**
 * 生成唯一key
 * @returns
 */
export const generateKey = () => `__peeto_similator_${id()}`;

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

  const appActionRef = useRef<AppActionRef>();
  useEffect(() => {
    if (!config) {
      return;
    }
    appActionRef.current?.setConfig(config);
  }, [config]);

  // TODO 探寻获取映射方法：click,window宽高

  const handleClickContainer = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      mapRef.current = appActionRef.current?.getMap() || new Map();

      console.log(22, mapRef.current, e.target);

      // TODO 点击的dom没找到的话，从父节点查找
      // mapRef.current.forEach((doms, key) => {
      //   // 不能通过target寻找，遇到组件内部停止冒泡，就获取不到准确的dom
      //   // if (doms.includes(e.target as HTMLElement)) {
      //   //   // TODO 合并dom，获取最大宽高、位置
      //   //   console.log(11, key);
      //   // }
      // });
    },
    []
  );

  if (!config) {
    return <div>没有配置</div>;
  }

  return (
    <div onClick={handleClickContainer}>
      <AppRender
        type={config.type}
        reactProps={{
          comp: ReactApp,
          prop: {
            actionRef: (ctx) => {
              appActionRef.current = ctx;
              // 手动调用一次setConfig，初始化配置
              appActionRef.current?.setConfig(config);
            },
          } as ReactAppProps,
        }}
        vueProps={{
          comp: VueApp,
          prop: {
            actionRef: (ctx) => {
              appActionRef.current = ctx;
              // 手动调用一次setConfig，初始化配置
              appActionRef.current?.setConfig(config);
            },
          } as VueAppProps,
        }}
      />
    </div>
  );
};

export default Index;
