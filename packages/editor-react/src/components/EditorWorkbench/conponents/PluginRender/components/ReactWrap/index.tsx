import { AnyType } from '@peeto/parse';
import { useEffect, useRef } from 'react';
import { PluginRenderProps } from '../../../../type';

export interface ReactWrapProps {
  comp: AnyType;
  compProp: AnyType;
  onMount: PluginRenderProps['lifeCycleHooks']['onMount'];
}

const Index = ({ comp: Comp, compProp, onMount }: ReactWrapProps) => {
  const onMountRef = useRef(onMount);
  onMountRef.current = onMount;
  // 必须使用useEffect，如果使用useLayoutEffect，会比子组件的useEffect先执行，导致还未订阅事件，组件就加载了
  useEffect(() => {
    onMountRef.current?.();
  }, []);

  return <Comp {...compProp} />;
};

export default Index;
