import { AnyType } from '@peeto/parse';
import { useEffect } from 'react';
import { InjectPluginCompProps } from '../../../EditorWorkbench/type';

export interface ReactWrapProps {
  Comp: AnyType;
  childProp: AnyType;
  onMount: InjectPluginCompProps['onMount'];
}

const Index = ({ Comp, childProp, onMount }: ReactWrapProps) => {
  // 必须使用useEffect，如果使用useLayoutEffect，会比子组件的useEffect先执行，导致还未订阅事件，组件就加载了
  useEffect(() => {
    onMount();
  }, [onMount]);

  return <Comp {...childProp} />;
};

export default Index;
