import { useContext, useEffect, useRef, useState } from 'react';
import { WorkBenchContext } from '../..';
import { Extension } from '@peeto/extension';

/**
 * 模拟器
 * @returns
 */
const Index = () => {
  const { editorRef: _editorRef, reloadFlag } = useContext(WorkBenchContext);
  const editorRef = useRef(_editorRef?.current);
  editorRef.current = _editorRef?.current;
  const simulatorExtension = useRef<Extension>();
  const containerRef = useRef<HTMLDivElement>(null);

  const [hasInit, setHasInit] = useState(false);

  useEffect(() => {
    if (!reloadFlag || hasInit) {
      return;
    }
    editorRef.current?.extensionMap?.values().forEach((e) => {
      if (e.config.lifeCycleHooks.simulatorMounted) {
        simulatorExtension.current = e;
      }
    });

    const ex = simulatorExtension.current;
    const dom = containerRef.current;
    if (!ex || !dom) {
      return;
    }
    ex.config.lifeCycleHooks.simulatorMounted?.({
      dom: containerRef.current,
      extension: ex,
    });
    setHasInit(true);
  }, [hasInit, reloadFlag]);

  return <div ref={containerRef} />;
};

export default Index;
