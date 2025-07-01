import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { WorkBenchContext } from '../..';
import { Extension } from '@peeto/extension';

export interface RightToolBarRenderProps {
  customRef?: MutableRefObject<RightToolBarRef | undefined>;
}

export interface RightToolBarRef {
  onActive: (k: Extension['name']) => void;
}

const Index = ({ customRef }: RightToolBarRenderProps) => {
  const { editorRef: _editorRef, reloadFlag } = useContext(WorkBenchContext);
  const editorRef = useRef(_editorRef?.current);
  editorRef.current = _editorRef?.current;

  const [curName, setCurName] = useState<string>();
  const panelRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<
    {
      extension: Extension;
    }[]
  >([]);
  useEffect(() => {
    if (!reloadFlag) {
      return;
    }
    const li: typeof list = [];
    editorRef?.current?.extensionMap?.values().forEach((c) => {
      const { rightToolPanelMounted } = c.config.lifeCycleHooks;
      if (rightToolPanelMounted) {
        li.push({
          extension: c,
        });
      }
    });
    setList(li);
  }, [reloadFlag]);

  const onClickIcon = useCallback<(k?: Extension['name']) => void>((k) => {
    setCurName((pre) => {
      if (pre) {
        editorRef.current?.getExtensionByName(pre)?.panel.changeActive(false);
      }
      return k;
    });
  }, []);
  const onClickIconRef = useRef(onClickIcon);
  onClickIconRef.current = onClickIcon;

  useEffect(() => {
    if (!panelRef.current) {
      return;
    }
    // 清空panel的dom
    while (panelRef.current?.firstChild) {
      panelRef.current.removeChild(panelRef.current.firstChild);
    }
    if (!curName) {
      return;
    }
    const ex = editorRef.current?.getExtensionByName(curName);
    const panel = ex?.rightToolPanel;
    if (!ex || !panel) {
      return;
    }
    const dom = panel?.getDom();
    panelRef.current.appendChild(dom);
    const { mounted } = panel.getStatus();
    if (!mounted) {
      ex.config.lifeCycleHooks.rightToolPanelMounted?.({ dom, extension: ex });
    } else {
      panel.changeActive(true);
    }
  }, [curName]);

  if (customRef?.current) {
    customRef.current.onActive = (k) => {
      onClickIcon(k);
    };
  }

  if (!curName) {
    return null;
  }

  return (
    <div className="peeto-workbench-right-tool-panel">
      <div className="peeto-workbench-right-tool-panel-content" ref={panelRef}>
        右侧工具栏
      </div>
    </div>
  );
};

export default Index;
