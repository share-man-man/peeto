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
export const generateKey = () => `__peeto_simulator_${id()}`;

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

  const extensionRef = useRef(extension);
  extensionRef.current = extension;
  useEffect(() => {
    extensionRef.current.simulator.onMounted();
  }, []);

  const appActionRef = useRef<AppActionRef>();
  useEffect(() => {
    if (!config) {
      return;
    }
    appActionRef.current?.setConfig(config);
  }, [config]);

  if (!config?.type) {
    return <div>没有选择ui库</div>;
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
            },
          } as ReactAppProps,
        },
        [EXTENSION_LIB_TYPE.VUE3]: {
          app: VueApp,
          props: {
            peetoPrivateKey,
            actionRef: (ctx) => {
              appActionRef.current = ctx;
            },
          } as VueAppProps,
        },
      }}
    />
  );
};

export default Index;
