import {
  createContext,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import LeftToolBar, { LeftToolBarRef } from './conponents/LeftToolBar';
import TopToolBar from './conponents/TopToolBar';
import { Editor } from '@peeto/editor';
import Simulator from './conponents/Simulator';

export const WorkBenchContext = createContext<{
  editorRef?: MutableRefObject<Editor | undefined>;
  reloadFlag: number;
}>({ reloadFlag: 0 });

/**
 * 插件图标点击事件
 */
export const WORK_BENCH_ICON_CLICK_EVENT =
  '__peeto_work_bench_icon_click_event';

export interface useEditorWokrBenchProps {
  onInitSuccess?: () => void;
}

// 参考 https://code.visualstudio.com/api/extension-capabilities/extending-workbench

export const useEditorWokrBench = ({
  onInitSuccess,
}: useEditorWokrBenchProps) => {
  // 初始化标志
  const [initLoading, setInitLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);
  const reload = useCallback(() => {
    setReloadFlag((pre) => {
      // // 重新渲染
      return pre > 10 ? pre - 1 : pre + 1;
    });
  }, []);
  const reloadRef = useRef(reload);
  reloadRef.current = reload;
  const editorRef = useRef<Editor>();
  useEffect(() => {
    editorRef.current = new Editor({
      onMounted: async () => {
        setInitLoading(false);
      },
      onInjectSuccess: async () => {
        // reloadRef.current?.();
      },
    });
  }, []);

  const leftToolBarRef = useRef<LeftToolBarRef>({
    onActive: () => {
      //
    },
  });

  // 渲染的ui
  const workbench = useMemo(() => {
    if (initLoading || !reloadFlag) {
      // TODO 可自定义加载中文案
      return <div>editor-init-loading</div>;
    }
    return (
      <WorkBenchContext.Provider value={{ editorRef, reloadFlag }}>
        <div className="peeto-workbench">
          <LeftToolBar customRef={leftToolBarRef} />
          <div className="peeto-workbench-content">
            <TopToolBar />
            <div className="peeto-workbench-content-simulator">
              <div className="peeto-workbench-content-simulator-content">
                {/* 悬浮工具栏 */}
                {/* <SuspenseToolBarRender /> */}
                {/* 模拟器工具栏 */}
                <Simulator />
              </div>
            </div>
            {/* <div className="peeto-workbench-content-footer">Footer</div> */}
          </div>
          {/* <div>右侧工具栏</div> */}
        </div>
      </WorkBenchContext.Provider>
    );
  }, [initLoading, reloadFlag]);

  const onInitSuccessRef = useRef(onInitSuccess);
  onInitSuccessRef.current = onInitSuccess;
  useEffect(() => {
    if (initLoading) return;
    onInitSuccessRef.current?.();
  }, [initLoading]);

  return {
    initLoading,
    editor: editorRef.current,
    workbench,
    onReload: reloadRef.current,
    leftToolBarRef,
    // // 需要绑定到editor实例，否则外部调用injectExtension时，injectExtension里获取不到this
    // injectExtension: editor.current.injectExtension.bind(editor.current),
  };
};
