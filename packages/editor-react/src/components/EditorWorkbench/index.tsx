import 'element-plus/dist/index.css';

import { createRoot } from 'react-dom/client';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { createApp } from 'vue';
import { WorkBenchProps } from './type';
import { EDITOR_LIB_TYPE } from '../../type';
import ReactApp from '../ReactApp';
import VueApp from '../VueApp/App.vue';
import {
  VUE_APP_ID,
  REACT_APP_ID,
  SIMILATOR_SCHEMA_KEY,
  SIMILATOR_MAP_EVENT_KEY,
} from './util';

const Index = ({ type, schemaStr }: WorkBenchProps) => {
  const similatorRef = useRef<HTMLDivElement>(null);
  const [child, setChild] = useState<ReactNode>(<div>当前版本:{type}</div>);
  useEffect(() => {
    if (type === EDITOR_LIB_TYPE.VUE) {
      setChild(<div id={VUE_APP_ID}>vue</div>);
    }
    if (type === EDITOR_LIB_TYPE.REACT) {
      setChild(<div id={REACT_APP_ID}>react</div>);
    }
  }, [type]);

  useLayoutEffect(() => {
    if (!child || !similatorRef.current) {
      return;
    }

    if (type === EDITOR_LIB_TYPE.VUE) {
      const dom = document.getElementById(VUE_APP_ID);
      if (dom) {
        const app = createApp(VueApp);
        app.mount(dom);
      }
    }

    if (type === EDITOR_LIB_TYPE.REACT) {
      const dom = document.getElementById(REACT_APP_ID);
      if (dom) {
        const app = createRoot(dom);
        app.render(<ReactApp />);
      }
    }

    return () => {
      // TODO 研究是否需要unmount
      // if (VUE_APP_OBJ) {
      //   VUE_APP_OBJ.unmount();
      //   VUE_APP_OBJ = null;
      // }
      // if (REACT_APP_OBJ) {
      //   REACT_APP_OBJ.unmount();
      //   REACT_APP_OBJ = null;
      // }
    };
  }, [child, type]);

  useLayoutEffect(() => {
    const similatorDom = similatorRef.current;
    // 设置schema，供画布子组件渲染
    similatorDom?.setAttribute(SIMILATOR_SCHEMA_KEY, schemaStr);
    // 监听特定事件，获取组件和真实dom的映射关系
    const callBack = (e: Event) => {
      console.log('映射关系', (e as CustomEvent)?.detail);
    };
    similatorDom?.addEventListener(SIMILATOR_MAP_EVENT_KEY, callBack);

    return () => {
      similatorDom?.removeEventListener(SIMILATOR_MAP_EVENT_KEY, callBack);
    };
  }, [schemaStr]);

  return (
    <div>
      <div>工具栏</div>
      {/* 模拟器 */}
      <div ref={similatorRef}>{child}</div>
      <div>配置器</div>
    </div>
  );
};

export default Index;
