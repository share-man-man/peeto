import Editor from '@peeto/editor';
import { Extension } from '@peeto/extension';
import { useEffect, useRef, useState } from 'react';
import { API_CONFIG_CHANGE } from '../Simulator';
import { SimulatorConfigType } from '../Simulator/type';

export const name = 'EXTENSION_EDIT_COMP';
export const API_COMP_CHECK = 'API_COMP_CHECK';

const Index = ({
  extension,
  editor,
}: {
  editor: Editor;
  extension: Extension;
}) => {
  const extensionRef = useRef(extension);
  extensionRef.current = extension;
  const [curConfig, setCurConfig] = useState<SimulatorConfigType>();

  extension.setApi(API_COMP_CHECK, (compList: string[]) => {
    console.log(editor, curConfig, compList);
    // TODO 解析schema，获取组件配置
  });
  extension.setApi(API_CONFIG_CHANGE, (c: SimulatorConfigType) => {
    console.log(c);

    setCurConfig(c);
  });

  useEffect(() => {
    extensionRef.current.suspenseToolBar.onMounted();
  }, []);

  return <div>编辑组件配置</div>;
};

export default Index;
