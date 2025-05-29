import { useContext, useEffect, useRef, useState } from 'react';
import { WorkBenchContext } from '../..';
import { Extension } from '@peeto/extension';

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
    editorRef?.current?.extensionMap?.values().forEach((c) => {
      const topToolBarIcon = c.getTopToolBarIcon();
      if (topToolBarIcon) {
        li.push({
          extension: c,
          topToolBarIcon,
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
              style={{ fill: extension.topToolBarActive ? 'red' : '' }}
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
