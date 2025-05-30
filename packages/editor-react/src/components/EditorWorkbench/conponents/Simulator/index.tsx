import { useContext, useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!reloadFlag) {
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
  }, [reloadFlag]);
  const containerRef = useRef<HTMLDivElement>(null);
  return <div ref={containerRef} />;
};

export default Index;
