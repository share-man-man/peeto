import { useContext, useEffect, useRef, useState } from 'react';
import { WorkBenchContext } from '../..';
import { EVENT_NAME, Extension } from '@peeto/extension';

/**
 * 顶部工具栏
 * @returns
 */
const Index = () => {
  const { editorRef: _editorRef, reloadFlag } = useContext(WorkBenchContext);
  const editorRef = useRef(_editorRef?.current);
  editorRef.current = _editorRef?.current;
  const [list, setList] = useState<
    {
      extension: Extension;
      topToolBarIcon: HTMLElement;
    }[]
  >([]);

  useEffect(() => {
    if (!reloadFlag) {
      return;
    }
    const li: typeof list = [];
    editorRef?.current?.extensionMap?.values().forEach((e) => {
      const topToolBar = e.topToolBar;
      const { mounted } = topToolBar.getStatus();
      if (!mounted) {
        const topToolBarIcon = e.config.topToolBarIcon?.({ extension: e });
        if (topToolBarIcon) {
          li.push({
            extension: e,
            topToolBarIcon,
          });
        }
        e.addEventListener(EVENT_NAME.TOP_TOOL_BAR_ACTIVE_CHANGE, () => {
          setList((prev) => [...prev]);
        });
      }
    });
    setList(li);
  }, [reloadFlag]);

  return (
    <div className="peeto-workbench-content-top-tool-bar">
      <div className="peeto-workbench-content-top-tool-bar-icons">
        {list.map(({ extension, topToolBarIcon }) => {
          return (
            <div
              className="peeto-workbench-content-top-tool-bar-icons-item"
              style={{
                fill: extension.topToolBar.getStatus().active ? 'red' : '',
              }}
              ref={(r: HTMLDivElement) => {
                if (r) {
                  r.innerHTML = '';
                  r.appendChild(topToolBarIcon);
                }
              }}
              key={extension.getName()}
              onClick={() => {
                const active = extension.topToolBar.getStatus().active;
                extension.changeTopToolBarActive(!active);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Index;
