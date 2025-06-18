import { useContext, useEffect, useRef } from 'react';
import { WorkBenchContext } from '../..';

const Index = () => {
  const { editorRef: _editorRef, reloadFlag } = useContext(WorkBenchContext);
  const editorRef = useRef(_editorRef?.current);
  editorRef.current = _editorRef?.current;

  useEffect(() => {
    if (!reloadFlag) {
      return;
    }
    if (!containerRef.current) {
      return;
    }
    // 清空panel的dom
    while (containerRef.current?.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    editorRef.current?.extensionMap?.values().forEach((e) => {
      const suspenseToolBar = e.suspenseToolBar;
      const { mounted } = suspenseToolBar.getStatus();
      // 没有挂载的组件，才执行挂载
      if (!mounted) {
        const dom = suspenseToolBar.getDom();
        containerRef.current?.appendChild(dom);
        e.config.lifeCycleHooks.suspenseToolBarMounted?.({
          dom,
          extension: e,
        });
      } else {
        suspenseToolBar.changeActive(true);
      }
    });
  }, [reloadFlag]);
  const containerRef = useRef<HTMLDivElement>(null);
  return <div ref={containerRef} />;
};

export default Index;
