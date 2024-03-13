import {
  useRef,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useLayoutEffect,
  FunctionComponent,
  ComponentClass,
  createElement,
} from 'react';
import { Root, createRoot } from 'react-dom/client';
import { App, Component, createApp } from 'vue';
import { EDITOR_LIB_TYPE } from '../type';
import { AnyType } from '@peeto/parse';

export type useAppProps = {
  type: EDITOR_LIB_TYPE;
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
    comp: FunctionComponent | ComponentClass;
    prop?: Record<string, AnyType>;
  };
};

const Index = ({ type, vueProps, reactProps }: useAppProps) => {
  const vueAppDomRef = useRef<HTMLDivElement>(null);
  const vueAppRef = useRef<App>();
  const reactAppDomRef = useRef<HTMLDivElement>(null);
  const reactAppRef = useRef<Root>();
  const [child, setChild] = useState<ReactNode>();
  const vuePropsRef = useRef(vueProps);
  vuePropsRef.current = vueProps;
  const reactPropsRef = useRef(reactProps);
  reactPropsRef.current = reactProps;

  // 不同ui库，挂载、渲染方式不同
  const editorStrategy = useMemo<{
    [k in EDITOR_LIB_TYPE]: {
      dom: ReactNode;
      onMount: () => void;
      onUnMountCurType: () => void;
    };
  }>(
    () => ({
      [EDITOR_LIB_TYPE.VUE]: {
        dom: <div ref={vueAppDomRef}>vue</div>,
        onMount: () => {
          const dom = vueAppDomRef.current;
          if (dom && vuePropsRef.current?.comp) {
            vueAppRef.current = createApp(vuePropsRef.current.comp, {
              ...vuePropsRef.current.prop,
            });
            vueAppRef.current.mount(dom);
          }
        },
        onUnMountCurType: () => {
          if (vueAppRef.current) {
            vueAppRef.current.unmount();
            vueAppRef.current = undefined;
          }
        },
      },
      [EDITOR_LIB_TYPE.REACT]: {
        dom: <div ref={reactAppDomRef}>react</div>,
        onMount: () => {
          const dom = reactAppDomRef.current;
          if (dom && reactPropsRef.current?.comp) {
            reactAppRef.current = createRoot(dom);
            reactAppRef.current.render(
              createElement(
                reactPropsRef.current.comp,
                reactPropsRef.current?.prop
              )
            );
          }
        },
        onUnMountCurType: () => {
          if (reactAppRef.current) {
            reactAppRef.current.unmount();
            reactAppRef.current = undefined;
          }
        },
      },
    }),
    []
  );

  useEffect(() => {
    if (type) {
      setChild(editorStrategy[type].dom);
    }
  }, [editorStrategy, type]);

  useLayoutEffect(() => {
    if (!child) {
      return;
    }
    // 清空所有挂载
    Object.keys(editorStrategy).forEach((k) => {
      const curType = k as EDITOR_LIB_TYPE;
      if (type !== curType) {
        editorStrategy[curType].onUnMountCurType;
      }
    });
    // 执行挂载
    editorStrategy[type].onMount();
    return () => {
      // 必须异步，原因：https://github.com/facebook/react/issues/25675
      setTimeout(() => {
        editorStrategy[type].onUnMountCurType();
      });
    };
  }, [child, editorStrategy, type]);

  return { child };
};

export default Index;
