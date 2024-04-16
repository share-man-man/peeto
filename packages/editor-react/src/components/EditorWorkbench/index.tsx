import { useCallback, useMemo, useRef, useState } from 'react';
import LeftToolBar from './conponents/LeftToolBar';
import SimilatorRender from './conponents/SimilatorRender';
import { Plugin } from '@peeto/editor';

export const useEditorWokrBench = () => {
  const [injectLoading, setInjectLoading] = useState(false);
  const pluginRef = useRef(
    new Plugin({
      onAllMount: () => {
        setInjectLoading(false);
      },
    })
  );
  // 渲染的ui
  const workbench = useMemo(() => {
    if (injectLoading) {
      // TODO 加载中文案
    }
    return (
      // TODO 判断list长度，决定是否隐藏相关模块
      <div className="workbench">
        <LeftToolBar list={[...pluginRef.current.leftToolBarPluginList]} />
        <div className="workbench-content">
          <div className="workbench-content-top-tool-bar">
            <div className="workbench-content-top-tool-bar-left">
              顶部工具栏:{pluginRef.current.topToolBarPluginList.length}
            </div>
          </div>
          <div className="workbench-content-similator">
            <div className="workbench-content-similator-content">
              {/* 悬浮工具栏 模拟器工具栏 */}
              {/* TODO 所有Similator、simulator拼写错误，文件夹也要修改 */}
              <SimilatorRender
                list={[...pluginRef.current.similatorPluginList]}
              />
            </div>
          </div>
          <div className="workbench-content-footer">Footer</div>
        </div>
        {/* <div>右侧工具栏</div> */}
      </div>
    );
  }, [injectLoading]);
  const injectPlugin = useCallback<Plugin['injectPlugin']>((...p) => {
    return pluginRef.current.injectPlugin(...p).then(() => {
      setInjectLoading(true);
    });
  }, []);

  return {
    injectPlugin,
    workbench,
  };
};
