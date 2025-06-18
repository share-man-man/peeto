import {
  FC,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { WorkBenchContext } from '../..';
import { Extension } from '@peeto/extension';

export interface LeftToolBarRenderProps {
  customRef?: MutableRefObject<LeftToolBarRef | undefined>;
}

export interface LeftToolBarRef {
  onActive: (k: Extension['name']) => void;
}

/**
 * 左侧工具栏
 * @param param0
 * @returns
 */
const Index: FC<LeftToolBarRenderProps> = ({ customRef }) => {
  const { editorRef: _editorRef, reloadFlag } = useContext(WorkBenchContext);
  const editorRef = useRef(_editorRef?.current);
  editorRef.current = _editorRef?.current;
  const [curName, setCurName] = useState<string>();
  const panelRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState<
    {
      extension: Extension;
      acvitityBarIcon: HTMLElement;
    }[]
  >([]);
  useEffect(() => {
    if (!reloadFlag) {
      return;
    }
    const li: typeof list = [];
    editorRef?.current?.extensionMap?.values().forEach((c) => {
      const acvitityBarIcon = c.getActivityBarIcon();
      if (acvitityBarIcon) {
        li.push({
          extension: c,
          acvitityBarIcon,
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
    if (!curName) {
      return;
    }
    if (!panelRef.current) {
      return;
    }
    const ex = editorRef.current?.getExtensionByName(curName);
    const panel = ex?.panel;
    if (!ex || !panel) {
      return;
    }
    const dom = panel?.getDom();
    // 清空panel的dom
    while (panelRef.current?.firstChild) {
      panelRef.current.removeChild(panelRef.current.firstChild);
    }
    panelRef.current.appendChild(dom);
    const { mounted } = panel.getStatus();
    if (!mounted) {
      ex.config.lifeCycleHooks.panelMounted?.({ dom, extension: ex });
    } else {
      panel.changeActive(true);
    }
  }, [curName]);

  if (customRef?.current) {
    customRef.current.onActive = (k) => {
      onClickIcon(k);
    };
  }

  return (
    <div className="peeto-workbench-left-tool-bar">
      <div className="peeto-workbench-left-tool-bar-icons">
        {list.map(({ extension, acvitityBarIcon }) => {
          return (
            <div
              ref={(r: HTMLDivElement) => {
                if (r) {
                  r.innerHTML = '';
                  r.appendChild(acvitityBarIcon);
                }
              }}
              key={extension.getName()}
              onClick={() => {
                const name = extension.getName();
                onClickIcon(name === curName ? undefined : name);
              }}
            />
          );
        })}
      </div>

      {curName && (
        <div
          className="peeto-workbench-left-tool-bar-panel"
          ref={panelRef}
          onClick={(e) => {
            e.stopPropagation();
            // 不能阻止默认点击，否则panel里面的Radio需要精准点击圆圈正中间才能触发onChange
            // e.preventDefault();
          }}
        />
      )}
    </div>
  );
};

export default Index;
