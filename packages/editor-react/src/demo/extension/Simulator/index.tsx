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
import { API_CONFIG_CHANGE, API_GET_STATE } from '../common';

export const name = 'SimulatorExtension';

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
    // 只是改变config.schemaStr时，才会生效
    appActionRef.current?.setConfig(config);
  }, [config]);

  if (!config?.type) {
    return <div>没有选择ui库</div>;
  }

  return (
    <MountAppByType
      type={config?.type}
      onRootChange={(r) => {
        // 存储root，便于其他扩展解析组件树
        appRootRef.current = r;
      }}
      {...{
        [EXTENSION_LIB_TYPE.REACT18]: {
          app: ReactApp,
          props: {
            peetoPrivateKey,
            actionRef: (ctx) => {
              appActionRef.current = ctx;
              // 改变config.type时，上面的useEffect会先于渲染调用，导致无法正确渲染。需要等到type改变且渲染完成后，手动告诉app参数改变了
              appActionRef.current?.setConfig(config);
            },
          } as ReactAppProps,
        },
        [EXTENSION_LIB_TYPE.VUE3]: {
          app: VueApp,
          props: {
            peetoPrivateKey,
            actionRef: (ctx) => {
              appActionRef.current = ctx;
              // 改变config.type时，上面的useEffect会先于渲染调用，导致无法正确渲染。需要等到type改变且渲染完成后，手动告诉app参数改变了
              appActionRef.current?.setConfig(config);
            },
          } as VueAppProps,
        },
      }}
    />
  );
};

export default Index;
