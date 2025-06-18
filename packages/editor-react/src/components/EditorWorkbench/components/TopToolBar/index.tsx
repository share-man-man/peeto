import { useContext, useEffect, useRef, useState } from 'react';
import { WorkBenchContext } from '../..';
import { Extension } from '@peeto/extension';

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
                extension.changeTopToolBarActive();
                setList((prev) => [...prev]);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Index;
