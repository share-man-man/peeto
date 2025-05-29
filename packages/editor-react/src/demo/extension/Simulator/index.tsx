import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Extension } from '@peeto/extension';
import { v4 as id } from 'uuid';
import MountAppByType from '../../components/MountAppByType';
import ReactApp from './components/ReactApp';
import { ReactAppProps } from './components/ReactApp/type';
import VueApp from './components/VueApp/App.vue';
import { VueAppProps } from './components/VueApp/type';
import { AppActionRef, SimulatorConfigType } from './type';
import { EXTENSION_LIB_TYPE } from '../ChangeProp';

export const name = 'SimulatorExtension';
export const API_CONFIG_CHANGE = 'API_CONFIG_CHANGE';
export const API_GET_STATE = 'API_GET_STATE';

/**
 * 生成唯一key
 * @returns
 */
export const generateKey = () => `__peeto_similator_${id()}`;

const Index = ({ extension }: { extension: Extension }) => {
  const [config, setConfig] = useState<SimulatorConfigType>();
  const appRootRef = useRef();
  const peetoPrivateKey = useMemo(() => generateKey(), []);

  // api：配置改变
  const onChangeConfig = useCallback((c: SimulatorConfigType) => {
    setConfig(c);
  }, []);
  // api：获取状态
  const getState = useCallback(
    () => ({ config, root: appRootRef.current, peetoPrivateKey }),
    [config, peetoPrivateKey]
  );

  extension.setApi(API_CONFIG_CHANGE, onChangeConfig);
  extension.setApi(API_GET_STATE, getState);

  // const getMap = useCallback(() => {
  //   // 过滤深度子dom
  //   const newMap: SimulatorExtensionCompDomMap =
  //     appActionRef.current?.getMap() || new Map();
  //   newMap.forEach((domList, k) => {
  //     const tmpList = [...domList];
  //     const newList = domList.filter((el) => {
  //       let tmp: HTMLElement | null = el.parentElement;
  //       let flag = false;
  //       while (!flag && tmp) {
  //         if (tmpList.some((d) => d === tmp)) {
  //           flag = true;
  //         } else {
  //           tmp = tmp.parentElement;
  //         }
  //       }
  //       return !flag;
  //     });
  //     newMap.set(k, newList);
  //   });
  //   // dispatchEvent([
  //   //   {
  //   //     name: compDomMapChangeEventName,
  //   //     paylod: newMap,
  //   //   },
  //   // ]);
  // }, []);

  // const getMapRef = useRef(getMap);
  // getMapRef.current = getMap;

  const appActionRef = useRef<AppActionRef>();
  useEffect(() => {
    if (!config) {
      return;
    }
    appActionRef.current?.setConfig(config);
  }, [config]);

  if (!config?.type) {
    return <div>没有类型</div>;
  }

  return (
    <MountAppByType
      type={config.type}
      onRootChange={(r) => {
        appRootRef.current = r;
      }}
      {...{
        [EXTENSION_LIB_TYPE.REACT18]: {
          app: ReactApp,
          props: {
            peetoPrivateKey,
            actionRef: (ctx) => {
              appActionRef.current = ctx;
              // 手动调用一次setConfig，初始化配置
              appActionRef.current?.setConfig(config);
            },
            // onMount: () => {
            //   getMap();
            // },
          } as ReactAppProps,
        },
        [EXTENSION_LIB_TYPE.VUE3]: {
          app: VueApp,
          props: {
            peetoPrivateKey,
            actionRef: (ctx) => {
              appActionRef.current = ctx;
              // 手动调用一次setConfig，初始化配置
              appActionRef.current?.setConfig(config);
            },
            // onMount: () => {
            //   getMap();
            // },
          } as VueAppProps,
        },
      }}
    />
  );
};

export default Index;
