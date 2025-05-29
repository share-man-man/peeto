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
import { EXTENSION_LIB_TYPE } from '../../extension/ChangeProp';

interface BaseAppRenderProps {
  /**
   * 挂载根节点
   * @param root
   * @returns
   */
  onRootChange?: (root: AnyType) => void;
}

export interface AppRenderProps extends BaseAppRenderProps {
  type: EXTENSION_LIB_TYPE;
  [EXTENSION_LIB_TYPE.VUE3]?: {
    app: Component;
    props?: Record<string, AnyType>;
  };
  [EXTENSION_LIB_TYPE.REACT18]?: {
    app: FunctionComponent<AnyType> | ComponentClass<AnyType>;
    props?: Record<string, AnyType>;
  };
}

const React18Container = (
  props: BaseAppRenderProps & AppRenderProps[EXTENSION_LIB_TYPE.REACT18]
) => {
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
      createElement(propsRef.current.app, propsRef.current.props)
    );
    propsRef.current.onRootChange?.(appRef.current);
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

const Vue3Container = (
  props: BaseAppRenderProps & AppRenderProps[EXTENSION_LIB_TYPE.VUE3]
) => {
  const propsRef = useRef(props);
  propsRef.current = props;
  const appRef = useRef<App>();
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dom = domRef.current;
    if (!dom || !propsRef.current) {
      return;
    }
    appRef.current = createApp(propsRef.current.app, {
      ...propsRef.current.props,
    });
    appRef.current.mount(dom);
    propsRef.current.onRootChange?.(appRef.current);
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

/**
 * 将app挂载到dom上。不同的ui库类型，生命周期执行的函数会有所不同
 * @param param0
 * @returns
 */
const Index = ({ type, onRootChange, ...props }: AppRenderProps) => {
  let node: ReactNode;
  let validate: never;
  switch (type) {
    case EXTENSION_LIB_TYPE.REACT18:
      node = !props[type] ? null : (
        <React18Container onRootChange={onRootChange} {...props[type]} />
      );
      break;
    case EXTENSION_LIB_TYPE.VUE3:
      node = !props[type] ? null : (
        <Vue3Container onRootChange={onRootChange} {...props[type]} />
      );
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
