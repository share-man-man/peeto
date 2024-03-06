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
  const vueAppDomRef = useRef<HTMLDivElement>(null);
  const vueAppRef = useRef<App>();
  const reactAppDomRef = useRef<HTMLDivElement>(null);
  const reactAppRef = useRef<Root>();
  const [child, setChild] = useState<ReactNode>(<div>当前版本:{type}</div>);

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

  return (
    <div ref={similatorRef} onClick={() => {}}>
      {child}
    </div>
  );
};

export default Index;
