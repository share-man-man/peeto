import {
  useRef,
  useEffect,
  FunctionComponent,
  ComponentClass,
  createElement,
  ReactNode,
} from 'react';
import { Root, createRoot } from 'react-dom/client';
import { App, Component, createApp } from 'vue';
import { AnyType } from '@peeto/core';
import { EXTENSION_LIB_TYPE } from '@peeto/extension';

export interface AppRenderProps {
  type: EXTENSION_LIB_TYPE;
  /**
   * 参数只有初始化加载时生效，没有响应式
   */
  vueProps?: {
    comp: Component;
    prop?: Record<string, AnyType>;
  };
  /**
   * 参数只有初始化加载时生效，没有响应式
   */
  reactProps?: {
    comp: FunctionComponent<AnyType> | ComponentClass<AnyType>;
    prop?: Record<string, AnyType>;
  };
}

const ReactRender = (props: AppRenderProps['reactProps']) => {
  const propsRef = useRef(props);
  propsRef.current = props;
  const appRef = useRef<Root>();
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dom = domRef.current;
    if (!dom || !propsRef.current) {
      return;
    }
    appRef.current = createRoot(domRef.current);
    appRef.current.render(
      createElement(propsRef.current.comp, propsRef.current.prop)
    );
    return () => {
      // 必须异步，原因：https://github.com/facebook/react/issues/25675
      setTimeout(() => {
        if (appRef.current) {
          appRef.current.unmount();
        }
      });
    };
  }, []);

  return <div ref={domRef}>react</div>;
};

const VueRender = (props: AppRenderProps['vueProps']) => {
  const propsRef = useRef(props);
  propsRef.current = props;
  const appRef = useRef<App>();
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dom = domRef.current;
    if (!dom || !propsRef.current) {
      return;
    }
    appRef.current = createApp(propsRef.current.comp, {
      ...propsRef.current.prop,
    });
    appRef.current.mount(dom);
    return () => {
      setTimeout(() => {
        if (appRef.current) {
          appRef.current.unmount();
        }
      });
    };
  }, []);

  return <div ref={domRef}>vue</div>;
};

const Index = ({ type, vueProps, reactProps }: AppRenderProps) => {
  let node: ReactNode;
  let validate: never;
  switch (type) {
    case EXTENSION_LIB_TYPE.REACT18:
      node = !reactProps?.comp ? null : <ReactRender {...reactProps} />;
      break;
    case EXTENSION_LIB_TYPE.VUE3:
      node = !vueProps?.comp ? null : <VueRender {...vueProps} />;
      break;
    default:
      validate = type;
      if (validate) {
        throw new Error('异常的类型');
      }
      break;
  }
  return node;
};

export default Index;
