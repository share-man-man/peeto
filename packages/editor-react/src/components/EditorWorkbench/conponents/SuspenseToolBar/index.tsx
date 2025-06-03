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
      e.handleSuspenseToolBarMounted();
      const dom = e.getSuspenseToolBarContainer();
      if (dom) {
        containerRef.current?.appendChild(dom);
      }
    });
  }, [reloadFlag]);
  const containerRef = useRef<HTMLDivElement>(null);
  return <div ref={containerRef} />;
};

export default Index;
