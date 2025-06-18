import {
  createContext,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import LeftToolBar, { LeftToolBarRef } from './components/LeftToolBar';
import TopToolBar from './components/TopToolBar';
import { Editor } from '@peeto/editor';
import Simulator from './components/Simulator';
import { EditorWorkbenchProps } from './type';
import SuspenseToolBar from './components/SuspenseToolBar';

export const WorkBenchContext = createContext<{
  editorRef?: MutableRefObject<Editor | undefined>;
  reloadFlag: number;
}>({ reloadFlag: 0 });

// 参考 https://code.visualstudio.com/api/extension-capabilities/extending-workbench

export const EditorWokrBench = ({ actionRef }: EditorWorkbenchProps) => {
  const [init, setInit] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const reloadRef = useRef(() => {
    setReloadFlag((f) => (f > 10 ? f + 1 : f - 1));
  });
  const [editor, setEditor] = useState<Editor>();
  const editorRef = useRef<Editor>();
  const mountResolveRef = useRef<() => void>();
  const onMounted = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (init) {
        resolve();
        mountResolveRef.current = undefined;
      } else {
        mountResolveRef.current = resolve;
      }
    });
  }, [init]);

  useEffect(() => {
    const e = new Editor({
      onMounted: async () => {},
      onInjectSuccess: async () => {
        // setReloadFlag((p) => p + 1);
      },
    });
    editorRef.current = e;
    setEditor(e);
    setInit(true);
  }, []);

  useEffect(() => {
    if (init) {
      mountResolveRef.current?.();
      mountResolveRef.current = undefined;
    }
  }, [init]);

  const leftToolBarRef = useRef<LeftToolBarRef>({
    onActive: () => {
      //
    },
  });

  useImperativeHandle(
    actionRef,
    () => {
      return {
        onMounted,
        editor,
        leftToolBarRef,
        reload: reloadRef.current,
      };
    },
    [editor, onMounted]
  );

  return (
    <WorkBenchContext.Provider
      value={{
        editorRef,
        reloadFlag,
      }}
    >
      <div className="peeto-workbench">
        <LeftToolBar customRef={leftToolBarRef} />
        <div className="peeto-workbench-content">
          <TopToolBar />
          <div className="peeto-workbench-content-simulator">
            <div className="peeto-workbench-content-simulator-content">
              {/* 悬浮工具栏 */}
              <SuspenseToolBar />
              {/* 模拟器工具栏 */}
              <Simulator />
            </div>
          </div>
        </div>
      </div>
    </WorkBenchContext.Provider>
  );
};
