import {
  useRef,
  useState,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
import { Root, createRoot } from 'react-dom/client';
import { App, createApp } from 'vue';
import { WorkBenchProps } from '../EditorWorkbench/type';
import { EDITOR_LIB_TYPE } from '../../type';
import ReactApp from '../ReactApp';
import VueApp from '../VueApp/App.vue';

const Index = ({ type }: Pick<WorkBenchProps, 'type'>) => {
  const vueAppDomRef = useRef<HTMLDivElement>(null);
  const vueAppRef = useRef<App>();
  const reactAppDomRef = useRef<HTMLDivElement>(null);
  const reactAppRef = useRef<Root>();
  const [child, setChild] = useState<ReactNode>(<div>当前版本:{type}</div>);

  const editorStrategy = useMemo<{
    [k in EDITOR_LIB_TYPE]: {
      dom: ReactNode;
      onCurType: () => void;
      onNotCurType: () => void;
    };
  }>(
    () => ({
      [EDITOR_LIB_TYPE.VUE]: {
        dom: <div ref={vueAppDomRef}>vue</div>,
        onCurType: () => {
          const dom = vueAppDomRef.current;
          if (dom) {
            vueAppRef.current = createApp(VueApp, {});
            vueAppRef.current.mount(dom);
          }
        },
        onNotCurType: () => {
          if (vueAppRef.current) {
            vueAppRef.current.unmount();
            vueAppRef.current = undefined;
          }
        },
      },
      [EDITOR_LIB_TYPE.REACT]: {
        dom: <div ref={reactAppDomRef}>react</div>,
        onCurType: () => {
          const dom = reactAppDomRef.current;
          if (dom) {
            reactAppRef.current = createRoot(dom);
            reactAppRef.current.render(<ReactApp />);
          }
        },
        onNotCurType: () => {
          if (reactAppRef.current) {
            reactAppRef.current.unmount();
            reactAppRef.current = undefined;
          }
        },
      },
    }),
    []
  );

  const curItem = useMemo(() => {
    if (type) {
      return editorStrategy[type];
    }
  }, [editorStrategy, type]);

  useEffect(() => {
    setChild(curItem?.dom);
  }, [curItem?.dom]);

  useLayoutEffect(() => {
    if (!child) {
      return;
    }

    Object.keys(editorStrategy).forEach((k) => {
      const curType = k as EDITOR_LIB_TYPE;
      if (type === curType) {
        curItem?.onCurType();
      } else {
        curItem?.onNotCurType();
      }
    });
  }, [child, curItem, editorStrategy, type]);

  return child;
};

export default Index;
