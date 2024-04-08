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
import ComponentPicker from './utils/component-pick';

export const SIMILATOR_CONFIG_CHANGE_EVENT =
  '__peeto_similator_config_change_event';

/**
 * 生成唯一key
 * @returns
 */
export const generateKey = () => `__peeto_similator_${id()}`;

const Index = ({ subscribeEvent }: InjectPluginCompProps) => {
  const componentPickerRef = useRef(
    new ComponentPicker({
      onCheckComp: (compList) => {
        console.log(111, compList);
      },
    })
  );
  const mapRef = useRef<SimilatorPluginCompDomMap>(new Map());
  const [config, setConfig] = useState<SimilatorPluginConfig>();
  const getMap = useCallback(() => {
    // 过滤深度子dom
    const newMap: SimilatorPluginCompDomMap =
      appActionRef.current?.getMap() || new Map();
    newMap.forEach((domList, k) => {
      const tmpList = [...domList];
      const newList = domList.filter((el) => {
        let tmp: HTMLElement | null = el.parentElement;
        let flag = false;
        while (!flag && tmp) {
          if (tmpList.some((d) => d === tmp)) {
            flag = true;
          } else {
            tmp = tmp.parentElement;
          }
        }
        return !flag;
      });
      newMap.set(k, newList);
    });
    mapRef.current = newMap;
    componentPickerRef.current.updateMap(newMap);
  }, []);
  const getMapRef = useRef(getMap);
  getMapRef.current = getMap;

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

  useEffect(() => {
    const picker = componentPickerRef.current;
    picker.startSelecting();
    return () => {
      picker.stopSelecting();
    };
  }, []);

  // 循环获取映射，原因：有些组件会异步改变状态或dom
  useEffect(() => {
    const timer = setInterval(() => {
      // TODO 使用requestAnimationFrame，防止页面掉帧
      getMapRef.current?.();
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!config) {
    return <div>没有配置</div>;
  }

  return (
    <div>
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
            onMount: () => {
              getMap();
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
            onMount: () => {
              getMap();
            },
          } as VueAppProps,
        }}
      />
    </div>
  );
};

export default Index;
