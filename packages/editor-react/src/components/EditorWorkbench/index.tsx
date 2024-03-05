import 'element-plus/dist/index.css';

import { useLayoutEffect, useRef } from 'react';

import { WorkBenchProps } from './type';

import {
  SIMILATOR_MAP_EVENT_KEY,
  SIMILATOR_CONFIG_SET_EVENT_KEY,
  SIMILATOR_REQUEST_EVENT_KEY,
} from './util';
import EditorSimilator from '../EditorSimilator';

const Index = (props: WorkBenchProps) => {
  const propsRef = useRef(props);
  propsRef.current = props;
  const similatorRef = useRef<HTMLDivElement>(null);

  // 通知模拟器，配置更新了
  useLayoutEffect(() => {
    const similatorContainerDom = similatorRef.current;
    similatorContainerDom?.dispatchEvent(
      new CustomEvent(SIMILATOR_CONFIG_SET_EVENT_KEY, {
        detail: props,
      })
    );
  }, [props]);

  useLayoutEffect(() => {
    const similatorContainerDom = similatorRef.current;
    // 组件和真实dom的映射关系改变
    const onDomMapChange = (e: Event) => {
      console.log('映射关系', (e as CustomEvent)?.detail);
    };
    // 模拟器请求事件
    const onSimilatorRequest = (e: Event) => {
      (
        (e as CustomEvent).detail as {
          // 模拟器获取配置
          getConfig?: (c: WorkBenchProps) => void;
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

  return (
    <div>
      <div>工具栏</div>
      {/* 模拟器 */}
      <div ref={similatorRef}>
        <EditorSimilator type={props.type} />
      </div>
      <div>配置器</div>
    </div>
  );
};

export default Index;
