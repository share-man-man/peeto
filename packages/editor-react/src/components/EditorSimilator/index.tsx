import { useRef, useLayoutEffect, useMemo } from 'react';
import { EditorWorkbenchProps } from '../EditorWorkbench/type';
import ReactApp from '../ReactApp';
import VueApp from '../VueApp/App.vue';
import {
  SIMILATOR_DISPATCH_EVENT_KEY,
  SIMILATOR_MAP_EVENT_KEY,
  SIMILATOR_REQUEST_EVENT_KEY,
} from '../EditorWorkbench/util';
import {
  EditorSimilatorAppProps,
  EditorSimilatorCompDomMap,
  EditorSimilatorDispatchProps,
  EditorSimilatorProps,
} from './type';
import useApp from '../../hooks/useApp';

const Index = (originProps: EditorSimilatorProps) => {
  const { type, onMapChange } = originProps;
  const props = useMemo<EditorSimilatorAppProps>(
    () => ({
      delay: originProps.delay || 100,
      packageList: originProps.packageList,
      schemaStr: originProps.schemaStr,
    }),
    [originProps.delay, originProps.packageList, originProps.schemaStr]
  );
  const propsRef = useRef(props);
  propsRef.current = props;
  const onMapChangeRef = useRef(originProps.onMapChange);
  onMapChangeRef.current = onMapChange;
  const similatorRef = useRef<HTMLDivElement>(null);

  // TODO 通信可通过创建app时传入的参数实现
  // 通知模拟器，配置更新了
  useLayoutEffect(() => {
    const similatorContainerDom = similatorRef.current;
    similatorContainerDom?.dispatchEvent(
      new CustomEvent<EditorSimilatorDispatchProps>(
        SIMILATOR_DISPATCH_EVENT_KEY,
        {
          detail: {
            type: 'config',
            paylod: props,
          },
        }
      )
    );
  }, [props]);

  useLayoutEffect(() => {
    const similatorContainerDom = similatorRef.current;
    // 组件和真实dom的映射关系改变
    const onDomMapChange = (e: Event) => {
      const map = (e as CustomEvent)?.detail as EditorSimilatorCompDomMap;
      onMapChangeRef.current?.(map);
    };
    // 模拟器请求事件
    const onSimilatorRequest = (e: Event) => {
      (
        (e as CustomEvent).detail as {
          // 模拟器获取配置
          getConfig?: (c: EditorWorkbenchProps) => void;
        }
      )?.getConfig?.(propsRef.current);
    };
    similatorContainerDom?.addEventListener(
      SIMILATOR_MAP_EVENT_KEY,
      onDomMapChange
    );
    similatorContainerDom?.addEventListener(
      SIMILATOR_REQUEST_EVENT_KEY,
      onSimilatorRequest
    );

    return () => {
      similatorContainerDom?.removeEventListener(
        SIMILATOR_MAP_EVENT_KEY,
        onDomMapChange
      );
      similatorContainerDom?.removeEventListener(
        SIMILATOR_REQUEST_EVENT_KEY,
        onSimilatorRequest
      );
    };
  }, []);

  const { child } = useApp({
    type,
    vueProps: {
      comp: VueApp,
      prop: {},
    },
    reactProps: {
      comp: ReactApp,
      prop: {},
    },
  });

  return <div ref={similatorRef}>{child}</div>;
};

export default Index;
